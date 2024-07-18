const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const srcDir = path.join(__dirname, '..', 'src');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
      popup: path.join(srcDir, 'popup/popup.tsx'),
      options: path.join(srcDir, 'options/options.tsx'),
      background: path.join(srcDir, 'background/background-service-worker.tsx'),
      contentScript: path.join(srcDir, 'contentScript/content-script.tsx'),
      wordsCounter: path.join(srcDir, 'utils/wordsCounter.tsx')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
              test: /\.css$/i,
              use: ['style-loader', 'css-loader'],
            },
            {
              test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
              type: 'asset/resource'
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new CleanWebpackPlugin({
          cleanStaleWebpackAssets: false,
        }),
        new CopyPlugin({
            patterns: [
                { from: "public", to: "../" }
            ],
            options: {},
        }),
        ...getHtmlPlugins([
          'popup',
          'options'
        ]),
    ],
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist/js')
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6,
            output: { 
              ascii_only: true 
            },
          },
        }),
      ],
      splitChunks: {
        chunks(chunk) {
          return chunk.name !== 'contentScript' && chunk.name !== 'background'
        }
      },
    }
}

function getHtmlPlugins(chunks) {
  return chunks.map(chunk => new HtmlPlugin({
    title: 'React Extension',
    filename: `${chunk}.html`,
    chunks: [chunk],
  }))
}

