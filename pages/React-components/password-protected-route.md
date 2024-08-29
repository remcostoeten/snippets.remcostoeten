# My usePasswordProtection Hook

The `usePasswordProtection` is a custom React hook that helps you protect content with a password. This component is particularly useful when you want to restrict access to certain parts of your application. Data won't be loaded in the DOM untill passphrase is entered but i'm unsure how secure this is. For data that needs to be secure opt for a database solution e.g. my firebase post.

In this article, we will go through various scenarios in which you can use the `usePasswordProtection` hook.

## Setup requirments

```bash filename="script to run in terminal" copy
#!/bin/bash

# Create and populate the .env file
touch .env;
echo 'PASSWORD="123"' > .env;

# Create the 'lib' directory and download 'usePasswordProtection.tsx'
mkdir -p lib;
curl -o lib/usePasswordProtection.tsx -LJO https://github.com/remcostoeten/dbnote/raw/master/lib/usePasswordProtection.tsx;

# Download 'toast.tsx' in the 'components' directory
mkdir -p components/ui;
curl -o components/ui/toast.tsx -LJO https://github.com/remcostoeten/dbnote/raw/master/components/ui/toast.tsx;

# Requirments for toast
;npm i @radix-ui/react-toast; npm i class-variance-authority;npm i lucide-react


# Display a success message
echo "Script executed successfully."

```

## Basic Usage

First, let's start with a basic example. Here is how you can use the `usePasswordProtection` hook to protect a part of your component:

```jsx
import { usePasswordProtection } from '@/lib/usePasswordProtection';

const SomeComponent: React.FC = () => {
  const correctPassword = "mySecret";
  const { isAuthenticated, password, setPassword, handlePasswordSubmit } = usePasswordProtection(correctPassword);

  return (
    <div>
      {isAuthenticated ? (
        <>
          {/* The protected content */}
        </>
      ) : (
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default SomeComponent;
```

In this example, `SomeComponent` will render a password input form until the correct password is entered. Once authenticated, the protected content will be displayed.

## Scenario 1: Protecting a Route

You can use the `usePasswordProtection` hook to protect a specific route in your application. Here is how you can do it using `react-router-dom`:

```jsx
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { usePasswordProtection } from '@/ib/usePasswordProtection';

const ProtectedRoute: React.FC = () => {
  const correctPassword = "mySecret";
  const { isAuthenticated, password, setPassword, handlePasswordSubmit } = usePasswordProtection(correctPassword);

  return (
    <Router>
      <Route path="/protected">
        {isAuthenticated ? (
          <>
            {/* The protected content */}
          </>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </Route>
    </Router>
  );
};

export default ProtectedRoute;
```

In this scenario, the `/protected` route will be protected by a password. Users will need to enter the correct password to access the content of this route.

## Scenario 2: Protecting Content Behind a Modal

You can also use the `usePasswordProtection` hook to protect content behind a modal. Here is how you can do it:

```jsx
import React from "react";
import { Modal } from "some-modal-library";
import { usePasswordProtection } from '@/ib/usePasswordProtection';

const ProtectedModal: React.FC = () => {
  const correctPassword = "mySecret";
  const { isAuthenticated, password, setPassword, handlePasswordSubmit } = usePasswordProtection(correctPassword);

  return (
    <Modal isOpen={!isAuthenticated}>
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
};

export default ProtectedModal;
```

In this scenario, the content behind the modal will be protected by a password. The modal will stay open until the user enters the correct password.

## Conclusion

The `usePasswordProtection` hook is a versatile tool that can be used in various scenarios to protect content with a password. Whether you are protecting a route, a modal, or any other part of your application, this hook can be a great addition to your toolkit. A live example of partial protection can be found <a href="https://remcostoeten.com/income" target="_blank">here</a>. Code can be found <a href="https://github.com/remcostoeten/dbnote/blob/master/app/(regular)/(nolayout)/(tools)/income/page.tsx" target="_blank">here</a>.
