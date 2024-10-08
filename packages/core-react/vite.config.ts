import path from "node:path";
import react from "@vitejs/plugin-react";
import type { UserConfigExport } from "vite";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";
import { name } from "./package.json";

async function app(): Promise<UserConfigExport> {
	/**
	 * Removes everything before the last
	 * @octocat/library-repo -> library-repo
	 * vite-component-library-template -> vite-component-library-template
	 */
	const formattedName = name.match(/[^/]+$/)?.[0] ?? name;

	return defineConfig({
		plugins: [
			react(),
			dts({
				insertTypesEntry: true,
			}),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		build: {
			lib: {
				entry: path.resolve(__dirname, "src/index.ts"),
				name: formattedName,
				formats: ["es", "umd"],
				fileName: (format) => `${formattedName}.${format}.js`,
			},
			rollupOptions: {
				external: ["react", "react/jsx-runtime", "react-dom", "tailwindcss"],
				output: {
					globals: {
						react: "React",
						"react/jsx-runtime": "react/jsx-runtime",
						"react-dom": "ReactDOM",
						tailwindcss: "tailwindcss",
					},
				},
			},
		},
		test: {
			globals: true,
			environment: "jsdom",
		},
	});
}
// https://vitejs.dev/config/
export default app;
