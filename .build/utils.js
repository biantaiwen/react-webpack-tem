const path = require('path')
const config = require('../config')
exports.assetsPath = function (_path) {
    const assetsSubDirectory = config.path.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}