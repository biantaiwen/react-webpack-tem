const rm = require('rimraf')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const utils = require('./utils')
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

let webpackProdConfig = {
    mode: "production",
    context: config.path.context,
    devtool: config.build.devtool,
    entry: {
        app: config.path.appIndexJs,
    },
    output: {
        path: config.path.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: utils.assetsPath('js/[name].[chunkhash:8].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash:8].chunk.js')
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    optimization: {
        minimize: true,//最小化
        minimizer: [
            //js
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false
                    }
                },
                sourceMap: config.build.productionSourceMap,
                parallel: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        // runtimeChunk:true,
        namedModules:true,
        splitChunks:{
            chunks:'all'
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
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader:'css-loader',
                        options: {
                            sourceMap:config.build.productionSourceMap,
                            importLoaders: 2,
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
    plugins: [
        //添加一些环境变量
        new webpack.DefinePlugin({
            'process.env': config.build.NODE_ENV
        }),
        //提取css
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            // sourceMap:config.build.productionSourceMap,
            filename: "[name]..[contenthash:8].css",
            chunkFilename: "[id].[contenthash:8].css"
        }),
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: config.path.appHtml,
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: config.path.staticDirectory,
                to: config.path.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
        new webpack.optimize.SplitChunksPlugin({
            chunks: "initial",
        }),
        //https://webpack.docschina.org/plugins/hashed-module-ids-plugin/
        new webpack.HashedModuleIdsPlugin(),
        //可视化查看打包关系
        // new BundleAnalyzerPlugin()
    ]
}



const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.path.assetsRoot, config.path.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackProdConfig, (err, stats) => {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})