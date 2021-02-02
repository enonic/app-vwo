const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const assets = path.join(__dirname, '/build/resources/main/assets');

module.exports = {
    context: path.join(__dirname, '/src/main/resources/assets'),
    mode: 'production',
    entry: {
        'bundle': './js/app-vwo.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader, options: {publicPath: '../', hmr: false}},
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: false,
                            importLoaders: 1,
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ],
            },
            {
                test: /\.(eot|woff|woff2|ttf)$|icomoon.svg/,
                use: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /^\.(png)$/,
                use: 'file-loader?name=images/[name].[ext]'
            }
        ]
    },
    output: {
        path: assets,
        filename: './js/[name].js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './css/bundle.css',
            chunkFilename: '[id].css'
        })
    ],
    resolve: {
        extensions: ['.js', '.less', '.css']
    }
};
