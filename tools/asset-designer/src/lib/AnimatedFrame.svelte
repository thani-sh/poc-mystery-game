<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		row?: number; // 0: down, 1: left, 2: right, 3: up
		frameDelay?: number; // milliseconds per frame
	}

	let { src, alt, row = 0, frameDelay = 200 }: Props = $props();

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

					// Calculate frame position in 4x4 grid
					const frameWidth = img.width / 4;
					const frameHeight = img.height / 4;
					const col = currentFrame;

					// Draw the current frame
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
