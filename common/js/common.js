//引入字符串校验器
let validator = require('validator');

/**
 * @param {Object} number
 * 判断是不是数字
 */
function isNotNumber(number) {
	return !(validator.isNumeric(number.toString()) && number != 0);
}

/**
 * @param {Object} str
 * 万分位格式化数字，保留两位小数
 */
function formatMoney(str) {
	str = str.toString();
	let index = str.indexOf('.');
	//存在小数的情况
	if (index != -1) {
		return str.substring(0, index).replace(/\B(?=(\d{4})+(?!\d))/g, ',') + str.substr(index, 3).padEnd(3, 0);
	}
	return str.replace(/\B(?=(\d{4})+(?!\d))/g, ',') + '.00';
}

module.exports = {
	formatMoney,
	isNotNumber
}
