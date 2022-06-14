module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    cjs: false,
    umd: {
      global: "OnleaChat",
      externals: {
        react: "React",
        "react-dom": "ReactDOM",
      },
    },
  },
  webpack: {
    html: {
      mountId: "onleachat",
      template: "demo/src/index.html",
      lang: "en",
    },
    publicPath: '/demo/',
  },
  browsers: {
    production: [">0.2%", "ie 11", "not dead", "not op_mini all"],
    development: [
      "ie 11",
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version",
    ],
  },
};
