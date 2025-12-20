import { getSpecFiles } from '$lib/server/filesystem';

export async function load() {
	const specFiles = await getSpecFiles();
	return {
		specFiles
	};
}
