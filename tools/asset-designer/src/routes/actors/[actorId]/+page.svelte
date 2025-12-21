<script lang="ts">
	import AnimatedFrame from '$lib/AnimatedFrame.svelte';
	import { generateConcept, generatePortrait, generateSpritesheet } from './generate.remote';

	let { data } = $props();

	let generating = $state(false);
	let generatingExpression = $state<Record<string, boolean>>({});
	let generatingFrame = $state<Record<string, boolean>>({});
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

	async function handleGenerateConcept() {
		generating = true;
		status = { type: 'info', message: 'Generating concept...' };

		try {
			await generateConcept(data.actor.id);
			status = { type: 'success', message: 'Concept generated successfully!' };
			// Reload the page to get the new portrait
			window.location.reload();
		} catch (error) {
			status = { type: 'error', message: error instanceof Error ? error.message : 'Error generating concept' };
			console.error('Generate error:', error);
		} finally {
			generating = false;
		}
	}

	async function handleGenerateSpeechPortrait(expressionType: string) {
		generatingExpression[expressionType] = true;
		status = { type: 'info', message: `Generating ${expressionType} expression...` };

		try {
			await generatePortrait([data.actor.id, expressionType]);
			status = {
				type: 'success',
				message: `${expressionType} expression generated successfully!`
			};
			// Reload the page to get the new portrait
			window.location.reload();
		} catch (error) {
			status = {
				type: 'error',
				message: error instanceof Error ? error.message : `Error generating ${expressionType} expression`
			};
			console.error('Generate error:', error);
		} finally {
			generatingExpression[expressionType] = false;
		}
	}

	async function handleGenerateFrame(frameType: string) {
		generatingFrame[frameType] = true;
		status = { type: 'info', message: `Generating ${frameType} frame...` };

		try {
			await generateSpritesheet([data.actor.id, frameType]);
			status = { type: 'success', message: `${frameType} frame generated successfully!` };
			// Reload the page to get the new frame
			window.location.reload();
		} catch (error) {
			status = {
				type: 'error',
				message: error instanceof Error ? error.message : `Error generating ${frameType} frame`
			};
			console.error('Generate error:', error);
		} finally {
			generatingFrame[frameType] = false;
		}
	}

</script>

<div class="max-w-7xl mx-auto">
	<h1 class="text-3xl font-bold mb-6">{data.actor.name}</h1>

	<div class="space-y-8">
		<!-- Concept Preview -->
		<div>
			<h2 class="text-xl font-bold mb-4">Concept Art</h2>

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

			<div class="flex justify-end mt-4">
				<button class="btn btn-primary" onclick={handleGenerateConcept} disabled={generating}>
					{generating ? 'Generating...' : conceptUrl ? 'Regenerate Concept' : 'Generate Concept'}
				</button>
			</div>
		</div>

		<!-- Speech Portraits -->
		<div>
			<h2 class="text-xl font-bold mb-4">Speech Portraits</h2>

			{#if !conceptUrl}
				<div class="alert alert-warning mb-4">
					<span class="text-sm">Generate a concept first to create speech portraits</span>
				</div>
			{/if}

			<!-- Multi-row grid container -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each data.expressionTypes as expressionType}
					<div>
						<h3 class="font-semibold mb-2 text-sm capitalize">
							{expressionType.replace(/-/g, ' ')}
						</h3>
						<div
							class="bg-base-200 rounded-lg p-4 aspect-square flex items-center justify-center relative"
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
							<button
								class="btn btn-circle btn-sm btn-primary absolute top-2 right-2"
								onclick={() => handleGenerateSpeechPortrait(expressionType)}
								disabled={generatingExpression[expressionType] || !conceptUrl}
								title={generatingExpression[expressionType]
									? 'Generating...'
									: speechPortraits[expressionType]
										? 'Regenerate'
										: 'Generate'}
							>
								{#if generatingExpression[expressionType]}
									<span class="loading loading-spinner loading-xs"></span>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Character Frames -->
		<div>
			<h2 class="text-xl font-bold mb-4">Character Frames</h2>

			{#if !conceptUrl}
				<div class="alert alert-warning mb-4">
					<span class="text-sm">Generate a concept first to create character frames</span>
				</div>
			{/if}

			<!-- Multi-row grid container -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each data.frameTypes as frameType}
					<div>
						<h3 class="font-semibold mb-2 text-sm capitalize">{frameType.replace(/-/g, ' ')}</h3>
						<div
							class="bg-base-200 rounded-lg p-4 aspect-square flex items-center justify-center relative"
						>
							{#if frames[frameType]}
								<AnimatedFrame
									src={frames[frameType] || ''}
									alt="{data.actor.name} - {frameType}"
								/>
							{:else}
								<div class="text-center text-base-content/50">
									<div class="text-4xl mb-2">🚶</div>
									<p class="text-xs">No {frameType} frame yet</p>
								</div>
							{/if}
							<button
								class="btn btn-circle btn-sm btn-primary absolute top-2 right-2"
								onclick={() => handleGenerateFrame(frameType)}
								disabled={generatingFrame[frameType] || !conceptUrl}
								title={generatingFrame[frameType]
									? 'Generating...'
									: frames[frameType]
										? 'Regenerate'
										: 'Generate'}
							>
								{#if generatingFrame[frameType]}
									<span class="loading loading-spinner loading-xs"></span>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</button>
						</div>
					</div>
				{/each}
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
