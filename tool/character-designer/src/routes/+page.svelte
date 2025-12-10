<script lang="ts">
	import { enhance } from '$app/forms';
	import { Palette, Download, Copy, Sparkles, Trash2 } from 'lucide-svelte';
	
	let { form } = $props();
	let isGenerating = $state(false);
	
	async function copyPrompt() {
		if (!form?.prompt) return;
		try {
			await navigator.clipboard.writeText(form.prompt);
		} catch (error) {
			console.error('Failed to copy prompt:', error);
			alert('Failed to copy prompt to clipboard');
		}
	}
</script>

<svelte:head>
	<title>Character Designer - POC Mystery Game</title>
</svelte:head>

<div class="container">
	<header>
		<div class="header-icon">
			<Palette size={48} />
		</div>
		<h1>Character Designer</h1>
		<p>Create characters for POC Mystery Game using Google AI</p>
	</header>

	<div class="main-content">
		<aside class="sidebar">
			<form method="POST" use:enhance={() => {
				isGenerating = true;
				return async ({ update }) => {
					await update();
					isGenerating = false;
				};
			}}>
				<h2>Character Details</h2>

				<div class="form-group">
					<label for="baseCharacter">Base character on:</label>
					<input 
						type="text" 
						id="baseCharacter" 
						name="baseCharacter" 
						placeholder="e.g., George from Famous Five, Julian, Anne, Fatty from Five Find-Outers" 
					/>
					<small>Reference a character from Enid Blyton's Mystery series or other popular stories</small>
				</div>

				<div class="form-group">
					<label for="customDetails">Custom details:</label>
					<textarea 
						id="customDetails" 
						name="customDetails" 
						rows="6" 
						placeholder="Add specific details about appearance, clothing, age, personality traits, etc.&#10;&#10;Example: A 12-year-old girl with short curly brown hair, freckles, wearing a school uniform with a detective's notebook in her pocket. Adventurous and curious expression."
					></textarea>
					<small>Describe physical features, clothing, age, and any other details</small>
				</div>

				<div class="button-group">
					<button type="submit" class="primary-btn" disabled={isGenerating}>
						{#if isGenerating}
							<span class="loading-spinner"></span> Generating...
						{:else}
							<Sparkles size={20} /> Generate Character
						{/if}
					</button>
				</div>
			</form>
		</aside>

		<main class="preview-area">
			{#if form?.error}
				<div class="status-message error">
					{form.error}
				</div>
			{:else if form?.success}
				<div class="status-message success">
					Character generated successfully!
					{#if form.warning}
						<div class="warning-text">{form.warning}</div>
					{/if}
				</div>
			{/if}

			{#if form?.images && form.images.length > 0}
				<div class="image-container">
					{#each form.images as image, i}
						<div class="image-wrapper">
							<img src={image.dataUrl} alt="Generated Character {i + 1}" />
							<div class="image-actions">
								<a href={image.dataUrl} download="character-{i + 1}.{image.extension}" class="action-btn">
									<Download size={16} /> Download Image {i + 1}
								</a>
							</div>
						</div>
					{/each}

					{#if form.prompt}
						<div class="prompt-display">
							<h3>Generated Prompt:</h3>
							<pre>{form.prompt}</pre>
							<button 
								type="button" 
								class="action-btn"
								onclick={copyPrompt}
							>
								<Copy size={16} /> Copy Prompt
							</button>
						</div>
					{/if}
				</div>
			{:else}
				<div class="preview-container">
					<div class="placeholder">
						<div class="placeholder-icon">
							<Palette size={80} strokeWidth={1.5} />
						</div>
						<h3>No Image Generated Yet</h3>
						<p>Fill in the character details and click "Generate Character" to see the results</p>
					</div>
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		color: #e8e8e8;
		min-height: 100vh;
		line-height: 1.6;
	}

	.container {
		max-width: 1600px;
		margin: 0 auto;
		padding: 20px;
	}

	header {
		text-align: center;
		padding: 30px 20px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		margin-bottom: 30px;
		backdrop-filter: blur(10px);
		animation: fadeInDown 0.6s ease-out;
	}

	.header-icon {
		display: flex;
		justify-content: center;
		margin-bottom: 15px;
		color: #50c878;
	}

	header h1 {
		font-size: 2.5em;
		margin-bottom: 10px;
		background: linear-gradient(135deg, #4a90e2, #50c878);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	header p {
		color: rgba(255, 255, 255, 0.7);
		font-size: 1.1em;
	}

	.warning-text {
		margin-top: 10px;
		font-size: 0.9em;
		color: rgba(255, 255, 255, 0.8);
	}

	.main-content {
		display: grid;
		grid-template-columns: 400px 1fr;
		gap: 30px;
		animation: fadeIn 0.8s ease-out;
	}

	@media (max-width: 1200px) {
		.main-content {
			grid-template-columns: 1fr;
		}
	}

	.sidebar {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 25px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		max-height: calc(100vh - 200px);
		overflow-y: auto;
	}

	.sidebar h2 {
		margin-bottom: 25px;
		color: #50c878;
		font-size: 1.5em;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-group label {
		display: block;
		margin-bottom: 8px;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 500;
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		width: 100%;
		padding: 12px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 8px;
		color: #e8e8e8;
		font-size: 14px;
		transition: all 0.3s ease;
		font-family: inherit;
	}

	.form-group input:focus,
	.form-group select:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #4a90e2;
		background: rgba(255, 255, 255, 0.15);
		box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
	}

	.form-group textarea {
		resize: vertical;
	}

	.form-group small {
		display: block;
		margin-top: 5px;
		color: rgba(255, 255, 255, 0.5);
		font-size: 12px;
	}

	.button-group {
		margin-top: 25px;
	}

	.primary-btn,
	.action-btn {
		padding: 12px 24px;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		text-decoration: none;
		color: white;
	}

	.primary-btn {
		width: 100%;
		background: linear-gradient(135deg, #4a90e2, #50c878);
	}

	.primary-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(74, 144, 226, 0.4);
	}

	.primary-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.action-btn {
		background: rgba(74, 144, 226, 0.2);
		border: 1px solid #4a90e2;
		margin: 10px 5px;
	}

	.action-btn:hover {
		background: rgba(74, 144, 226, 0.3);
		transform: translateY(-2px);
	}

	.preview-area {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 25px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		min-height: 600px;
	}

	.status-message {
		padding: 15px;
		border-radius: 8px;
		margin-bottom: 20px;
		text-align: center;
		font-weight: 500;
		animation: slideInDown 0.3s ease-out;
	}

	.status-message.success {
		background: rgba(46, 204, 113, 0.2);
		border: 1px solid #2ecc71;
		color: #2ecc71;
	}

	.status-message.error {
		background: rgba(231, 76, 60, 0.2);
		border: 1px solid #e74c3c;
		color: #e74c3c;
	}

	.preview-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 500px;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.2);
	}

	.placeholder {
		text-align: center;
		animation: pulse 2s ease-in-out infinite;
	}

	.placeholder-icon {
		font-size: 80px;
		margin-bottom: 20px;
	}

	.placeholder h3 {
		margin-bottom: 10px;
		color: rgba(255, 255, 255, 0.8);
	}

	.placeholder p {
		color: rgba(255, 255, 255, 0.5);
	}

	.image-container {
		animation: fadeInScale 0.6s ease-out;
	}

	.image-wrapper {
		margin-bottom: 20px;
	}

	.image-wrapper img {
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
		animation: imageReveal 0.8s ease-out;
	}

	.image-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 15px;
	}

	.prompt-display {
		background: rgba(0, 0, 0, 0.3);
		padding: 20px;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		margin-top: 20px;
	}

	.prompt-display h3 {
		margin-bottom: 15px;
		color: #50c878;
	}

	.prompt-display pre {
		max-height: 300px;
		overflow-y: auto;
		font-family: 'Courier New', monospace;
		font-size: 13px;
		line-height: 1.8;
		white-space: pre-wrap;
		word-wrap: break-word;
		margin-bottom: 15px;
	}

	.loading-spinner {
		display: inline-block;
		width: 20px;
		height: 20px;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeInScale {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes slideInDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.8; }
		50% { opacity: 0.4; }
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@keyframes imageReveal {
		from {
			opacity: 0;
			transform: scale(0.95);
			filter: blur(10px);
		}
		to {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
	}
</style>
