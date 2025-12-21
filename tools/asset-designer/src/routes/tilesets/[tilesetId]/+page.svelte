<script lang="ts">
	import type { PageData } from './$types';
	import { generateTileset } from './generate.remote';

	let { data } = $props();

	let generating = $state(false);
	let status = $state<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

	async function handleGenerate() {
		if (generating) return;

		generating = true;
		status = { type: 'info', message: 'Generating tileset...' };

		try {
			await generateTileset(data.tileset.id);
			status = { type: 'success', message: 'Tileset generated successfully!' };
			setTimeout(() => window.location.reload(), 2000);
		} catch (error) {
			status = {
				type: 'error',
				message: error instanceof Error ? error.message : 'Error generating tileset'
			};
			generating = false;
		}
	}
</script>

<div class="max-w-7xl mx-auto">
	<h1 class="text-3xl font-bold mb-6 capitalize">{data.tileset.name}</h1>

	<div class="space-y-8">
		<!-- Tileset Preview -->
		<div>
			<h2 class="text-xl font-bold mb-4">Tileset Image</h2>

			<div
				class="bg-base-200 rounded-lg p-4 aspect-square flex items-center justify-center relative"
			>
				{#if data.imageDataUrl}
					<img
						src={data.imageDataUrl}
						alt="{data.tileset.name} tileset"
						class="w-full h-full object-contain"
						style="image-rendering: pixelated;"
					/>
				{:else}
					<div class="text-center text-base-content/50">
						<div class="text-6xl mb-4">🗺️</div>
						<p>No tileset generated yet</p>
					</div>
				{/if}
				<button
					class="btn btn-circle btn-sm btn-primary absolute top-2 right-2"
					onclick={handleGenerate}
					disabled={generating}
					title={generating ? 'Generating...' : data.imageDataUrl ? 'Regenerate' : 'Generate'}
				>
					{#if generating}
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

			{#if data.imageDataUrl}
				<p class="text-sm text-base-content/60 mt-2">16x16 tile grid (256 tiles total)</p>
			{/if}
		</div>

		<!-- JSON Data -->
		{#if data.hasJson && data.jsonData}
			<div>
				<h2 class="text-xl font-bold mb-4">Tileset JSON</h2>
				<div class="bg-base-200 rounded-lg p-4">
					<pre class="text-xs whitespace-pre-wrap font-mono overflow-x-auto">{JSON.stringify(
							data.jsonData,
							null,
							2
						)}</pre>
				</div>
			</div>
		{/if}
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
