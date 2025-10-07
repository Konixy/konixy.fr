export async function load() {
	async function getGithubRepoCount(username: string): Promise<number> {
		const response = await fetch(`https://api.github.com/users/${username}`);
		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status}`);
		}
		const data = await response.json();
		return data.public_repos;
	}

	return {
		repoCount: await getGithubRepoCount('Konixy')
	};
}
