const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const envFile = argv.mode === 'production' ? './src/environments/.env.production' : './src/environments/.env.development';

    return {
        entry: {
            index: './src/index.ts',
            about: './src/app/pages/about.ts',
            home: './src/app/pages/room/room.component.ts',
            login: './src/app/pages/login/login.component.ts',
            notFound: './src/app/pages/not-found.ts',
            lobby: './src/app/pages/lobby/lobby.component.ts',
            toolbar: './src/app/components/toolbar/toolbar.component.ts',
            modal: './src/app/components/modal/modal.component.ts'
        },
        optimization: {
            runtimeChunk: true,
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|tsx|ts)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@babel/preset-typescript',
                                    [
                                        "@babel/preset-env",
                                        {
                                            "targets": {
                                                "esmodules": true
                                            }
                                        }
                                    ]
                                ],
                                plugins: [
                                    ['@babel/plugin-proposal-decorators', { legacy: true }],
                                    ["@babel/plugin-proposal-private-methods", { "loose": true }],
                                    ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
                                    ["@babel/plugin-proposal-class-properties", { "loose": true }],
                                    "@babel/plugin-transform-runtime",
                                    "@babel/plugin-transform-block-scoping"
                                ]
                            }
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx', '.tsx', '.ts'],
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [
            new CleanWebpackPlugin(),
            new Dotenv({
                path: envFile,
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                filename: 'index.html',
                chunks: ['index'],
            }),
            new HtmlWebpackPlugin({
                filename: 'lobby.component.html',
                template: 'src/app/pages/lobby/lobby.component.html',
                chunks: ['lobby'],
            }),
            new HtmlWebpackPlugin({
                filename: 'about.html',
                template: 'src/app/pages/about.html',
                chunks: ['about'],
            }),
            new HtmlWebpackPlugin({
                filename: 'room.component.html',
                template: 'src/app/pages/room/room.component.html',
                chunks: ['room'],
            }),
            new HtmlWebpackPlugin({
                filename: 'login.component.html',
                template: 'src/app/pages/login/login.component.html',
                chunks: ['login'],
            }),
            new HtmlWebpackPlugin({
                filename: 'not-found.html',
                template: 'src/app/pages/not-found.html',
                chunks: ['notFound'],
            }),
            new HtmlWebpackPlugin({
                filename: 'room.component.html',
                template: 'src/app/pages/room/room.component.html',
                chunks: ['room'],
            }),
            new HtmlWebpackPlugin({
                filename: 'toolbar.component.html',
                template: 'src/app/components/toolbar/toolbar.component.html',
                chunks: ['toolbar'],
            }),
            new HtmlWebpackPlugin({
                filename: 'modal.component.html',
                template: 'src/app/components/modal/modal.component.html',
                chunks: ['modal'],
            }),
        ],
        devServer: {
            static: path.join(__dirname, 'dist'),
            historyApiFallback: true,
            port: 8081,
        },
    };
};