<script lang="ts">
	let { data } = $props();
	let editContents = $state<Record<string, string>>({});
	let savingStates = $state<Record<string, boolean>>({});
	let saveStatuses = $state<Record<string, string | null>>({});

	// Initialize edit contents from data
	$effect(() => {
		const contents: Record<string, string> = {};
		data.specFiles.forEach((file) => {
			contents[file.id] = file.content;
		});
		editContents = contents;
	});

	async function saveFile(fileId: string) {
		savingStates[fileId] = true;
		saveStatuses[fileId] = null;

		try {
			const response = await fetch('/config', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'save',
					id: fileId,
					content: editContents[fileId]
				})
			});

			if (response.ok) {
				saveStatuses[fileId] = 'Saved successfully!';
			} else {
				saveStatuses[fileId] = 'Error saving file';
			}
		} catch (error) {
			saveStatuses[fileId] = 'Error saving file';
			console.error('Save error:', error);
		} finally {
			savingStates[fileId] = false;
		}
	}

	function hasChanges(fileId: string): boolean {
		const file = data.specFiles.find((f) => f.id === fileId);
		return file ? editContents[fileId] !== file.content : false;
	}
</script>

<div class="max-w-7xl mx-auto">
	<h1 class="text-3xl font-bold mb-6">Configuration Files</h1>

	{#if data.specFiles.length === 0}
		<div class="alert">
			<span>No configuration files available</span>
		</div>
	{:else}
		<div class="space-y-8">
			{#each data.specFiles as file}
				<div>
					<h2 class="text-xl font-bold capitalize mb-4">{file.name}</h2>

					<textarea
						class="textarea textarea-bordered w-full h-64 font-mono"
						bind:value={editContents[file.id]}
						placeholder="Edit markdown content..."
					></textarea>

					<div class="flex justify-end items-center gap-4 mt-4">
						{#if saveStatuses[file.id]}
							<div
								class="alert alert-sm"
								class:alert-success={saveStatuses[file.id]?.includes('success')}
								class:alert-error={saveStatuses[file.id]?.includes('Error')}
							>
								<span>{saveStatuses[file.id]}</span>
							</div>
						{/if}
						<button
							class="btn btn-primary btn-sm"
							onclick={() => saveFile(file.id)}
							disabled={savingStates[file.id] || !hasChanges(file.id)}
						>
							{savingStates[file.id] ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
