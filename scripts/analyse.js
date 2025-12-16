process.env.NODE_ENV = "production";
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpackConfigProd = require("react-scripts/config/webpack.config")(
  "production"
);

webpackConfigProd.optimization = {
  splitChunks: {
    chunks: "all",
  },
};

webpackConfigProd.plugins.push(new BundleAnalyzerPlugin());

webpack(webpackConfigProd, (error, stats) => {
  if (error || stats.hasErrors()) {
    console.error(error);
  }
});
