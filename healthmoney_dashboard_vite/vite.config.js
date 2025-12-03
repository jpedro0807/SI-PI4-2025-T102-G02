import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			// Qualquer rota que começar com /api, o Vite manda pro Java (8080)
			"/api": {
				target: "http://localhost:8080",
				changeOrigin: true,
				secure: false,
			},
			// Login do Google também precisa ir pro Java
			// '/loginGoogle': {
			//   target: 'http://localhost:8080',
			//   changeOrigin: true,
			//   secure: false,
			// }
		},
	},
});
