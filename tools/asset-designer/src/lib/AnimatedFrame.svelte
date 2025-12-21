<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		frameDelay?: number; // milliseconds per frame
	}

	let { src, alt, frameDelay = 200 }: Props = $props();

	let canvasRef: HTMLCanvasElement | undefined;

	$effect(() => {
		if (!canvasRef || !src) return;

		const canvas = canvasRef;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		let currentFrame = 0;
		let lastFrameTime = 0;
		let animationId: number;

		img.onload = () => {
			// Start animation loop
			function animate(timestamp: number) {
				if (!ctx || !img || !canvas) return;

				// Update frame based on time elapsed
				if (timestamp - lastFrameTime >= frameDelay) {
					currentFrame = (currentFrame + 1) % 4;
					lastFrameTime = timestamp;

					// Clear canvas
					ctx.clearRect(0, 0, canvas.width, canvas.height);

					// Calculate frame position in 2x2 grid
					// Frame order: 0,0 (0) → 0,1 (1) → 1,0 (2) → 1,1 (3)
					const frameWidth = img.width / 2;
					const frameHeight = img.height / 2;
					const col = currentFrame % 2;
					const row = Math.floor(currentFrame / 2);

					// Draw the current frame quarter
					ctx.drawImage(
						img,
						col * frameWidth, // source x
						row * frameHeight, // source y
						frameWidth, // source width
						frameHeight, // source height
						0, // dest x
						0, // dest y
						canvas.width, // dest width
						canvas.height // dest height
					);
				}

				animationId = requestAnimationFrame(animate);
			}

			animationId = requestAnimationFrame(animate);
		};

		img.src = src;

		// Cleanup
		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<canvas
	bind:this={canvasRef}
	width="256"
	height="256"
	class="w-full h-full"
	style="image-rendering: pixelated; image-rendering: crisp-edges;"
></canvas>
