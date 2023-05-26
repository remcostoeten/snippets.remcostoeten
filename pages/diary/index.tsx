import { useContext } from "react";
import { AuthContext } from "@/lib/AuthContext";
import { User } from "@/lib/types";
import { EntryForm } from "../../components/diary/EntryForm";
import { EntriesList } from "../../components/diary/EntriesList";

export default function Index() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <div>Please log in to view this page.</div>;
  }

  const user: User = currentUser;

  return (
    <div>
      <EntryForm user={user} />
      <EntriesList user={user} />
    </div>
  );
}
