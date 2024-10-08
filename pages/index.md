# Setup firebase with firestore data in NextJS

## Install Required Packages

```shell filename="Install Packages" copy
npm install firebase @radix-ui/react-popover react-quill lucide-react date-fns framer-motion
```

## Set up Firebase

Create a file called `firebase.js` in a folder called `lib` in the root of your project and add your Firebase configuration:

```javascript filename="lib/firebase.js" copy
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```

## Create the Component

Create a new component called `NewItem.tsx` in the `components` folder:

```tsx filename="components/NewItem.tsx" copy
"use client";
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";

interface NewItemProps {
  content?: string;
}

export function NewItem({ content }: NewItemProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [label, setLabel] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("user", user);
      }
      setLoading(false);
    });
    return (): void => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newItem: Item = {
        title,
        userId: user.uid,
        description: markdownContent,
        createdAt: serverTimestamp(),
        id: "",
        subject,
        selectedDate: date,
        label,
      };

      const docRef = await addDoc(collection(db, "items"), newItem);
      newItem.id = docRef.id;

      setItems((prevItems: Item[]) => [newItem, ...prevItems]);
      setDescription("");
      setTitle("");
      setDate(null);
      setSubject("");
      setLabel("");
      setMarkdownContent("");
      toast({
        title: "Item created successfully.",
        description: `with title ${title}`,
      });
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: `Your request failed. Please try again. ${error}`,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  // Render form and other JSX here...

  return <>{/* Render Drawer and other JSX here... */}</>;
}
```

In this component:

- We have used the `useState` hook to manage the local state for title, date, description, label, and items.
- The `handleSubmit` function is used to post the data to Firestore. It creates a new item object, posts it to Firestore, and then adds it to the local state.
- The `Popover` component from `@radix-ui/react-popover` is used to create a dropdown for selecting a date and a label.
- The `ReactQuill` component is used for the description input field to allow markdown input.
- The `Drawer` component from `vaul` is used to toggle the visibility of the form.

## Fetching the Data

To fetch the data from Firestore and display it, you can create a separate component or use the `useEffect` hook in the `NewItem` component or another parent component.

In the `useEffect` hook, you can use the `onSnapshot` function from `firebase/firestore` to listen for real-time updates from Firestore and update the local state accordingly.

```tsx filename="Fetching Data" copy
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "items"), (snapshot) => {
    const fetchedItems: Item[] = [];
    snapshot.forEach((doc) => {
      const item = doc.data() as Item;
      item.id = doc.id;
      fetchedItems.push(item);
    });
    setItems(fetchedItems);
  });
  return (): void => unsubscribe();
}, []);
```
