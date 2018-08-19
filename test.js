"use strict"
var fs= require('fs');
const StaticServer = require('./staticServer');

// 创建对象
let server = new StaticServer();
/*fs.access('/public/test', fs.R_OK, (err) => {
  console.log(err ? 'no access!' : 'can read/write');
});*/

// 启动服务
server.run();

// 停止服务
// server.close();