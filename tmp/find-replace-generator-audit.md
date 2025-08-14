# Find & Replace Generator Component Audit Report

## ✅ Working Features

1. **Auto-focus**: Input field auto-focuses on mount (line 39-41) - Working correctly

## ❌ Identified Issues & Gaps

### 1. Global Keyboard Handler Issues (lines 43-86)

#### Issue 1.1: Shift+1/2/3 uses event.key instead of event.code
**Current Code (lines 46-58):**
```typescript
switch (event.key) {
  case '1':  // This becomes '!' on US layout with Shift
  case '2':  // This becomes '@' on US layout with Shift  
  case '3':  // This becomes '#' on US layout with Shift
```
**Problem:** Using `event.key` with Shift gives the shifted character (!/@/#) on many keyboard layouts, not the digit.
**Solution:** Should use `event.code` ('Digit1', 'Digit2', 'Digit3') for consistent behavior.

#### Issue 1.2: Shift+C+number chord not properly implemented
**Current Code (lines 63-73):**
```typescript
case 'C':
  if (event.ctrlKey || event.metaKey) return;
  const keyNumber = parseInt(event.code.replace('Digit', ''));
  // This tries to parse from the 'C' event's code, which is wrong
```
**Problem:** 
- The code tries to extract a number from the 'C' key event's `event.code`, which would be 'KeyC'
- There's no implementation of a 2-step chord (Shift+C then number)
- Should track Shift+C press and then listen for subsequent number press

#### Issue 1.3: isShiftCPressed state is defined but never used
**Current Code (line 33):**
```typescript
const [isShiftCPressed, setIsShiftCPressed] = useState(false);
```
**Problem:** State variable created but never utilized. Likely intended for the chord implementation.

#### Issue 1.4: Shift+Space uses brittle event.key check
**Current Code (lines 59-62):**
```typescript
case ' ':  // Space character literal
  event.preventDefault();
  setActiveTab(prev => prev === 'neovim' ? 'cli' : 'neovim');
```
**Problem:** Using `event.key === ' '` is less reliable than `event.code === 'Space'`

### 2. Enter Key Handler Issues (lines 75-79)

**Current Code:**
```typescript
} else if (event.key === 'Enter') {
  if (findText) {
    setAnimatingCards(new Set());
  }
}
```
**Problems:**
- Only clears animatingCards, doesn't provide any user feedback
- Doesn't indicate what action was taken (if any)
- Should handle empty findText case with feedback
- No actual command generation or copy action

### 3. CommandCard Copy Shortcut Display Issue (lines 305-307, 457)

**Current Code in CommandCard:**
```typescript
<kbd>
  <span className="text-xs">Shift</span>C + {index + 1}
</kbd>
```

**Problem in CLI tab (line 457):**
```typescript
{generateCliCommands().map((cmd, index) => (
  <CommandCard key={index + 100} command={cmd} index={index + 100} />
))}
```
**Issue:** 
- CLI commands have index offset by +100 for React keys
- This makes the displayed shortcut show "Shift+C + 101" instead of "Shift+C + 1"
- The shortcut display incorrectly uses the offset index value

## Summary of Required Fixes

1. **Keyboard Shortcuts:**
   - Replace `event.key` with `event.code` for digit detection
   - Implement proper 2-step chord for Shift+C+number
   - Use `event.code === 'Space'` instead of `event.key === ' '`
   - Actually use the `isShiftCPressed` state for chord tracking

2. **Enter Key:**
   - Add proper feedback when Enter is pressed
   - Handle empty findText with appropriate message
   - Consider triggering a default action (e.g., copy first command)

3. **Copy Shortcuts Display:**
   - Fix CLI tab shortcuts to show correct numbers (1-5) not (101-105)
   - Separate display index from React key index

## Code Quality Notes

- The component is well-structured with proper TypeScript types
- Good use of refs for input focus management
- Syntax highlighting implementation is clean
- Animation states are properly managed
- Toast notifications are in place for copy actions

## Recommendations

1. Create a separate keyboard shortcut manager hook
2. Add visual indicators for active keyboard shortcuts
3. Consider adding a help modal showing all available shortcuts
4. Add tests for keyboard navigation functionality
