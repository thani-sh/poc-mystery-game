<script lang="ts">
	let { data } = $props();
	let editContent = $state('');
	let generating = $state(false);
	let generatingSpeechNeutral = $state(false);
	let generatingSpeechTalking = $state(false);
	let saving = $state(false);
	let status = $state<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
	let conceptUrl = $state<string | null>(null);
	let speechNeutralUrl = $state<string | null>(null);
	let speechTalkingUrl = $state<string | null>(null);

	// Initialize from data
	$effect(() => {
		editContent = data.actor.content;
		conceptUrl = data.conceptDataUrl;
		speechNeutralUrl = data.speechNeutralDataUrl;
		speechTalkingUrl = data.speechTalkingDataUrl;
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

	async function generateSpeechPortrait(type: 'neutral' | 'talking') {
		const isNeutral = type === 'neutral';
		if (isNeutral) {
			generatingSpeechNeutral = true;
		} else {
			generatingSpeechTalking = true;
		}
		status = { type: 'info', message: `Generating ${type} speech portrait...` };

		try {
			const response = await fetch(`/actors/${data.actor.id}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: `generate-speech-${type}`
				})
			});

			const result = await response.json();

			if (result.success) {
				status = { type: 'success', message: `${type} speech portrait generated successfully!` };
				// Reload the page to get the new portrait
				window.location.reload();
			} else {
				status = {
					type: 'error',
					message: result.error || `Failed to generate ${type} speech portrait`
				};
			}
		} catch (error) {
			status = { type: 'error', message: `Error generating ${type} speech portrait` };
			console.error('Generate error:', error);
		} finally {
			if (isNeutral) {
				generatingSpeechNeutral = false;
			} else {
				generatingSpeechTalking = false;
			}
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
					<!-- Neutral Expression -->
					<div class="shrink-0 w-64">
						<h3 class="font-semibold mb-2 text-sm">Neutral Expression</h3>
						<div class="bg-base-200 rounded-lg p-4 aspect-square flex items-center justify-center">
							{#if speechNeutralUrl}
								<img
									src={speechNeutralUrl}
									alt="{data.actor.name} - Neutral"
									class="w-full h-full object-contain"
								/>
							{:else}
								<div class="text-center text-base-content/50">
									<div class="text-4xl mb-2">😐</div>
									<p class="text-xs">No neutral portrait yet</p>
								</div>
							{/if}
						</div>
						<button
							class="btn btn-sm btn-primary w-full mt-2"
							onclick={() => generateSpeechPortrait('neutral')}
							disabled={generatingSpeechNeutral || !conceptUrl}
						>
							{generatingSpeechNeutral
								? 'Generating...'
								: speechNeutralUrl
									? 'Regenerate'
									: 'Generate'}
						</button>
					</div>

					<!-- Talking Expression -->
					<div class="shrink-0 w-64">
						<h3 class="font-semibold mb-2 text-sm">Talking Expression</h3>
						<div class="bg-base-200 rounded-lg p-4 aspect-square flex items-center justify-center">
							{#if speechTalkingUrl}
								<img
									src={speechTalkingUrl}
									alt="{data.actor.name} - Talking"
									class="w-full h-full object-contain"
								/>
							{:else}
								<div class="text-center text-base-content/50">
									<div class="text-4xl mb-2">😊</div>
									<p class="text-xs">No talking portrait yet</p>
								</div>
							{/if}
						</div>
						<button
							class="btn btn-sm btn-primary w-full mt-2"
							onclick={() => generateSpeechPortrait('talking')}
							disabled={generatingSpeechTalking || !conceptUrl}
						>
							{generatingSpeechTalking
								? 'Generating...'
								: speechTalkingUrl
									? 'Regenerate'
									: 'Generate'}
						</button>
					</div>
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
