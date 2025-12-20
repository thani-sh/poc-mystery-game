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
				class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
			>
				<figure class="bg-base-200 aspect-square flex items-center justify-center overflow-hidden">
					{#if actor.conceptDataUrl}
						<img src={actor.conceptDataUrl} alt={actor.name} class="w-full h-full object-cover" />
					{:else}
						<div class="text-6xl">👤</div>
					{/if}
				</figure>
				<div class="card-body">
					<h2 class="card-title">{actor.name}</h2>
					<p class="text-sm opacity-70 line-clamp-2">
						{actor.description || 'No description available'}
					</p>
					<div class="card-actions justify-end">
						<div class="badge badge-primary">
							{actor.hasConcept ? 'Has Concept' : 'No Concept'}
						</div>
					</div>
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
