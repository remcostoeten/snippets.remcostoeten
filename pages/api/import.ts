import type { NextApiRequest, NextApiResponse } from 'next'
import { getReadmeContent } from '../../lib/github'
import { addDocument } from '../../lib/firestore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()  // Method Not Allowed
  }

  // Array of file paths to import
  const files = ['README.md', 'folder1/README.md', 'folder2/README.md']

  for (const file of files) {
    const content = await getReadmeContent('remcostoeten/personal-producitvity-tools', file)
    
    const newDocument = {
      title: file.split('/').pop()?.replace('.md', ''),
      content: content,
    }

    await addDocument(newDocument)
  }

  res.status(200).end()  // OK
}
