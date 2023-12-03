React + TypeScript + Vite
Kör följande commands i terminalen:
npm Install
Skapa en setup.js fil med detta innehåll:
import '@testing-library/jest-dom/vitest';

Ändra sedan vite.config.ts till

import react from '@vitejs/plugin-react-swc'; import { defineConfig } from 'vite';

// https://vitejs.dev/config/ export default defineConfig({ plugins: [react()], test: { globals: true, environment: 'jsdom', setupFiles: 'setup.ts', }, });

Lägg till types i tsconfig filen:
under compilerOptions lägg till:
"types": ["vitest/globals"],