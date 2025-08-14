---
title: "Project Rules and Guidelines"
description: "Comprehensive framework-agnostic rules for consistent and maintainable code, covering functional programming, styling, state management, and more. Designed for AI agent collaboration to ensure predictable, high-quality output."
language: "TypeScript"
lastModified: "2025-08-13"
---

## Framework Agnostic Approach

These guidelines are designed to work across modern React-based frameworks (React + Vite, Next.js, SolidJS). While the core principles remain consistent, specific implementations may vary slightly based on the framework's reactivity model and conventions.

**Framework Detection**: The AI should identify the target framework from `package.json` dependencies and adapt patterns accordingly:
- **React/Next.js**: Use `useState`, `useEffect`, `useMemo`, standard React patterns
- **SolidJS**: Use `createSignal`, `createEffect`, `createMemo`, fine-grained reactivity
- **Vite + React**: Standard React patterns with Vite-specific build considerations

---

## 1. Core Philosophy: Practical Functional Programming

We write predictable, functional-style code. The primary goal is to produce code that is **pure**, **composable**, **immutable**, and leverages the framework's reactivity model effectively.

*   **Functional Purity**: Functions must be pure. The same input always yields the same output, with no side effects.
*   **Immutability**: Never mutate function arguments or external state. Use immutable patterns (e.g., spreading objects/arrays).
*   **Composition**: Favor composition over inheritance. Build complex functionality from small, reusable parts.
*   **Declarative Style**: Write declarative code that expresses *what* to do, not *how*. Use framework control flow patterns.
*   **Reactive State**: Embrace the framework's reactivity model. Use appropriate state primitives and computed values.

---

## 2. General Code Style

Clarity and consistency are paramount. Code must be self-documenting.

### No Code Comments

Your code must be readable without comments.

*   **Rule**: Do not use inline (`//`) or block (`/* */`) comments.
*   **Exception**: Only comment to clarify highly non-standard or obscure syntax (e.g., complex regex, bitwise operations).
*   **Guideline**: If you feel the need to comment, rewrite the code for clarity using descriptive names.

### Types Over Interfaces

We use `type` for all type definitions to maintain consistency.

*   **Rule**: Use **type exclusively**. Do not use `interface`.
*   **Naming**: All type names **must** be prefixed with a capital `T`. (e.g., `type TUser = { ... }`).
*   **Component Props Typing (TProps)**: If a component file contains **only one non-exported type** for its props, it **MUST** be named exactly `TProps`.
    *   Example:
        ```tsx
        // types.ts (if shared) or local to the component file
        type TProps = {
          name: string;
          onClick?: () => void;
        };

        // React component
        export function Button(props: TProps) {
          return <button onClick={props.onClick}>{props.name}</button>;
        }

        // SolidJS component (preserve reactivity)
        export function Button(props: TProps) {
          return <button onClick={props.onClick}>{props.name}</button>;
        }
        ```

### Naming Conventions

A strict convention for all identifiers makes the codebase predictable.

*   **Variables & Functions**: `camelCase` (e.g., `const userProfile`, `function getUserProfile()`)
*   **Components**: `PascalCase` (e.g., `function UserProfileCard()`)
*   **Constants**: `UPPER_SNAKE_CASE` (e.g., `const API_TIMEOUT = 5000`)
*   **Files & Folders**: `kebab-case` (e.g., `user-profile.tsx`, `auth-utils.ts`)
*   **Types**: `TPascalCase` (e.g., `type TUserProfile`)

---

## 3. Allowed & Disallowed Constructs

### ✓ Allowed

*   **Functions**: Use function declarations only: `function doSomething() {}`.
*   **Loops**: `for`, `for...of`, and `while` loops are allowed **only if the logic is pure**.
*   **Array Methods**: Prefer `map`, `filter`, `reduce` when they improve clarity.
*   **Framework Reactivity**: Use appropriate state management primitives for the target framework.
*   **Framework Control Flow**: Use framework-specific control flow components when available.

### ✗ Not Allowed

*   **No OOP**: No `class`, `extends`, `new`, or `this`.
*   **No Arrow Function Constants**: Do not use `const x = () => {}`. Always use `function x() {}`.
*   **No Unmanaged State**: No shared mutable state **outside of the framework's reactivity system**.
*   **No Unmanaged Side Effects**: No side effects outside of framework effect systems or data fetching utilities.
*   **No Direct DOM Manipulation**: Use framework patterns for DOM updates.

---

## 4. Directory & Module Structure

We use a modular, feature-colocated architecture to promote scalability and maintainability.

*   **No Barrel Files**: Barrel files (`index.ts`) are forbidden to ensure explicit and traceable imports, with the exception of database schema entry points and UI component libraries (`src/components/ui/index.ts` or `src/shared/components/ui/index.ts`).
*   **No Default Exports**: Use **named exports** for everything. The only exception is the root layout/provider component if required by the framework setup, or root page/view components if required by the framework (e.g., Next.js pages).

### Core Directories:

*   `src/` — Always present as the root for application code.
*   `app/` — Only for rendering pages, layouts, and error/not-found pages (Next.js App Router) or entry points.

### Feature/Module Organization (`features/` or `modules/`):

Each feature resides in its own folder (e.g., `authentication/`).
A feature directory can contain:

*   `server/`: Contains `queries/`, `mutations/`, and other server-side functions related to the feature.
    *   `queries/`: Directory containing `index.ts` (barrel file) and individual query files (e.g., `get-user.ts`, `list-users.ts`)
    *   `mutations/`: Directory containing `index.ts` (barrel file) and individual mutation files (e.g., `create-user.ts`, `update-user.ts`)
*   `components/`: UI components specific to this feature.
*   `helpers/`: Utility functions or logic scoped only to this feature.
*   `stores/`: State management for this feature (signals, stores, hooks).
*   `types/`: Type definitions specific to this feature.
*   **Rule**: All logic must be scoped to the feature.
*   **Rule**: Do not put feature-specific code in global `lib/` or `utils/`; keep it inside the feature.

### Shared Resources (`shared/`):

For cross-feature, reusable items.

*   `components/`: Reusable UI components. This includes core layout components, global providers (`providers.tsx`), and custom UI primitives.
*   `hooks/`: Reusable custom hooks (React) or composables (SolidJS).
*   `stores/`: Shared global stores (theme, auth state, etc.).
*   `types/`: Generic types used across multiple features.
*   `helpers/` or `utilities/`: General utility functions.
    *   **Guideline**: Prefer `helpers/` or `utilities/` over `lib/`.
    *   **Guideline**: Avoid generic `utils` folders in favor of scoped `helpers` per feature or well-defined `shared/helpers`.

### Server Logic (`server/` at the root):

For global backend logic not tied to a specific feature.

*   `db/`: Database connection (`db` instance) and schema entry points.
    *   **Database Connection**: Can be imported like: `import { db } from 'db'` (usually maps to `src/server/db/index.ts` or `src/server/db/connection.ts`). Drizzle ORM is the standard for database interaction (e.g., with Turso SQLite or Neon PostgreSQL).
    *   **Database Schema**: The entry point for the database schema (often `src/server/db/schema.ts`) is only responsible for re-exporting individual schemas. Feature schemas live at `src/features/{feature-name}/server/schema/` (if multiple schemas) or `src/features/{feature-name}/server/schema.ts` (if single schema). The main entry point schema file should then look like: `export * from '@/features/auth/server/schema'`.
*   `schema-helpers/`: Schema helpers (e.g., `TTimestampSchema`, `TBaseEntitySchema` with ID).
*   `utils/`: Global server utilities.

### Project Structure Example:

```
src/
├── app/                  # Framework-specific app shell
│   ├── layout.tsx        # (Next.js) or root component
│   └── page.tsx          # (Next.js) or routing setup
├── components             #One time use compoentsn often
│   │   └── providers.tsx # Global context providers (sidebar, tooltipprovider, authprovider etc etc)
│   │   └── header.tsx 
│   │   └── footer.tsx 
│   │   └── wrapper.tsx #
├── features/             # Feature-specific modules
│   └── auth/             # Example: "auth" feature
│       ├── server/       # Server functions specific to auth
│       │   ├── queries/
│       │   │   ├── index.ts      # Re-exports all queries
│       │   │   ├── get-user.ts   # Individual query function
│       │   │   └── verify-session.ts
│       │   ├── mutations/
│       │   │   ├── index.ts      # Re-exports all mutations
│       │   │   ├── login-user.ts # Individual mutation function
│       │   │   └── logout-user.ts
│       │   └── schema.ts         # Auth-specific database schema
│       ├── components/   # Components specific to this feature
│       │   └── login-form.tsx
│       ├── helpers/      # Utilities specific to auth
│       │   └── auth-utils.ts
│       ├── stores/       # State management for auth
│       │   └── auth-store.ts
│       └── types.ts      # Types specific to this feature
├── shared/               # Code shared across multiple features
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # UI component library (optional Shadcn UI)
│   │   │   ├── button.tsx
│   │   │   └── index.ts  # Re-exports all shared UI components
│   ├── hooks/            # Reusable custom hooks/composables
│   ├── stores/           # Shared global stores
│   ├── helpers/          # Shared utility functions
│   └── styles/           # Global styles, theme variables
│   └── whatever-is-needed # optional
├── server/               # Root server-side logic
│   ├── db/               # Database connection and main schema entry point
│   │   ├── connection.ts # Drizzle DB instance (e.g., Turso, Neon)
│   │   └── schema.ts     # Main schema file (re-exports feature schemas)
│   ├── schema-helpers/   # Generic schema parts (e.g., timestamps)
│   │   └── base-schema.ts
│   └── utilities/            # Global server utilities
│       └── middleware.ts
└── views/                # Top-level view components rendered by pages
    └── login-view.tsx
```

### Export and Page Structure

*   ✗ No default exports anywhere **except** in **pages** and **views**.
*   Use **named exports only** for all modules and components (e.g., `export function foo() {}`).
*   **Pages and views** may use default exports **only** for framework components (if required).

### Page Files Rules:

*   A page may never contain logic.
*   It may only return a `View` and optionally Metadata.

Views are the render of the page, consisting of all UI components and logic coming together.

*   The naming convention for views is `*MODULE_NAME*-view.tsx` (e.g., `login-view.tsx`, `dashboard-view.tsx`, `settings-view.tsx`).
*   Views are located in the `/views` or `src/views` directory.
*   The `views` directory never makes use of a barrel file.

---

## 5. State & Logic Management

### Framework-Specific State Management

The AI should detect and use appropriate state management patterns based on the target framework:

**React/Next.js**:
```tsx
const [count, setCount] = useState(0);
const doubledCount = useMemo(() => count * 2, [count]);
useEffect(() => {
  // side effects
}, [dependency]);
```

**SolidJS**:
```tsx
const [count, setCount] = createSignal(0);
const doubledCount = createMemo(() => count() * 2);
createEffect(() => {
  // side effects
});
```

### Complex State Management

For complex state with multiple actions, especially for persistence across routing or global accessibility, the AI should identify and leverage existing state management libraries in the project (`package.json`). The goal is to avoid excessive state hooks and ensure state is managed efficiently and scalably.

*   **Primary Strategy**: The AI **must** first check `package.json` for dedicated state management libraries (e.g., `jotai`, `zustand`, `solid-state`, `tanstack-store`, etc.). If a library is detected, the AI **must** propose and implement a solution utilizing that library, emphasizing reusable, functional patterns (e.g., atoms, slices, stores) appropriate for the chosen library.
*   **Fallback Strategy (Reducers)**: If no dedicated state management library is present, the AI **must** utilize pure reducer functions in combination with the framework's state primitives for managing complex local state.
    *   **Rule**: Keep reducer functions pure: `(state, action) => newState`.
    *   **Implementation**: Use appropriate state primitives to hold the state, and dispatch actions to a pure reducer that calculates the next state.
    *   **Guideline**: Avoid sprawling imperative code or deeply nested conditionals—prefer reducer composition and clear action types.
    *   **Guideline**: Use reducers to encapsulate complex transformations, especially for UI state or domain logic.
    *   **Guideline**: Connect reducers via the framework's reactivity system or invoke them directly in server functions or utilities.
    *   **Guideline**: Prefer reducers over multiple state hooks when state shape or transitions become complex.
    *   **Guideline**: Keep reducer logic separate from UI code — export from dedicated files.

**Reducer Example:**

```ts
type TAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset'; payload: number };

function counterReducer(state: number, action: TAction): number {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    case 'reset': return action.payload;
    default: return state;
  }
}

// React implementation:
// const [count, setCount] = useState(0);
// const dispatch = (action: TAction) => setCount(prev => counterReducer(prev, action));

// SolidJS implementation:
// const [count, setCount] = createSignal(0);
// const dispatch = (action: TAction) => setCount(prev => counterReducer(prev, action));
```

---

## 6. Data Layer & Error Handling

### Functional Factories for Database

Use a standardized functional factory pattern for all Drizzle ORM operations to ensure consistency and reusability. Factories handle only DB access; business logic stays separate.

The reducer pattern only has very specific use cases. You should audit the package.json and find out if you're either using Zustand or Jotai or Falteo or any other state management library. If that's the case, then obviously we don't use reducers and we use the patterns of that library. If it's a very common pattern we're using, we should create an abstraction, either a factory or helper utility, above that library and then use that.

*   **Rule**: Use only named async functions inside factories; no arrow constants.
*   **Rule**: Factories must be pure functions returning an object with named CRUD async functions: `create`, `read`, `update`, `delete`.
*   **Rule**: Factories accept Drizzle ORM `db` instance as a parameter.
*   **Guideline**: Avoid duplicating CRUD logic; reuse factories across server actions/functions.
*   **Guideline**: Factories handle only DB access and mapping; business logic stays outside.
*   **Guideline**: Use strong TypeScript generics for input/output types.
*   **Guideline**: Factories must return full entities after create or update.
*   **Rule**: Export factory functions and server actions as named exports only.
*   **Rule**: No default exports for factory or server action functions.
*   **Rule**: No raw SQL or string interpolations inside factories; use Drizzle ORM query builder.

### Base Types for Entities

*   **Rule**: Define extensible `TTimestamps` type for `createdAt` and `updatedAt` as `Date` or compatible.
*   **Rule**: Define generic base entity type `TBaseEntity` with:
    *   `id: number`
    *   timestamps via `TTimestamps`
*   **Rule**: Entity-specific types extend from `TBaseEntity` by intersection or extension.
*   **Rule**: Use only `type` aliases (never `interface`).
*   **Rule**: Prefix all types with capital `T` (e.g., `TProps`, `TTimestamps`).

### Error Handling Strategy

Functions that can fail (e.g., API calls, DB queries) **must not throw**. They must return a `TResult` object to make success and failure explicit.

**TResult Type:**

```ts
type TSuccess<T> = { ok: true; value: T };
type TFailure<E> = { ok: false; error: E };
type TResult<T, E> = TSuccess<T> | TFailure<E>;
```

**Factory Example with Error Handling:**

```ts
import { users, TUser } from '@/features/auth/server/schema';
import { db } from 'db';

function createUserFactory(dbInstance: typeof db) {
  async function findById(id: number): Promise<TResult<TUser, string>> {
    try {
      const user = await dbInstance.query.users.findFirst({ 
        where: (users, { eq }) => eq(users.id, id) 
      });
      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      return { ok: true, value: user };
    } catch (e) {
      console.error(e);
      return { ok: false, error: 'Database query failed' };
    }
  }

  return { findById };
}

export const userRepo = createUserFactory(db);
```

---

## 7. Development Tooling & Environment

### Package Manager

A strict policy on package managers ensures a consistent and fast development environment.

*   **Primary Manager**: Always use **bun** for all dependency management and script execution (`bun install`, `bun run dev`).
*   **Fallback Manager**: If bun fails for any reason, the designated fallback is **pnpm**.
*   **Forbidden Managers**: Do **not** use `npm` or `yarn`.

---

## 8. AI Collaboration & Workflow

These rules govern how I, the AI assistant, will approach tasks to ensure a predictable and iterative workflow.

*   **Framework Detection**: I will first identify the target framework from `package.json` and adapt all patterns accordingly.
*   **Focus & Completion**: I will finish the current task, scope, or feature **completely** as requested. I **will not get sidetracked** or start implementing tangential or hypothetical features.
*   **No Mock Implementations**: I will provide only concrete, functional code. I **will not** include placeholder or mock implementations unless explicitly requested for scaffolding purposes.
*   **Task Granularity**: All work will be broken down into the smallest possible, isolated tasks. This allows for incremental development and reduces the risk of incomplete features.
*   **Large Task Planning**:
    *   If a task is too large for a single step, I will first create a detailed plan.
    *   The plan will be a markdown file with sections and checkboxes, located in a `tmp/` directory (which should be added to `.gitignore`).
*   **Iterative Review Process**:
    *   After completing **each section** from the plan file, I will **STOP** the process entirely.
    *   I will then prompt you to review the completed work.
    *   You should commit and push the changes before instructing me to continue to the next section. This ensures continuous integration and avoids half-finished work accumulating.

---

## 9. Styling

*   **Methodology**: Use **Tailwind CSS** for all styling.
*   **No Custom CSS**: Most should be done via tailwind, if u need specific css or beziers etc. create a seperate file in */styles/components,modules,whatever}/name.css and import in the main css file.
*   **Dynamic Classes**: Use a library like `clsx` or `cn` to conditionally apply classes cleanly. this can be imported like so: import { cn} from 'utilities' as its mapped via tsconfig.
*   **UI Components**: Common UI components can be imported like: `import { Card, Button, Tooltip, TooltipProvider } from 'ui'`. as the barrel file is also mapped Note that the use of Shadcn UI is not mandatory across the entire project; custom UI components (`shared/components/primitives/`) are also encouraged.

---

## 10. Testing Policy

*   **No Tests by Default**: We do not write tests unless explicitly requested.
*   **Discuss First**: If you believe tests are necessary, discuss the rationale first and proceed only upon confirmation.
*   **Framework Agnosticism**: When tests are written, they should be agnostic to the specific framework implementation details where possible.
