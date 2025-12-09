import { GoogleGenerativeAI } from '@google/generative-ai';

// Constants
const API_KEY_STORAGE_KEY = 'google_ai_api_key';
const PORTRAIT_PROMPT_URL = '../../docs/prompts/character-portrait-prompt.md';
const SPRITESHEET_PROMPT_URL = '../../docs/prompts/character-spritesheet-prompt.md';

// State
let portraitBasePrompt = '';
let spritesheetBasePrompt = '';
let currentImageData = null;
let currentPrompt = '';

// DOM Elements
const elements = {
    apiKey: document.getElementById('apiKey'),
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
    loadApiKey();
    await loadBasePrompts();
    attachEventListeners();
    showStatus('Ready to generate characters!', 'success');
    setTimeout(() => hideStatus(), 3000);
}

// Load API key from localStorage
function loadApiKey() {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
        elements.apiKey.value = savedKey;
    }
}

// Save API key to localStorage
function saveApiKey() {
    const apiKey = elements.apiKey.value.trim();
    if (apiKey) {
        localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    }
}

// Load base prompts from markdown files
async function loadBasePrompts() {
    try {
        const [portraitResponse, spritesheetResponse] = await Promise.all([
            fetch(PORTRAIT_PROMPT_URL),
            fetch(SPRITESHEET_PROMPT_URL)
        ]);

        if (portraitResponse.ok) {
            portraitBasePrompt = await portraitResponse.text();
        } else {
            console.warn('Could not load portrait prompt');
        }

        if (spritesheetResponse.ok) {
            spritesheetBasePrompt = await spritesheetResponse.text();
        } else {
            console.warn('Could not load spritesheet prompt');
        }
    } catch (error) {
        console.error('Error loading base prompts:', error);
        showStatus('Warning: Could not load base prompt templates', 'error');
    }
}

// Attach event listeners
function attachEventListeners() {
    elements.generateBtn.addEventListener('click', handleGenerate);
    elements.clearBtn.addEventListener('click', handleClear);
    elements.downloadBtn.addEventListener('click', handleDownload);
    elements.copyPromptBtn.addEventListener('click', handleCopyPrompt);
    elements.apiKey.addEventListener('change', saveApiKey);
    elements.apiKey.addEventListener('blur', saveApiKey);
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
    const apiKey = elements.apiKey.value.trim();
    
    if (!apiKey) {
        showStatus('Please enter your Google AI API key', 'error');
        elements.apiKey.focus();
        return;
    }

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
        showStatus('Generating character image... This may take a moment.', 'loading');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Note: As of the current version, Gemini API doesn't support direct image generation
        // through the JavaScript SDK. We'll simulate the process and show instructions.
        
        showStatus('Note: Image generation requires using Imagen API or another image generation service. This tool shows the prompt that should be used.', 'warning');
        
        // Show the prompt in the display area
        elements.previewContainer.style.display = 'none';
        elements.imageContainer.classList.remove('hidden');
        
        // For now, we'll show a placeholder indicating that the user should use the prompt
        // with an actual image generation service
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
