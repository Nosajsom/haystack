const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
const withFonts = require("next-fonts");
const webpack = require("webpack");
const path = require("path");

module.exports = {...withFonts(
  withCSS(
    withImages(
      withSass({
        webpack(config, { isServer }) {
          config.module.rules.push({
            test: /\.(eot|ttf|woff|woff2)$/,
            use: {
              loader: "url-loader",
            },
          });
          if (!isServer) {
            config.node = {
              fs: 'empty'
            }
          }
          config.devtool= 'source-map'
          config.watchOptions= {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 500
          },
          config.resolve.modules.push(path.resolve("./"));
          return config;
        },
      })
    )
  )
),...{
  basePath: '/admin',
  async rewrites() {
    return [
      {// ! This is bad security, it should not be used in a production system
        source: '/elasticsearch/:path*',
        destination: 'http://elasticsearch:9200/:path*' // Proxy to Backend
      }
    ]
  }
}
}
