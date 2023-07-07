export async function getReadmeContent(repo: string, path: string): Promise<string> {
	const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
	  headers: {
		'Accept': 'application/vnd.github.VERSION.raw',
	  },
	})
  
	if (!response.ok) {
	  throw new Error(`Failed to fetch ${path} from ${repo}`)
	}
  
	return response.text()
  }
  