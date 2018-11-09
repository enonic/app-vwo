import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const assets = path.join(__dirname, '/build/resources/main/assets');

module.exports = {
    context: path.join(__dirname, '/src/main/resources/assets'),
    mode: 'development',
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
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoader: 2,
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                            javascriptEnabled: true
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
            filename: './css/bundle.css'
        })
    ],
    resolve: {
        extensions: ['.js', '.less', '.css']
    }
};
