import { defineConfig } from "vite";

export default defineConfig({
    assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.3DS', '**/*.mp3', '**/*.png', '**/*.bin'],
    base: '/bowling/',
    server: {
        watch: {
            usePolling: true,
        }
    },
})