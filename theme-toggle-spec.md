# Theme Toggle Component Specification

## Overview
A minimalist circular toggle button for switching between light and dark themes with smooth icon transitions and full accessibility support.

## Visual Design

### Dimensions
- **Size**: 36-40px diameter circular button
- **Border**: Subtle border styling
- **Style**: Clean, minimal design with no gradients or particle effects

### Icon System
- **Icons**: Sun (light theme) ↔ Moon (dark theme)
- **Transition**: Cross-fade animation with 150ms duration
- **Behavior**: Icons swap smoothly when theme changes

## Interactive States

### Normal State
- Default appearance with standard opacity and scale

### Hover State
- **Effect**: Light 5% tint overlay
- **Trigger**: Mouse hover or touch interaction

### Active State
- **Effect**: 95% scale transformation
- **Trigger**: Click/tap press state

### Disabled State
- **Effect**: Reduced opacity and non-interactive
- **Trigger**: When toggle functionality is unavailable

## Accessibility Requirements

### Keyboard Navigation
- **Focus Ring**: Visible focus indicator for keyboard navigation
- **Activation**: Space/Enter key support

### Screen Reader Support
- **ARIA Label**: "Toggle theme"
- **Role**: Button with appropriate ARIA attributes

### High Contrast Compliance
- **Standards**: WCAG AA compliance
- **Adaptation**: Maintains visibility in high-contrast modes

## Color System

### Foreground Colors
- **Primary**: Derived from Tailwind CSS variable `--foreground`
- **Secondary**: Derived from Tailwind CSS variable `--muted-foreground`
- **Application**: Used for icon colors and border styling

### Theme Adaptation
- Colors automatically adjust based on current theme (light/dark)
- Maintains consistent contrast ratios across themes

## Technical Requirements

### Animation Specifications
- **Duration**: 150ms for all transitions
- **Easing**: Smooth, natural transition curves
- **Performance**: Hardware-accelerated when possible

### Responsive Behavior
- Consistent size and behavior across all device sizes
- Touch-friendly interaction area (minimum 44px touch target)

## Implementation Notes

### Component Structure
- Single circular button element
- Icon container with cross-fade capability
- Proper semantic HTML structure

### CSS Variables Integration
- Must integrate with existing Tailwind CSS custom properties
- Fallback values for environments without CSS variables

### State Management
- Toggle state persistence across page reloads
- Integration with application theme system
