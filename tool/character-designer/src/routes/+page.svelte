<script lang="ts">
	import { enhance } from '$app/forms';
	import { Palette, Download, Copy, Sparkles, FileText, Image as ImageIcon, RefreshCw } from 'lucide-svelte';
	
	let { form } = $props();
	let isGeneratingPrompt = $state(false);
	let isGeneratingImage = $state(false);
	let baseCharacterValue = $state('');
	let customDetailsValue = $state('');
	let editablePrompt = $state('');
	
	const CUSTOM_DETAILS_PLACEHOLDER = `Add specific details about appearance, clothing, age, personality traits, etc.

Example: A 12-year-old girl with short curly brown hair, freckles, wearing a school uniform with a detective's notebook in her pocket. Adventurous and curious expression.`;
	
	// Initialize editable prompt when form data changes
	$effect(() => {
		if (form?.generatedPrompt && !editablePrompt) {
			editablePrompt = form.generatedPrompt;
		}
	});
	
	async function copyPrompt() {
		if (!editablePrompt && !form?.prompt) return;
		try {
			await navigator.clipboard.writeText(editablePrompt || form?.prompt || '');
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
	<div class="main-content">
		<aside class="sidebar">
			<header class="sidebar-header">
				<div class="header-icon">
					<Palette size={32} />
				</div>
				<h1>Character Designer</h1>
				<p>Create characters for POC Mystery Game</p>
			</header>

			<div class="form-section">
				<h2>Step 1: Character Details</h2>

				<div class="form-group">
					<label for="baseCharacter">Base character on:</label>
					<input 
						type="text" 
						id="baseCharacter" 
						bind:value={baseCharacterValue}
						placeholder="e.g., George from Famous Five, Julian, Anne, Fatty from Five Find-Outers" 
					/>
					<small>Reference a character from Enid Blyton's Mystery series</small>
				</div>

				<div class="form-group">
					<label for="customDetails">Custom details:</label>
					<textarea 
						id="customDetails" 
						bind:value={customDetailsValue}
						rows="6" 
						placeholder={CUSTOM_DETAILS_PLACEHOLDER}
					></textarea>
					<small>Describe physical features, clothing, age, and details</small>
				</div>

				<form method="POST" action="?/generatePrompt" use:enhance={() => {
					isGeneratingPrompt = true;
					return async ({ update }) => {
						await update();
						isGeneratingPrompt = false;
					};
				}}>
					<input type="hidden" name="baseCharacter" value={baseCharacterValue} />
					<input type="hidden" name="customDetails" value={customDetailsValue} />
					<div class="button-group">
						<button type="submit" class="primary-btn" disabled={isGeneratingPrompt}>
							{#if isGeneratingPrompt}
								<span class="loading-spinner"></span> Generating...
							{:else}
								<FileText size={20} /> Generate Prompt
							{/if}
						</button>
					</div>
				</form>
			</div>

			{#if form?.generatedPrompt || editablePrompt}
				<div class="form-section">
					<h2>Step 2: Review & Edit Prompt</h2>
					<div class="form-group">
						<label for="editablePrompt">Generated Prompt:</label>
						<textarea 
							id="editablePrompt" 
							bind:value={editablePrompt}
							rows="12" 
							class="prompt-textarea"
						></textarea>
						<small>Edit the prompt as needed before generating images</small>
					</div>

					<form method="POST" action="?/generateImages" use:enhance={() => {
						isGeneratingImage = true;
						return async ({ update }) => {
							await update();
							isGeneratingImage = false;
						};
					}}>
						<input type="hidden" name="prompt" value={editablePrompt} />
						<input type="hidden" name="baseCharacter" value={baseCharacterValue} />
						<input type="hidden" name="customDetails" value={customDetailsValue} />
						<div class="button-group">
							<button type="submit" class="primary-btn" disabled={isGeneratingImage}>
								{#if isGeneratingImage}
									<span class="loading-spinner"></span> Generating...
								{:else}
									<ImageIcon size={20} /> Generate Images
								{/if}
							</button>
							<button 
								type="button" 
								class="secondary-btn"
								onclick={copyPrompt}
							>
								<Copy size={16} /> Copy Prompt
							</button>
						</div>
					</form>
				</div>
			{/if}
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
					{#if form.savedPath}
						<div class="saved-path">Saved to: {form.savedPath}</div>
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
				</div>
			{:else}
				<div class="preview-container">
					<div class="placeholder">
						<div class="placeholder-icon">
							<Palette size={80} strokeWidth={1.5} />
						</div>
						<h3>No Image Generated Yet</h3>
						<p>Follow the steps on the left:</p>
						<ol class="steps-list">
							<li>Fill in character details</li>
							<li>Generate and review the prompt</li>
							<li>Edit the prompt if needed</li>
							<li>Generate images</li>
						</ol>
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

	.sidebar-header {
		text-align: center;
		padding: 20px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		margin-bottom: 20px;
		backdrop-filter: blur(10px);
	}

	.sidebar-header .header-icon {
		display: flex;
		justify-content: center;
		margin-bottom: 10px;
		color: #50c878;
	}

	.sidebar-header h1 {
		font-size: 1.5em;
		margin-bottom: 5px;
		background: linear-gradient(135deg, #4a90e2, #50c878);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.sidebar-header p {
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.9em;
	}

	.saved-path {
		margin-top: 10px;
		font-size: 0.85em;
		color: rgba(255, 255, 255, 0.7);
		font-family: monospace;
	}

	.warning-text {
		margin-top: 10px;
		font-size: 0.9em;
		color: rgba(255, 255, 255, 0.8);
	}

	.main-content {
		display: grid;
		grid-template-columns: 450px 1fr;
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
		padding: 0;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		max-height: calc(100vh - 40px);
		overflow-y: auto;
	}

	.form-section {
		padding: 25px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.form-section:last-child {
		border-bottom: none;
	}

	.form-section h2 {
		margin-bottom: 20px;
		color: #50c878;
		font-size: 1.2em;
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
	.form-group textarea:focus {
		outline: none;
		border-color: #4a90e2;
		background: rgba(255, 255, 255, 0.15);
		box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
	}

	.form-group textarea {
		resize: vertical;
	}

	.prompt-textarea {
		font-family: 'Courier New', monospace;
		font-size: 13px;
		line-height: 1.6;
	}

	.form-group small {
		display: block;
		margin-top: 5px;
		color: rgba(255, 255, 255, 0.5);
		font-size: 12px;
	}

	.button-group {
		margin-top: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.primary-btn,
	.secondary-btn,
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

	.secondary-btn {
		width: 100%;
		background: rgba(80, 200, 120, 0.2);
		border: 1px solid #50c878;
	}

	.secondary-btn:hover {
		background: rgba(80, 200, 120, 0.3);
		transform: translateY(-2px);
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
		margin-bottom: 15px;
	}

	.steps-list {
		text-align: left;
		display: inline-block;
		color: rgba(255, 255, 255, 0.6);
		line-height: 2;
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
