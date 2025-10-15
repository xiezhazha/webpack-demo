const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const PROJECT_ROOT = path.resolve(__dirname);
const SERVER_DIST_PATH = path.join(PROJECT_ROOT, "dist");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/app/index.ts",
  },
  devServer: {
    static: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PROJECT_ROOT, "/src/public/index.html"),
      inject: "head",
    }),
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: SERVER_DIST_PATH,
    clean: true,
    library: "StreamClientScrcpy",
    libraryTarget: "umd",
    globalObject: "this",
  },
  // optimization: {
  //   runtimeChunk: "single",
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PROJECT_ROOT, "/src/public/index.html"),
      inject: "head",
    }),
    new MiniCssExtractPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new NodePolyfillPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.tsx?$/,
        use: [
          { loader: "ts-loader" },
          {
            loader: "ifdef-loader",
            options: {
              SCRCPY_LISTENS_ON_ALL_INTERFACES: true,
              USE_WEBCODECS: true,
              USE_BROADWAY: true,
              USE_H264_CONVERTER: true,
              USE_TINY_H264: true,
              USE_WDA_MJPEG_SERVER: false,
              USE_QVH_SERVER: true,
              INCLUDE_DEV_TOOLS: true,
              INCLUDE_ADB_SHELL: true,
              INCLUDE_FILE_LISTING: true,
              INCLUDE_APPL: false,
              INCLUDE_GOOG: true,
              PATHNAME: "/",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(asset)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]",
            },
          },
        ],
      },
      {
        test: /\.jar$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        ],
      },
      {
        test: /LICENSE/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    fallback: {
      path: "path-browserify",
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  performance: {
    hints: false, // 关闭性能警告
    maxAssetSize: 244 * 1024, // 单个资产的最大大小（单位：字节）
    maxEntrypointSize: 244 * 1024, // 入口点的最大大小（单位：字节）
  },
};
