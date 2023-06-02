import { ReactNode } from "react";

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}


export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  content: string;
}

export interface HomeProps {
  user: AppUser;
  documents: DocumentData[];
}

export interface DocumentData {
  id: string;
  title: string;
  content: string;
}

export interface Entry {
  id?: string;
  date: Date;
  title: string;
  content: string;
  userId: string;
}