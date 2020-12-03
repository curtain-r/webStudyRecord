const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  // module: {
  //   rules: [
  //     // 处理高级语法
  //     {
  //       test: /\.js/,
  //       exclude: /(node_modules)/,
  //       use: {
  //         loader: "babel-loader",
  //         options: {
  //           presets: ["env"],
  //         },
  //       },
  //     },
  //   ],
  // },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 这里是传入自定以引入打包后js文件的HTML文件，不指定则是默认
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
};
