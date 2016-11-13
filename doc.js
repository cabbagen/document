
var fs = require('fs'),
	util = require('./util/util.js'),
	read = require('./util/read.js');

var configPath = './config/' + process.argv[2] + '.json';
var configData = null;


/**
 * 处理初始数据
 * @param configData {Object}  初始传入数据
 *
 */
function handleConfig(configData) {
	configData.pages.forEach(function(value, index) {
		var toPath = './doc/' + configData.name + '/' + value.name + '.json';
		
		value.interfaces.forEach(function(interfaceItem) {
			read.interfaceAdapter(interfaceItem, function(data) {
				util.writeToFile(toPath, value, function() {
					console.log(toPath + '\t\t' + interfaceItem.name.replace(/\s+\[ String \]/, '') + '\t\t写入成功');
				});
			});
		});
		
	});
}

fs.readFile(configPath, function(err, data) {
	if(err) {
		console.log(err);
	} else {
		configData = JSON.parse(data);
		
		util.isExistDir('./doc/' + configData.name + '/', function(flag) {
			if(!flag) {
				fs.mkdir('./doc/' + configData.name, function(err) {
					if(err) {
						console.log(err);
					} else {
						handleConfig(configData);
					}
				});
				
			} else {
				handleConfig(configData);
			}
		});
	}
	
});