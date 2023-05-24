import { GetServerSideProps } from 'next';
import { getDocuments, DocumentData } from '../lib/firestore';

interface HomeProps {
  documents: DocumentData[];
}

const Home: React.FC<HomeProps> = ({ documents }) => {
  return (
    <div>
      {documents.map(document => (
        <div key={document.id}>
          <h2>{document.title}</h2>
          <p>{document.content}</p>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const documents = await getDocuments();
  
  return {
    props: {
      documents
    }
  };
}

export default Home;
