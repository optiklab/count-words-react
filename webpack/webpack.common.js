const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const srcDir = path.join(__dirname, '..', 'src');

module.exports = {
    entry: {
      index: path.join(srcDir, 'index.tsx'),
      app: path.join(srcDir, 'App.tsx'),
      popup: path.join(srcDir, 'popup.tsx'),
      options: path.join(srcDir, 'options.tsx'),
      background: path.join(srcDir, 'background-service-worker.ts'),
      contentScript: path.join(srcDir, 'content-script.tsx'),
      wordsCounter: path.join(srcDir, 'words-counter.ts')
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

