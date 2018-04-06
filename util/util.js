
var fs = require('fs');

/**
 * 用于生成 JSON 文档
 * @param object {Object|Array}  原有的 JSON 对象模型
 * @return resultObjet {Object|Array} 文档化的 JSON 对象模型 
 */
function recordDoc(object) {
    
    if( checkType(object) === 'Object' ) {
        if( Object.keys(object).length > 0 ) {
            for(var prop in object) {
                object[prop] = recordDoc(object[prop]);
            }
        } else {
            // 什么也不做 ...
        }
    } else if( checkType(object) === 'Array' ) {
        if( object.length > 0 ) {
            object.forEach(function(value, index) {
                value = recordDoc(value);
            });
        } else {
            // 什么也不做 ...
        }
    } else {
        object = object + '      [ ' + checkType(object) + ' ]';
    }
    
    return object;
    
}


/**
 * 用于判断字段类型函数
 * @param field {*}  需要判断类型的变量或字面量 
 * @return resultType {String}  返回字段类型
 */
function checkType(field) {
    var resultType = '';
    return resultType = Object.prototype.toString.call(field).slice(8, -1);
}


/**
 * 判断文件是否已存在
 * @param path {String} 要判断的文件的路径
 * @param callback {Function} 成功的回调 
 */
function isExistFile(path, callback) {
    fs.stat(path, function(err, stat) {
        if( stat && stat.isFile() ) {
            callback(true);
        } else if(err && err.code === 'ENOENT') {
            callback(false);
        }
    });
}


/**
 * 判断文件夹是否存在
 * @param path {String} 要判断的文件夹的路径
 * @param callback {Function} 成功的回调
 */
function isExistDir(path, callback) {
    fs.stat(path, function(err, stat) {
        if( stat && stat.isDirectory() ) {
            callback(true);
        } else if(err && err.code === 'ENOENT') {
            callback(false);
        }
    });
}

/**
 * 将 JS 对象转化为 JSON 写入文件
 * @param path {String} 要写入的文件路径
 * @param data {Object} JS 对象
 * @param callback {Function} 写入成功的回调函数
 *
 */
function writeToFile(path, data, callback) {
    
    fs.writeFile(path, JSON.stringify(data, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            callback();
        }
    });
    
}



module.exports = {
    checkType : checkType,
    recordDoc : recordDoc,
    isExistFile : isExistFile,
    isExistDir : isExistDir,
    writeToFile : writeToFile
};