const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const assets = path.join(__dirname, '/build/resources/main/assets');
const isProd = process.env.NODE_ENV === 'production';

const SRC_DIR = 'src/main/resources';

module.exports = {
    context: path.join(__dirname, '/src/main/resources/assets'),
    externals: [/\/lib\/(http-client)/],
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'source-map',
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
                    {loader: MiniCssExtractPlugin.loader, options: {publicPath: '../'}},
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !isProd
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    }
                ],
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
        extensions: ['.js', '.less', '.css'],
        alias: {
			'/lib': path.resolve(__dirname, SRC_DIR, 'lib'),
		},
    }
};
