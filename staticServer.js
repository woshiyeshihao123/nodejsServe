
"use strict"
// 引入模块
const http = require('http');
const fs = require('fs');
const url = require('url');
const mime = require('mime'); // 用于处理文件的 Conten-Type
                              // 需要安装模块：npm install mime
                              
//创建并导出StaticServer类


module.exports = class staticServer{
	//构造函数
	constructor(options){
		this.currentServer = null ; //http 对象
		this.options = {
			port:1337,   //服务器启动端口
			host:'127.0.0.1',  //
			filePath:'/public', //静态文件根目录
			homePage:'/index.html'  //指定首页文件
		};
		for(let key in options)
		{
			this.options[key] = options[key];
		}
	}
	
	//启动服务器函数
	run(){
		let self = this;
		console.log("enter run");
		//通过http.CreateServer 创建http服务
		this.currentServer = http.createServer(function(req,res){
			let tmpUrl = url.parse(req.url).pathname; //解析请求的url
			let reqUrl = tmpUrl === '/' ? self.options.homePage : tmpUrl; // 如果用户访问的是 '/' 首页，则自动指定读取首页文件，默认是 'index.html'
           console.log("reqUrl"+reqUrl);
           let filePath = self.options.filePath + reqUrl; // 组装文件地址
				   console.log("filePath"+filePath);
				   // 检测文件是否存在
	        self.checkFilePromise(filePath).then(() => {
	        	console.log("can accses");
	            // 文件存在则尝试读取文件
	            return self.readFilePromise(filePath);
	        }).then((data) => {
	            // 文件读取成功
	            // 发送文件数据
	            console.log("data"+data);
	            self.sendData(res, data, reqUrl);
	        }).catch(() => {
	            // 统一处理错误
	            // 文件不存在或者读取失败
	            self.catch404(res);
	        });
		}).listen(this.options.port, this.options.host,()=>{
				console.log("enter the listen 1337");
		});
		

	}
	
	close(){
		this.currentServer.close(()=>{
			console.log("server closed");
		});
	}
	
	
	//content-type能定义返回给用户的data的类型
	sendData(res,data,url)
	{
				res.writeHead(200, { 'Content-Type': 'application/json' }); 
				//res.writeHead(200, { 'Content-Type': mime.lookup(url) });   //直接以文件的形式下载
        res.write(data);
        res.end();
	}
	
	    // 捕获404错误
  catch404(res) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Error 404. Resource not found.');
        res.end();
    }
    
    readFilePromise(path){
    	return new Promise((resolve, reject)=>{
    		fs.readFile(path,(err,data)=>{
    			if(err)
    			{
    				reject(err);
    			}
    			else
    			{
    				resolve(data);
    			}
    		});
    	});
    }
    
    checkFilePromise(path){
    	return new Promise((resolve, reject)=>{   
    		console.log("path"+path);
    		fs.access("/public/test",fs.R_OK,(err)=>{
    			if(err)
    			{
    				console.log("err");
    				reject(err);
    			}
    			else
    			{
    				console.log("success");
    				resolve('success');
    				
    			}
    		});
    	});
    }
}
