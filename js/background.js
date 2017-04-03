var allowedUrls = [
	["https://www.linkedin.com/in/", "modules/linkedin.js"]
];

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
	if (details.frameId == 0) {
		var allowedURL = null;

		for (var i = 0; i < allowedUrls.length; i++) {
			if (details.url.match(allowedUrls[i][0])) {
				allowedURL = allowedUrls[i];
				break;
			}
		}

		if (allowedURL) {
			chrome.tabs.executeScript(details.tabId, { file: "jquery-3.2.0.min.js" }, function (result) {
				chrome.tabs.executeScript(details.tabId, { file: "common.js" }, function () {
					chrome.tabs.executeScript(details.tabId, { file: allowedURL[1] }, null);
				});
			});
		}
	}
});