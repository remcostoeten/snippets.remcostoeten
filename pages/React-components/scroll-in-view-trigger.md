# Scroll-Into-View Animation Guide

This guide walks through the process of creating a scroll-into-view triggered animation using Next.js (in TypeScript), TailwindCSS. The animation is a gradient text animation that is triggered when the text is scrolled into view which can be seen here.

<Image src="/scroll-into-view.gif" alt="Scroll into view gif react hook" width={500} height={500} />
Live Demo: <a href='https://github.com/remcostoeten/remcostoeten/blob/dev/hooks/useInView.tsx' target='_blank'>Here/</a>

Source code <a href='https://github.com/remcostoeten/remco-tools/tree/master/hooks/UseInView.tsx' target='_blank'>https://github.com/remcostoeten/remco-tools/tree/master/hooks/UseInView.tsx</a>

## Steps

### 1. Create

In the `hooks` folder, create a file named `useInView.tsx`:

````tsx filename="useInView.tsx"
'use client';
go
import { useState, useEffect, Ref } from 'react';

interface Options extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

function useInView(options: Options): [Ref<any>, boolean] {
  const [ref, setRef] = useState<Element | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        console.log("Element is in view!");
        if (options.freezeOnceVisible) {
          observer.unobserve(entry.target);
        }
      } else {
        setIsVisible(false);
        console.log("Element is out of view!");
      }
    }, options);

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options]);

  return [setRef, isVisible];
}

export default useInView;```

### 2. Create the Animation Component

In the `components` folder create `AnimatedText.tsx`:

```tsx filename="AnimatedText.tsx"
'use client';

import React from 'react';
import useInView from '../hooks/useInView';  // Adjust the path as necessary

interface AnimatedTextProps {
  text: string;
  italic?: boolean;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, italic = false }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    freezeOnceVisible: true
  });

  const animationClass = inView ? 'animate-gradient-text' : '';

  return (
    <span ref={ref} className={`gradient-text ${animationClass} ${italic ? 'italic' : ''}`}>
      {text}
    </span>
  );
}

export default AnimatedText;
````

### 3. Style the Animation

```css filename="animations.css"
@keyframes gradienText {
  50% {
    background-size: 200% 4px;
  }
  100% {
    background-position: 0 100%;
  }
}

@keyframes gradientTextGrow {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
```

### 4. Use the Animation Component

```tsx filename="SomeComponent.tsx"
'use client';

import AnimatedText from '@/components/AnimatedText';

function SomeComponent() {
  return (
    <div className="my-page-content p-4 screen-h border ">
      Scroll down to see the animation:
    </div>
    <div className='screen-h p-4 border'>
        <AnimatedText text="Passion" />
    </div>
  );
}

export default SomeComponent;
```
