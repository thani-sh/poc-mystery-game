<script lang="ts">
	let { data } = $props();
	let editContent = $state('');
	let generating = $state(false);
	let saving = $state(false);
	let status = $state<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
	let conceptUrl = $state<string | null>(null);

	// Initialize from data
	$effect(() => {
		editContent = data.actor.content;
		conceptUrl = data.conceptDataUrl;
	});

	async function generateConcept() {
		generating = true;
		status = { type: 'info', message: 'Generating concept...' };

		try {
			const response = await fetch(`/actors/${data.actor.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'generate'
				})
			});

			const result = await response.json();

			if (result.success) {
				status = { type: 'success', message: 'Concept generated successfully!' };
				// Reload the page to get the new portrait
				window.location.reload();
			} else {
				status = { type: 'error', message: result.error || 'Failed to generate concept' };
			}
		} catch (error) {
			status = { type: 'error', message: 'Error generating concept' };
			console.error('Generate error:', error);
		} finally {
			generating = false;
		}
	}

	async function saveChanges() {
		saving = true;
		status = null;

		try {
			const response = await fetch(`/actors/${data.actor.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'save',
					content: editContent
				})
			});

			if (response.ok) {
				status = { type: 'success', message: 'Changes saved successfully!' };
				data.actor.content = editContent;
			} else {
				status = { type: 'error', message: 'Failed to save changes' };
			}
		} catch (error) {
			status = { type: 'error', message: 'Error saving changes' };
			console.error('Save error:', error);
		} finally {
			saving = false;
		}
	}
</script>

<div class="max-w-7xl mx-auto">
	<div class="mb-6">
		<a href="/actors" class="btn btn-ghost btn-sm">← Back to Actors</a>
	</div>

	<h1 class="text-3xl font-bold mb-6">{data.actor.name}</h1>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Concept Preview -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Concept Art</h2>

				<div class="bg-base-200 rounded-lg p-4 min-h-96 flex items-center justify-center">
					{#if conceptUrl}
						<img
							src={conceptUrl}
							alt={data.actor.name}
							class="max-w-full max-h-96 object-contain"
						/>
					{:else}
						<div class="text-center text-base-content/50">
							<div class="text-6xl mb-4">👤</div>
							<p>No concept generated yet</p>
						</div>
					{/if}
				</div>

				<div class="card-actions justify-end mt-4">
					<button class="btn btn-primary" onclick={generateConcept} disabled={generating}>
						{generating ? 'Generating...' : conceptUrl ? 'Regenerate Concept' : 'Generate Concept'}
					</button>
				</div>
			</div>
		</div>

		<!-- Character Editor -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Character Description</h2>

				<textarea
					class="textarea textarea-bordered w-full h-96 font-mono"
					bind:value={editContent}
					placeholder="Edit character description..."
				></textarea>

				<div class="card-actions justify-end mt-4">
					<button
						class="btn btn-secondary"
						onclick={saveChanges}
						disabled={saving || editContent === data.actor.content}
					>
						{saving ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Status Messages -->
	{#if status}
		<div
			class="alert mt-6"
			class:alert-success={status.type === 'success'}
			class:alert-error={status.type === 'error'}
			class:alert-info={status.type === 'info'}
		>
			<span>{status.message}</span>
		</div>
	{/if}
</div>
