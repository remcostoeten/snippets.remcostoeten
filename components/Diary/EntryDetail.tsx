import { useState } from 'react';
import { EntryForm } from './EntryForm';

interface Entry {
  title: string;
  content: string;
  id: string;
}

interface EntryDetailProps {
  entry: Entry;
  deleteEntry: (id: string) => void;
}

export const EntryDetail: React.FC<EntryDetailProps> = ({ entry, deleteEntry }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return entry ? (
    <div className="max-w-lg mx-auto mt-4">
      {isEditing ? (
        <EntryForm entry={entry} user={undefined} />
      ) : (
        <>
          <h1 className="mb-2 text-xl font-bold">{entry.title}</h1>
          <p className="mb-2">{entry.content}</p>
          <div className="flex">
            <button onClick={handleEditClick} className="px-4 py-2 bg-blue-600 text-white rounded mr-2">Edit</button>
            <button onClick={() => deleteEntry(entry.id)} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
          </div>
        </>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  );
};
