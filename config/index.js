const path = require('path')
const fs = require('fs');

// const appDirectory = fs.realpathSync(process.cwd());
const appDirectory = fs.realpathSync(path.join(__dirname, '..'));
const resolveApp = (relativePath='') => path.resolve(appDirectory, relativePath);

module.exports = {
    dev: {
        NODE_ENV: '"development"',
        // Paths
        assetsPublicPath: '/',
        // Dev Server 配置
        devServer:{
            // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
            indexName:'index.html',
            // 代理配置
            proxyTable: {},
            host: '0.0.0.0', // can be overwritten by process.env.HOST   localhost
            port: 8080,
            open: true,// 自动打开浏览器
            overlay:{
                warnings: false,
                errors: true
            },
            poll: false
        },
        /**
         * Source Maps
         */
        devtool: 'cheap-module-source-map',


    },
    build: {
        NODE_ENV: '"production"',
        // Template for index.html
        index: resolveApp('dist/index.html'),
        // Paths
        assetsPublicPath: './',
        /**
         * Source Maps
         */
        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: 'source-map',
        // devtool:false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

    },
    path:{
        context:resolveApp(),
        appIndexJs:resolveApp('src/index.js'),
        appHtml: resolveApp('public/index.html'),
        appSrc: resolveApp('src'),
        staticDirectory:resolveApp('static'),
        assetsRoot:resolveApp('dist'),
        assetsSubDirectory: 'static',
        htmlFileName:'index.html',
    }
}
