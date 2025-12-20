<div class="max-w-5xl mx-auto">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-4">Welcome to Asset Designer</h1>
		<p class="text-lg opacity-70">
			A tool for creating and managing character sprites, concept art, and game assets for the
			Mystery Game.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">📝 Configuration</h2>
				<p>
					Edit base configuration documents that define art styles, character templates, and
					animation frames.
				</p>
				<div class="card-actions justify-end">
					<a href="/config" class="btn btn-primary btn-sm">Go to Config</a>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">👥 Actors</h2>
				<p>
					View and manage character descriptions, generate AI concept art, and organize character
					assets.
				</p>
				<div class="card-actions justify-end">
					<a href="/actors" class="btn btn-secondary btn-sm">Go to Actors</a>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-8">
		<div class="alert alert-info">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-current shrink-0 w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<div>
				<h3 class="font-bold">Getting Started</h3>
				<div class="text-sm">
					<p>
						To use image generation, set the <code>GEMINI_API_KEY</code>
						environment variable in a <code>.env</code> file.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
