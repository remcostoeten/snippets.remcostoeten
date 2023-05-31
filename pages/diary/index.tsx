import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { CustomDocumentData, handleAddDocument, handleEditDocument, handleDeleteDocument, getDocuments } from '@/lib/firebase';
import Highlighter from "react-highlight-words";

export default function DiaryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [documents, setDocuments] = useState<CustomDocumentData[]>([]);
  const [highlightText, setHighlightText] = useState('');
  const [newPost, setNewPost] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostContent, setEditingPostContent] = useState('');

  useEffect(() => {
    getDocuments().then(setDocuments);
  }, []);

  const handleDateChange = (date: Date | Date[]) => {
    setSelectedDate(date as Date);
  };

  const handleNewPostChange = (e) => {
    setNewPost(e.target.value);
  };

  const handleAddPost = () => {
    handleAddDocument(newPost).then(setDocuments);
    setNewPost('');
  };

  const handleEditPost = (id, content) => {
    setEditingPostId(id);
    setEditingPostContent(content);
  };

  const handleDeletePost = (id) => {
    handleDeleteDocument(id).then(setDocuments);
  };

  const handleEditPostSubmit = () => {
    handleEditDocument(editingPostId, editingPostContent).then(setDocuments);
    setEditingPostId(null);
    setEditingPostContent('');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <Calendar onChange={handleDateChange} value={selectedDate} className="text-center"/>
            </div>
            <div className="mt-5">
              <input 
                type="text" 
                placeholder="Search..."
                className="mt-1 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0" 
                onChange={(e) => setHighlightText(e.target.value)}
              />
              <input 
                type="text"
                placeholder="New Post..."
                value={newPost}
                onChange={handleNewPostChange}
              />
              <button onClick={handleAddPost}>Add Post</button>
              {editingPostId && (
                <div>
                  <input 
                    type="text"
                    value={editingPostContent}
                    onChange={(e) => setEditingPostContent(e.target.value)}
                  />
                  <button onClick={handleEditPostSubmit}>Submit Edit</button>
                </div>
              )}
            </div>
            {documents.map((doc) => (
              <div key={doc.id} className="mt-5">
                <div className="border-2 border-gray-300 rounded-md p-2 my-2 shadow-sm">
                  <Highlighter
                    highlightClassName="bg-yellow-300"
                    searchWords={[highlightText]}
                    autoEscape={true}
                    textToHighlight={doc.title}
                  />
                  <p className="text-sm">{format(selectedDate, 'dd/MM/yyyy')}</p>
                  <Highlighter
                    highlightClassName="bg-yellow-300"
                    searchWords={[highlightText]}
                    autoEscape={true}
                    textToHighlight={doc.content}
                  />
                  <button onClick={() => handleEditPost(doc.id, doc.content)}>Edit</button>
                  <button onClick={() => handleDeletePost(doc.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
