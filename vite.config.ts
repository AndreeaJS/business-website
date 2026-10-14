
import { defineConfig, type Plugin } from "vite";
import { fileURLToPath } from "node:url";

function cleanPageRoutes(): Plugin {
  return {
    name: "clean-page-routes",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const [pathname, query] = req.url.split("?");

          const routes: Record<string, string> = {
            "/portfolio": "/work.html",
            "/contact": "/contact.html",
          };

          if (routes[pathname]) {
            req.url = routes[pathname] + (query ? `?${query}` : "");
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [cleanPageRoutes()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        work: fileURLToPath(new URL("./work.html", import.meta.url)),
        contact: fileURLToPath(new URL("./contact.html", import.meta.url)),
      },
    },
  },
});
