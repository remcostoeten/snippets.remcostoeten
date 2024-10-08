---
title: "useHandleMouseMove Hook"
---

# useHandleMouseMove Hook

The `useHandleMouseMove` is a custom React hook that handles mouse movement events for elements with a specified class name. Result can we seen <a href="https://remcostoeten.com/showcase/use-mouse" target="_blank">here</a>.

## Usage

1. Import the hook:

```javascript
import useHandleMouseMove from "@hooks/useHandleMouseMove";
```

2. Use the hook in your component, passing the class name of the elements you want to handle mouse movement for:

```javascript
useHandleMouseMove("your-class-name");
```

## Example

Below is an example of how to use the `useHandleMouseMove` hook in a component:

```typescript
import React from 'react';
import useHandleMouseMove from '@/hooks/useHandleMouseMove';

const YourComponent: React.FC = () => {
  useHandleMouseMove('mouse-element');

  return (
    <div className="intro mouse-element">
      <p>This is some random text</p>
    </div>
  );
};

export default YourComponent;
```

In this example, the `useHandleMouseMove` hook is used to handle mouse movement for all elements with the class name `mouse-element`.

## Parameters

- `className` (string): The class name of the elements to handle mouse movement for.

## Returns

This hook does not return any value.

## Dependencies

- `react`

```bash
npm install react
```
