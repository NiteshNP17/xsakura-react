// vite.config.ts
import { defineConfig } from "file:///D:/workspace/React-Projects/xs-06/node_modules/vite/dist/node/index.js";
import react from "file:///D:/workspace/React-Projects/xs-06/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///D:/workspace/React-Projects/xs-06/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react({}),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "logo192.png", "logo512.png"],
      devOptions: {
        enabled: true
      },
      manifest: {
        name: "XSakura",
        theme_color: "#121212",
        icons: [
          {
            src: "logo192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3Jrc3BhY2VcXFxcUmVhY3QtUHJvamVjdHNcXFxceHMtMDZcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHdvcmtzcGFjZVxcXFxSZWFjdC1Qcm9qZWN0c1xcXFx4cy0wNlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovd29ya3NwYWNlL1JlYWN0LVByb2plY3RzL3hzLTA2L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe30pLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIixcbiAgICAgIGluamVjdFJlZ2lzdGVyOiBcImF1dG9cIixcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcImZhdmljb24uaWNvXCIsIFwibG9nbzE5Mi5wbmdcIiwgXCJsb2dvNTEyLnBuZ1wiXSxcbiAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiBcIlhTYWt1cmFcIixcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiIzEyMTIxMlwiLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJsb2dvMTkyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJsb2dvNTEyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UixTQUFTLG9CQUFvQjtBQUMxVCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU0sQ0FBQyxDQUFDO0FBQUEsSUFDUixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxnQkFBZ0I7QUFBQSxNQUNoQixlQUFlLENBQUMsZUFBZSxlQUFlLGFBQWE7QUFBQSxNQUMzRCxZQUFZO0FBQUEsUUFDVixTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
