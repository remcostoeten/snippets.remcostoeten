import React from 'react'
import TreeView from '@/components/TreeView'
import ImportButton from '../components/ui-elements/ImportButton'
import { HomeProps } from '@/lib/types'

const Home: React.FC<HomeProps> = ({ documents }) => {
	return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800">
        <TreeView documents={documents} />
        <ImportButton />
      </div>
      <div className="flex-1 bg-gray-100">Select a document from the tree</div>
    </div>
  )
}

export default Home