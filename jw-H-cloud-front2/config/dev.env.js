'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.0.116:9000/api/v1"'
 BASE_API: '"http://192.168.0.205:9000/api/v1"'
//  BASE_API: '"http://47.104.253.201:9000/api/v1"'
})
