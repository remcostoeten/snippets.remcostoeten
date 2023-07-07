import { Layout, Markdown } from 'nextra';

export default function CustomPage() {
    return (
        <Layout title="Custom Page">
            <h1>Welcome to my Custom Page!</h1>
            <p>This is a sample paragraph.</p>
            <Markdown>
                {`
          ### Markdown Content
          
          This is a **Markdown** example.
          
          * Item 1
          * Item 2
          * Item 3
        `}
            </Markdown>
        </Layout>
    );
}
