import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/main.tsx',
            refresh: true,
        }),
        react({
            jsxImportSource: 'react',
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', '@mantine/core', '@mantine/hooks'],
    },
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: true,
        watch: {
            usePolling: true,
        },
        hmr: {
            host: 'localhost',
        },
    },
});
