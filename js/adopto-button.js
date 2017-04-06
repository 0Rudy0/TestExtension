chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(
		null,
		{
			code: 'Adopto.sidebar.toggle();'
		}
	);
});

chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(function (msg) {
		if (msg.value == 'enabled') {
			chrome.browserAction.setIcon({ path: chrome.extension.getURL('icon/icon_24.png') });
		} else if (msg.value == 'disabled') {
			chrome.browserAction.setIcon({ path: chrome.extension.getURL('icon/icon_24_gray.png') });
		}
	});
});



chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
	if (details.frameId == 0) {
		chrome.tabs.executeScript(
			null,
			{
				code: 'Adopto.sidebar.getCandidateData();'
			}
		);
	}
});