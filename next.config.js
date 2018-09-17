const fs = require("fs");
const path = require("path");
const withCSS = require("@zeit/next-css");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ANALYZE, SERVICE_WORKER } = process.env;
const { GenerateSW } = require("workbox-webpack-plugin");
const withOffline = require("next-offline");

// eslint-disable-next-line no-sync
const babelConfig = JSON.parse(fs.readFileSync("./.babelrc"));

const aliases = babelConfig.plugins.find(
  ([plugin]) => plugin === "module-resolver"
)[1].alias;

module.exports = withOffline({
  webpack(config, options) {
    return withCSS({
      cssModules: true,
      cssLoaderOptions: {
        localIdentName: "[local]-[hash:base64:5]"
      },

      pagesGlobPattern: "pages/**/*page.js",

      webpack: config => {
        // Inject polyfills entrypoint.
        const originalEntry = config.entry;

        // Clone aliases for them to work on compiled files such as CSS.
        // @TODO: any way to make it only happen per extension?
        for (let src in aliases) {
          config.resolve.alias[src] = path.resolve(aliases[src]);
        }

        config.entry = async () => {
          const entries = await originalEntry();

          // Only add entrypoint on the client code build (not the server).
          if (entries["main.js"]) {
            entries["main.js"].unshift("./src/polyfills.js");
          }

          return entries;
        };

        if (SERVICE_WORKER) {
          config.plugins.push(
            new GenerateSW({
              swDest: "./static/sw.js",
              clientsClaim: true,
              skipWaiting: true
            })
          );
        }

        if (ANALYZE) {
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: "server",
              analyzerPort: 8888,
              openAnalyzer: true
            })
          );
        }

        return config;
      }
    });
  }
});
