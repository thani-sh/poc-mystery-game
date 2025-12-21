<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container">
	<h1>Tilesets</h1>
	<p>Manage and generate environment tilesets for the game.</p>

	<div class="tilesets-grid">
		{#each data.tilesets as tileset}
			<a href="/tilesets/{tileset.id}" class="tileset-card">
				<div class="tileset-info">
					<h2>{tileset.name}</h2>
					<div class="tileset-status">
						{#if tileset.hasImage && tileset.hasJson}
							<span class="status-complete">✓ Complete</span>
						{:else if tileset.hasImage}
							<span class="status-partial">Image only</span>
						{:else if tileset.hasJson}
							<span class="status-partial">JSON only</span>
						{:else}
							<span class="status-missing">Not generated</span>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	p {
		color: #666;
		margin-bottom: 2rem;
	}

	.tilesets-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.tileset-card {
		display: block;
		padding: 1.5rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.tileset-card:hover {
		border-color: #4a90e2;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.tileset-info h2 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		text-transform: capitalize;
	}

	.tileset-status {
		margin-top: 0.5rem;
	}

	.status-complete {
		color: #4caf50;
		font-weight: 500;
	}

	.status-partial {
		color: #ff9800;
		font-weight: 500;
	}

	.status-missing {
		color: #999;
		font-weight: 500;
	}
</style>
