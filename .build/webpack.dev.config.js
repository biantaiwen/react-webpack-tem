const path = require('path')
const portfinder = require('portfinder')
const webpack = require('webpack')
const config = require('../config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const utils = require('./utils')
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';


function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

let webpackDevConfig = {
    mode: 'development',
    context: config.path.context,
    devtool: config.dev.devtool,
    entry: {
        app: config.path.appIndexJs,
    },
    output: {
        path: config.path.assetsRoot,
        filename: '[name].js',
        publicPath: config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': resolve('src')
        }
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude:resolve('node_modules'),
                include: [config.path.appSrc],
                loader: "babel-loader"
            },
            {
                test:/\.(sa|sc|c)ss$/,
                loader:[
                    'style-loader',
                    {
                        loader:'css-loader',
                        options: {
                            modules:true,
                            sourceMap:true,
                            importLoaders: 1,
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                {from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, config.dev.devServer.indexName)},
            ],
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: config.dev.devServer.host,
        port: config.dev.devServer.port,
        open: config.dev.devServer.open,
        overlay: config.dev.devServer.overlay,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.devServer.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.devServer.poll,
        },
    },
    plugins: [
        //添加一些环境变量
        new webpack.DefinePlugin({
            'process.env': config.dev.NODE_ENV
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),

        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.path.htmlFileName,
            template: config.path.appHtml,
            inject: true
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: config.path.staticDirectory,
                to: config.path.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
    ]
}

module.exports = new Promise((resolve, reject) => {
    //设置端口
    portfinder.basePort = config.dev.devServer.port
    //检查端口是否可用,如果不可用,则寻找一个可用的端口
    portfinder.getPortPromise().then((port) => {
        // process.env.PORT = port
        webpackDevConfig.devServer.port = port
        webpackDevConfig.plugins.push(new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://${webpackDevConfig.devServer.host}:${port}`],
            }
        }))
        resolve(webpackDevConfig)
    }).catch((error) => {
        if (error && error.message) {
            console.log(`获取端口失败 : ${error.message}`)
        }
        console.log('退出进程')
        process.exit(1)
        reject(error)
    })
})
