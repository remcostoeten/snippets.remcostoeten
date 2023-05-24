const ImportButton = () => {
	const importReadmes = async () => {
	  try {
		await fetch('/api/import', { method: 'POST' })
		alert('Successfully imported README.md files.')
	  } catch (error) {
		console.error('Failed to import README.md files:', error)
	  }
	}
  
	return (
	  <button onClick={importReadmes} className="px-4 py-2 bg-blue-500 text-white rounded">
		Import README.md files
	  </button>
	)
  }
  
  export default ImportButton
  