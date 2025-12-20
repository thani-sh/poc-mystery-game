<script lang="ts">
	let { data } = $props();
	let editContent = $state(data.actor.content);
	let generating = $state(false);
	let generatingExpression = $state<Record<string, boolean>>({});
	let generatingFrame = $state<Record<string, boolean>>({});
	let saving = $state(false);
	let status = $state<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

	// Use $derived for values computed from props to avoid effect loops
	let conceptUrl = $derived(data.conceptDataUrl);
	let speechPortraits = $derived(
		Object.fromEntries(
			data.expressionTypes.map((type) => [type, data.speechPortraits[type]?.dataUrl || null])
		)
	);
	let frames = $derived(
		Object.fromEntries(data.frameTypes.map((type) => [type, data.frames[type]?.dataUrl || null]))
	);

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

	async function generateSpeechPortrait(expressionType: string) {
		generatingExpression[expressionType] = true;
		status = { type: 'info', message: `Generating ${expressionType} expression...` };

		try {
			const response = await fetch(`/actors/${data.actor.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'generate-speech',
					expressionType
				})
			});

			const result = await response.json();

			if (result.success) {
				status = {
					type: 'success',
					message: `${expressionType} expression generated successfully!`
				};
				// Reload the page to get the new portrait
				window.location.reload();
			} else {
				status = {
					type: 'error',
					message: result.error || `Failed to generate ${expressionType} expression`
				};
			}
		} catch (error) {
			status = { type: 'error', message: `Error generating ${expressionType} expression` };
			console.error('Generate error:', error);
		} finally {
			generatingExpression[expressionType] = false;
		}
	}

	async function generateFrame(frameType: string) {
		generatingFrame[frameType] = true;
		status = { type: 'info', message: `Generating ${frameType} frame...` };

		try {
			const response = await fetch(`/actors/${data.actor.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'generate-frame',
					frameType
				})
			});

			const result = await response.json();

			if (result.success) {
				status = { type: 'success', message: `${frameType} frame generated successfully!` };
				// Reload the page to get the new frame
				window.location.reload();
			} else {
				status = {
					type: 'error',
					message: result.error || `Failed to generate ${frameType} frame`
				};
			}
		} catch (error) {
			status = { type: 'error', message: `Error generating ${frameType} frame` };
			console.error('Generate error:', error);
		} finally {
			generatingFrame[frameType] = false;
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

	<div class="max-w-3xl mx-auto space-y-6">
		<!-- Character Editor -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Character Description</h2>

				<textarea
					class="textarea textarea-bordered w-full h-64 font-mono"
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

		<!-- Concept Preview -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Concept Art</h2>

				<div class="bg-base-200 rounded-lg p-4 aspect-square flex items-center justify-center">
					{#if conceptUrl}
						<img src={conceptUrl} alt={data.actor.name} class="w-full h-full object-contain" />
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

		<!-- Speech Portraits -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">Speech Portraits</h2>

				{#if !conceptUrl}
					<div class="alert alert-warning mb-4">
						<span class="text-sm">Generate a concept first to create speech portraits</span>
					</div>
				{/if}

				<!-- Horizontal scrollable container -->
				<div class="flex gap-4 overflow-x-auto pb-2">
					{#each data.expressionTypes as expressionType}
						<div class="shrink-0 w-64">
							<h3 class="font-semibold mb-2 text-sm capitalize">
								{expressionType.replace(/-/g, ' ')}
							</h3>
							<div
								class="bg-base-200 rounded-lg p-4 aspect-square flex items-center justify-center"
							>
								{#if speechPortraits[expressionType]}
									<img
										src={speechPortraits[expressionType]}
										alt="{data.actor.name} - {expressionType}"
										class="w-full h-full object-contain"
									/>
								{:else}
									<div class="text-center text-base-content/50">
										<div class="text-4xl mb-2">😐</div>
										<p class="text-xs">No {expressionType} portrait yet</p>
									</div>
								{/if}
							</div>
							<button
								class="btn btn-sm btn-primary w-full mt-2"
								onclick={() => generateSpeechPortrait(expressionType)}
								disabled={generatingExpression[expressionType] || !conceptUrl}
							>
								{generatingExpression[expressionType]
									? 'Generating...'
									: speechPortraits[expressionType]
										? 'Regenerate'
										: 'Generate'}
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Character Frames -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">Character Frames</h2>

				{#if !conceptUrl}
					<div class="alert alert-warning mb-4">
						<span class="text-sm">Generate a concept first to create character frames</span>
					</div>
				{/if}

				<!-- Horizontal scrollable container -->
				<div class="flex gap-4 overflow-x-auto pb-2">
					{#each data.frameTypes as frameType}
						<div class="shrink-0 w-64">
							<h3 class="font-semibold mb-2 text-sm capitalize">{frameType.replace(/-/g, ' ')}</h3>
							<div
								class="bg-base-200 rounded-lg p-4 aspect-square flex items-center justify-center"
							>
								{#if frames[frameType]}
									<img
										src={frames[frameType]}
										alt="{data.actor.name} - {frameType}"
										class="w-full h-full object-contain"
									/>
								{:else}
									<div class="text-center text-base-content/50">
										<div class="text-4xl mb-2">🚶</div>
										<p class="text-xs">No {frameType} frame yet</p>
									</div>
								{/if}
							</div>
							<button
								class="btn btn-sm btn-primary w-full mt-2"
								onclick={() => generateFrame(frameType)}
								disabled={generatingFrame[frameType] || !conceptUrl}
							>
								{generatingFrame[frameType]
									? 'Generating...'
									: frames[frameType]
										? 'Regenerate'
										: 'Generate'}
							</button>
						</div>
					{/each}
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
