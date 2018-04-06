
var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    queryString = require('querystring');


var util = require('./util.js');

/**
 * 从文件读取数据
 * @param fromPath {String} 读取的文件目录
 * @param callback {Function} 成功的回调函数
 *
 */
function readFromFile(fromPath, callback) {
    fs.readFile(fromPath , 'utf8', function(err, data) {
        if(err) {
            console.log(err);
        } else {
            try {
                var myData = JSON.parse(data);
                callback(myData);
            } catch(e) {
                console.log(e);
                throw new Error('使用 JSON 进行数据交换');
            }
        }
    });
}


/**
 * 发送 http 请求 取回数据
 * @param urlAddress {String}  url 地址
 * @param method {String}  请求方式
 * @param options {Object} 传递参数
 * @param callback {Function} 成功的回调函数
 *
 */
function readFromHttp(urlAddress, method, options, callback) {
    var data = undefined,
        urlObj = url.parse(urlAddress),
        headerInfo = {
            hostname : urlObj.hostname,
            port : urlObj.port,
            path : urlObj.path
        };

    if(typeof options !== 'undefined') {
        data = queryString.stringify(options);
    }

    if(method === 'GET' || method === 'get') {
        if(data) {
            headerInfo['path'] += '?' + data;
        }
        headerInfo['method'] = 'GET';
    }

    if(method === 'POST' || method === 'post') {
        headerInfo['method'] = 'POST';
        headerInfo['headers'] = {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length' : data.length
        }

    }

    var req = http.request(headerInfo, function(res) {
        var myChunk = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            myChunk += chunk;
        });
        res.on('end', function() {
            try {
                callback( JSON.parse(myChunk) );
            } catch(e) {
                console.log(e);
                throw new Error('使用 JSON 进行数据交换');
            }
        });
    });

    req.on('error', function(err) {
        console.log(err);
    });

    if( headerInfo['method'] === 'POST' ) {
        req.write(data);
    }
    req.end();
}


/**
 * 文档接口适配
 * @param options {Object} 请求参数对象
 * @param callback {Function} 回调函数
 */
function interfaceAdapter(options, callback) {
    if( options.url.indexOf('http') === -1 ) {
        readFromFile(options.url, function(data) {
            options['returnData'] = data;
            callback( util.recordDoc(options) );
        });
    } else {
        readFromHttp(options.url, options.method, options.data, function(chunk) {
            options['returnData'] = chunk;
            callback( util.recordDoc(options) );
        });
    }
}


module.exports = {
    readFromHttp : readFromHttp,
    readFromFile : readFromFile,
    interfaceAdapter : interfaceAdapter
};
