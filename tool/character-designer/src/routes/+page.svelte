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
	// Only update if we have a new prompt and either no existing prompt or user generated a new one
	$effect(() => {
		if (form?.generatedPrompt && form?.generatedPrompt !== editablePrompt) {
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
	@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: 'VT323', monospace;
		background: #0a0a0a;
		color: #00ff00;
		min-height: 100vh;
		line-height: 1.6;
		position: relative;
		overflow-x: hidden;
	}

	:global(body::before) {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.15),
			rgba(0, 0, 0, 0.15) 1px,
			transparent 1px,
			transparent 2px
		);
		pointer-events: none;
		z-index: 1000;
		animation: scanline 8s linear infinite;
	}

	:global(body::after) {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%);
		pointer-events: none;
		z-index: 999;
	}

	@keyframes scanline {
		0% { transform: translateY(0); }
		100% { transform: translateY(10px); }
	}

	.container {
		max-width: 1600px;
		margin: 0 auto;
		padding: 20px;
		position: relative;
		z-index: 1;
	}

	.sidebar-header {
		text-align: center;
		padding: 20px;
		background: #000;
		border: 3px solid #00ff00;
		box-shadow: 
			0 0 10px #00ff00,
			inset 0 0 10px rgba(0, 255, 0, 0.1);
		margin-bottom: 20px;
	}

	.sidebar-header .header-icon {
		display: flex;
		justify-content: center;
		margin-bottom: 10px;
		color: #00ffff;
		filter: drop-shadow(0 0 8px #00ffff);
		animation: flicker 3s infinite;
	}

	@keyframes flicker {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.8; }
		51% { opacity: 1; }
		60% { opacity: 0.9; }
		61% { opacity: 1; }
	}

	.sidebar-header h1 {
		font-family: 'Press Start 2P', cursive;
		font-size: 1.2em;
		margin-bottom: 10px;
		color: #ff00ff;
		text-shadow: 
			0 0 10px #ff00ff,
			0 0 20px #ff00ff,
			2px 2px 0 #000;
		letter-spacing: 2px;
	}

	.sidebar-header p {
		color: #00ff00;
		font-size: 1.2em;
		text-shadow: 0 0 5px #00ff00;
	}

	.saved-path {
		margin-top: 10px;
		font-size: 0.9em;
		color: #00ffff;
		font-family: 'VT323', monospace;
		text-shadow: 0 0 5px #00ffff;
	}

	.warning-text {
		margin-top: 10px;
		font-size: 1em;
		color: #ffff00;
		text-shadow: 0 0 5px #ffff00;
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
		background: #000;
		border: 3px solid #00ff00;
		padding: 0;
		box-shadow: 
			0 0 20px #00ff00,
			inset 0 0 20px rgba(0, 255, 0, 0.1);
		max-height: calc(100vh - 40px);
		overflow-y: auto;
		position: relative;
	}

	.sidebar::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(0, 255, 0, 0.03) 2px,
			rgba(0, 255, 0, 0.03) 4px
		);
		pointer-events: none;
	}

	.form-section {
		padding: 25px;
		border-bottom: 2px solid #00ff00;
		position: relative;
		z-index: 1;
	}

	.form-section:last-child {
		border-bottom: none;
	}

	.form-section h2 {
		margin-bottom: 20px;
		color: #00ffff;
		font-family: 'Press Start 2P', cursive;
		font-size: 0.9em;
		text-shadow: 
			0 0 10px #00ffff,
			2px 2px 0 #000;
		letter-spacing: 1px;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-group label {
		display: block;
		margin-bottom: 8px;
		color: #ffff00;
		font-weight: 500;
		font-size: 1.2em;
		text-shadow: 0 0 5px #ffff00;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 12px;
		background: #000;
		border: 2px solid #00ff00;
		color: #00ff00;
		font-size: 16px;
		font-family: 'VT323', monospace;
		transition: all 0.3s ease;
		box-shadow: 
			0 0 10px rgba(0, 255, 0, 0.5),
			inset 0 0 10px rgba(0, 255, 0, 0.1);
	}

	.form-group input::placeholder,
	.form-group textarea::placeholder {
		color: rgba(0, 255, 0, 0.5);
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #00ffff;
		box-shadow: 
			0 0 20px #00ffff,
			inset 0 0 10px rgba(0, 255, 255, 0.2);
		color: #00ffff;
	}

	.form-group textarea {
		resize: vertical;
	}

	.prompt-textarea {
		font-family: 'VT323', monospace;
		font-size: 16px;
		line-height: 1.6;
	}

	.form-group small {
		display: block;
		margin-top: 5px;
		color: rgba(0, 255, 0, 0.7);
		font-size: 14px;
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
		border: 3px solid;
		font-size: 18px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		text-decoration: none;
		font-family: 'Press Start 2P', cursive;
		text-transform: uppercase;
		position: relative;
		overflow: hidden;
	}

	.primary-btn::before,
	.secondary-btn::before,
	.action-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.5s;
	}

	.primary-btn:hover::before,
	.secondary-btn:hover::before,
	.action-btn:hover::before {
		left: 100%;
	}

	.primary-btn {
		width: 100%;
		background: #000;
		color: #ff00ff;
		border-color: #ff00ff;
		box-shadow: 
			0 0 20px #ff00ff,
			inset 0 0 20px rgba(255, 0, 255, 0.2);
		text-shadow: 0 0 10px #ff00ff;
	}

	.primary-btn:hover:not(:disabled) {
		background: #ff00ff;
		color: #000;
		box-shadow: 
			0 0 30px #ff00ff,
			inset 0 0 30px rgba(255, 0, 255, 0.5);
	}

	.primary-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.secondary-btn {
		width: 100%;
		background: #000;
		color: #00ff00;
		border-color: #00ff00;
		box-shadow: 
			0 0 20px #00ff00,
			inset 0 0 20px rgba(0, 255, 0, 0.2);
		text-shadow: 0 0 10px #00ff00;
	}

	.secondary-btn:hover {
		background: #00ff00;
		color: #000;
		box-shadow: 
			0 0 30px #00ff00,
			inset 0 0 30px rgba(0, 255, 0, 0.5);
	}

	.action-btn {
		background: #000;
		color: #00ffff;
		border-color: #00ffff;
		box-shadow: 
			0 0 20px #00ffff,
			inset 0 0 20px rgba(0, 255, 255, 0.2);
		text-shadow: 0 0 10px #00ffff;
		margin: 10px 5px;
		font-size: 14px;
	}

	.action-btn:hover {
		background: #00ffff;
		color: #000;
		box-shadow: 
			0 0 30px #00ffff,
			inset 0 0 30px rgba(0, 255, 255, 0.5);
	}

	.preview-area {
		background: #000;
		border: 3px solid #00ff00;
		padding: 25px;
		box-shadow: 
			0 0 20px #00ff00,
			inset 0 0 20px rgba(0, 255, 0, 0.1);
		min-height: 600px;
		position: relative;
	}

	.preview-area::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(0, 255, 0, 0.03) 2px,
			rgba(0, 255, 0, 0.03) 4px
		);
		pointer-events: none;
	}

	.status-message {
		padding: 15px;
		border: 2px solid;
		margin-bottom: 20px;
		text-align: center;
		font-weight: 500;
		animation: slideInDown 0.3s ease-out;
		font-family: 'VT323', monospace;
		font-size: 1.2em;
		position: relative;
		z-index: 1;
	}

	.status-message.success {
		background: #000;
		border-color: #00ff00;
		color: #00ff00;
		box-shadow: 
			0 0 20px #00ff00,
			inset 0 0 20px rgba(0, 255, 0, 0.2);
		text-shadow: 0 0 5px #00ff00;
	}

	.status-message.error {
		background: #000;
		border-color: #ff0000;
		color: #ff0000;
		box-shadow: 
			0 0 20px #ff0000,
			inset 0 0 20px rgba(255, 0, 0, 0.2);
		text-shadow: 0 0 5px #ff0000;
	}

	.preview-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 500px;
		background: rgba(0, 0, 0, 0.5);
		border: 2px dashed rgba(0, 255, 0, 0.3);
		position: relative;
		z-index: 1;
	}

	.placeholder {
		text-align: center;
		animation: pulse 2s ease-in-out infinite;
	}

	.placeholder-icon {
		font-size: 80px;
		margin-bottom: 20px;
		color: #00ff00;
		filter: drop-shadow(0 0 20px #00ff00);
	}

	.placeholder h3 {
		margin-bottom: 10px;
		color: #00ffff;
		font-family: 'Press Start 2P', cursive;
		font-size: 1em;
		text-shadow: 0 0 10px #00ffff;
	}

	.placeholder p {
		color: #ffff00;
		margin-bottom: 15px;
		font-size: 1.2em;
		text-shadow: 0 0 5px #ffff00;
	}

	.steps-list {
		text-align: left;
		display: inline-block;
		color: #00ff00;
		line-height: 2;
		font-size: 1.1em;
		text-shadow: 0 0 5px #00ff00;
	}

	.image-container {
		animation: fadeInScale 0.6s ease-out;
		position: relative;
		z-index: 1;
	}

	.image-wrapper {
		margin-bottom: 20px;
		border: 3px solid #ff00ff;
		padding: 10px;
		background: #000;
		box-shadow: 
			0 0 20px #ff00ff,
			inset 0 0 20px rgba(255, 0, 255, 0.1);
	}

	.image-wrapper img {
		width: 100%;
		max-width: 100%;
		height: auto;
		box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
		animation: imageReveal 0.8s ease-out;
		image-rendering: pixelated;
		image-rendering: -moz-crisp-edges;
		image-rendering: crisp-edges;
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
		border: 3px solid rgba(255, 0, 255, 0.3);
		border-top-color: #ff00ff;
		animation: spin 1s linear infinite;
		box-shadow: 0 0 10px #ff00ff;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
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
			transform: scale(0.8);
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
		0%, 100% { 
			opacity: 1;
			transform: scale(1);
		}
		50% { 
			opacity: 0.6;
			transform: scale(0.98);
		}
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@keyframes imageReveal {
		from {
			opacity: 0;
			transform: scale(0.9);
			filter: brightness(0);
		}
		to {
			opacity: 1;
			transform: scale(1);
			filter: brightness(1);
		}
	}
</style>
