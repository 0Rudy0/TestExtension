String.prototype.format = function (data) {
	var string = this;

	for (var key in data) {
		string = string.split('{{' + key + '}}').join(data[key]);
	}

	return string;
}