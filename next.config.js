
const withCSS = require("@zeit/next-css");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { ANALYZE, SERVICE_WORKER } = process.env;
const { GenerateSW } = require("workbox-webpack-plugin");
const withOffline = require("next-offline");

module.exports = withOffline(
  withCSS({
    cssModules: true,
    cssLoaderOptions: {
      localIdentName: "[local]-[hash:base64:5]"
    },

    pagesGlobPattern: "pages/**/*page.js",

    webpack: config => {
    
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
  })
);
