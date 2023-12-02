# unocss-preset-design

theme design for unocss

## Usage

### install

```bash
pnpm i -D unocss-preset-design
```

### unocss config

```ts
import { defineConfig } from "@unocss/vite";
import type { Theme } from "@unocss/preset-mini";
import presetUno from "@unocss/preset-mini";
import presetDesign from "unocss-preset-design";

export default defineConfig<Theme>({
	content: {
		pipeline: {
			exclude: ["node_modules", "dist"],
		},
	},
	presets: [presetUno({ dark: "class" }), presetDesign()],
});
```
