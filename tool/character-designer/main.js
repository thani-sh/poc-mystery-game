import portraitPromptRaw from '../../docs/prompts/character-portrait-prompt.md?raw';
import spritesheetPromptRaw from '../../docs/prompts/character-spritesheet-prompt.md?raw';

// State
let portraitBasePrompt = portraitPromptRaw;
let spritesheetBasePrompt = spritesheetPromptRaw;
let currentImageData = null;
let currentPrompt = '';

// DOM Elements
const elements = {
    characterType: document.getElementById('characterType'),
    race: document.getElementById('race'),
    class: document.getElementById('class'),
    gender: document.getElementById('gender'),
    age: document.getElementById('age'),
    physicalFeatures: document.getElementById('physicalFeatures'),
    clothing: document.getElementById('clothing'),
    hairColor: document.getElementById('hairColor'),
    eyeColor: document.getElementById('eyeColor'),
    skinTone: document.getElementById('skinTone'),
    additionalDetails: document.getElementById('additionalDetails'),
    generateBtn: document.getElementById('generateBtn'),
    clearBtn: document.getElementById('clearBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    copyPromptBtn: document.getElementById('copyPromptBtn'),
    statusMessage: document.getElementById('statusMessage'),
    previewContainer: document.getElementById('previewContainer'),
    imageContainer: document.getElementById('imageContainer'),
    generatedImage: document.getElementById('generatedImage'),
    promptDisplay: document.getElementById('promptDisplay')
};

// Initialize
async function init() {
    attachEventListeners();
    showStatus('Ready to generate character prompts!', 'success');
    setTimeout(() => hideStatus(), 3000);
}

// Attach event listeners
function attachEventListeners() {
    elements.generateBtn.addEventListener('click', handleGenerate);
    elements.clearBtn.addEventListener('click', handleClear);
    elements.downloadBtn.addEventListener('click', handleDownload);
    elements.copyPromptBtn.addEventListener('click', handleCopyPrompt);
}

// Build the complete prompt
function buildPrompt() {
    const characterType = elements.characterType.value;
    const basePrompt = characterType === 'portrait' ? portraitBasePrompt : spritesheetBasePrompt;
    
    if (!basePrompt) {
        return null;
    }

    // Build character description
    const parts = [];
    
    // Race and class
    const race = elements.race.value.trim();
    const characterClass = elements.class.value.trim();
    if (race || characterClass) {
        parts.push(`${race || 'character'}${characterClass ? ' ' + characterClass : ''}`);
    }

    // Gender and age
    const gender = elements.gender.value;
    const age = elements.age.value.trim();
    if (gender || age) {
        const genderAge = [gender, age].filter(Boolean).join(', ');
        if (genderAge) parts.push(genderAge);
    }

    // Physical features with colors
    const features = [];
    const hairColor = elements.hairColor.value.trim();
    const eyeColor = elements.eyeColor.value.trim();
    const skinTone = elements.skinTone.value.trim();
    const physicalFeatures = elements.physicalFeatures.value.trim();

    if (hairColor) features.push(`${hairColor} hair`);
    if (eyeColor) features.push(`${eyeColor} eyes`);
    if (skinTone) features.push(`${skinTone} skin`);
    if (physicalFeatures) features.push(physicalFeatures);

    if (features.length > 0) {
        parts.push(features.join(', '));
    }

    // Clothing
    const clothing = elements.clothing.value.trim();
    
    // Build the character description line
    let characterDesc = parts.join(', ');
    
    // Additional details
    const additionalDetails = elements.additionalDetails.value.trim();
    if (additionalDetails) {
        characterDesc += '. ' + additionalDetails;
    }

    // Replace placeholders in base prompt
    let finalPrompt = basePrompt;
    
    // Replace the INSERT markers with our character description
    if (characterDesc) {
        finalPrompt = finalPrompt.replace(
            /\[INSERT CHARACTER RACE AND CLASS\]/g,
            race || characterClass || 'character'
        );
        
        finalPrompt = finalPrompt.replace(
            /\[INSERT KEY PHYSICAL FEATURES:[^\]]*\]/g,
            features.join(', ') || 'distinctive features'
        );
        
        finalPrompt = finalPrompt.replace(
            /\[INSERT CLOTHING\/ARMOR DETAILS\]/g,
            clothing || 'appropriate attire'
        );
    }

    return finalPrompt;
}

// Show status message
function showStatus(message, type = 'loading') {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message ${type}`;
}

// Hide status message
function hideStatus() {
    elements.statusMessage.classList.add('hidden');
}

// Handle generate button click
async function handleGenerate() {
    const prompt = buildPrompt();
    
    if (!prompt) {
        showStatus('Error: Could not build prompt. Please check that prompt files are loaded.', 'error');
        return;
    }

    currentPrompt = prompt;
    elements.promptDisplay.textContent = prompt;

    try {
        elements.generateBtn.disabled = true;
        elements.generateBtn.innerHTML = '<span class="loading-spinner"></span> Generating...';
        showStatus('Generating character prompt...', 'loading');

        // Note: This tool generates prompts for use with external image generation services.
        // Direct image generation would require integration with services like:
        // - Google Imagen API (requires separate API access)
        // - OpenAI DALL-E API
        // - Stability AI API
        // - Midjourney (via Discord bot)
        
        showStatus('Prompt generated successfully! Copy it and use with an image generation service.', 'success');
        
        // Show the prompt in the display area
        elements.previewContainer.style.display = 'none';
        elements.imageContainer.classList.remove('hidden');
        
        // Create a visual placeholder to indicate the prompt is ready
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size based on character type
        if (elements.characterType.value === 'portrait') {
            canvas.width = 768;
            canvas.height = 1024;
        } else {
            canvas.width = 1024;
            canvas.height = 1024;
        }
        
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = '#e8e8e8';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Prompt Generated!', canvas.width / 2, canvas.height / 2 - 100);
        
        ctx.font = '20px Arial';
        ctx.fillText('Copy the prompt below and use it with:', canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText('• Google Imagen API', canvas.width / 2, canvas.height / 2);
        ctx.fillText('• Midjourney', canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText('• DALL-E', canvas.width / 2, canvas.height / 2 + 80);
        ctx.fillText('• Stable Diffusion', canvas.width / 2, canvas.height / 2 + 120);
        
        currentImageData = canvas.toDataURL('image/png');
        elements.generatedImage.src = currentImageData;
        
        showStatus('Prompt generated successfully! Copy it and use with an image generation service.', 'success');

    } catch (error) {
        console.error('Error generating character:', error);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        elements.generateBtn.disabled = false;
        elements.generateBtn.innerHTML = '✨ Generate Character';
    }
}

// Handle clear button click
function handleClear() {
    if (confirm('Are you sure you want to clear all fields?')) {
        elements.race.value = '';
        elements.class.value = '';
        elements.gender.value = '';
        elements.age.value = '';
        elements.physicalFeatures.value = '';
        elements.clothing.value = '';
        elements.hairColor.value = '';
        elements.eyeColor.value = '';
        elements.skinTone.value = '';
        elements.additionalDetails.value = '';
        elements.characterType.value = 'portrait';
        
        elements.imageContainer.classList.add('hidden');
        elements.previewContainer.style.display = 'flex';
        
        showStatus('Form cleared', 'success');
        setTimeout(() => hideStatus(), 2000);
    }
}

// Handle download button click
function handleDownload() {
    if (!currentImageData) return;

    const link = document.createElement('a');
    const characterType = elements.characterType.value;
    const race = elements.race.value.trim() || 'character';
    const filename = `${race}-${characterType}-${Date.now()}.png`;
    
    link.download = filename;
    link.href = currentImageData;
    link.click();
    
    showStatus('Image downloaded!', 'success');
    setTimeout(() => hideStatus(), 2000);
}

// Handle copy prompt button click
async function handleCopyPrompt() {
    if (!currentPrompt) return;

    try {
        await navigator.clipboard.writeText(currentPrompt);
        showStatus('Prompt copied to clipboard!', 'success');
        setTimeout(() => hideStatus(), 2000);
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showStatus('Error copying to clipboard', 'error');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
