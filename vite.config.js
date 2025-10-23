import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 3001,
    host: 'localhost', // Доступ только локально
    strictPort: true,
    watch: {
      ignored: ['**/_Ref/**', '**/node_modules/**'] // Игнорируем референсную папку
    }
  },
  resolve: {
    alias: {
      // Убедимся, что импорты разрешаются правильно
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    // Исключаем обработку файлов из _Ref
    entries: [
      'index.html',
      'custom-palette.html',
      'src/**/*.js'
    ]
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        custom: path.resolve(__dirname, 'custom-palette.html')
      }
    }
  }
});
