const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'main.ts'),
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ],
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js', '.scss']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        favicon: path.resolve(__dirname, 'assets/favicon.ico') // Optional: if using HtmlWebpackPlugin to add favicon
      }),
      new FaviconsWebpackPlugin({
        logo: path.resolve(__dirname, 'assets/favicon.ico'),
        outputPath: 'favicons/',
        inject: true,
        favicons: {
          appName: 'PowerFlow',
          appDescription: 'Make your life easier and automate',
          developerName: null,
          developerURL: null,
          background: '#fff',
          theme_color: '#333',
          icons: {
            coast: false,
            yandex: false
          }
        }
      })
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist')
      },
      compress: true,
      port: 9000
    }
  };
};
