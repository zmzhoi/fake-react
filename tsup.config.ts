import { defineConfig } from 'tsup';
import { DevServer } from './src/libs/devServer';

const DEV = process.env.NODE_ENV === 'development';

const config = defineConfig({
  splitting: false,
  clean: true,
});

if (DEV) {
  config['entry'] = ['example/index.tsx'];
  config['outDir'] = 'example/public/js';
  config['sourcemap'] = true;
  config['onSuccess'] = DevServer;
} else {
  config['entry'] = ['src/index.tsx', 'src/jsx-runtime/index.ts'];
  config['outDir'] = 'dist';
  config['dts'] = './src/index.tsx';
  config['minify'] = true;
}
export default config;
