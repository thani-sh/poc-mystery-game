<script lang="ts">
	let { data } = $props();
</script>

<div class="max-w-7xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Actors</h1>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each data.actors as actor}
			<a
				href="/actors/{actor.id}"
				class="block bg-base-100 border border-base-300 hover:border-primary transition-colors"
			>
				<div class="bg-base-200 aspect-square flex items-center justify-center overflow-hidden">
					{#if actor.conceptDataUrl}
						<img src={actor.conceptDataUrl} alt={actor.name} class="w-full h-full object-cover" />
					{:else}
						<div class="text-6xl">👤</div>
					{/if}
				</div>
				<div class="p-4">
					<h2 class="text-xl font-bold mb-2">{actor.name}</h2>
					<p class="text-sm opacity-70 line-clamp-2">
						{actor.description || 'No description available'}
					</p>
				</div>
			</a>
		{/each}
	</div>

	{#if data.actors.length === 0}
		<div class="alert">
			<span>No actors found. Add actor markdown files to docs/spec/actors/</span>
		</div>
	{/if}
</div>
