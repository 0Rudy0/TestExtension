var Adopto = {
	sidebar: {
		element: $('<div class="adopto-sidebar"></div>')
	},

	hostTest: function () {
		for (var i = 0; i < arguments.length; i++) {
			host = arguments[i];
			if (window.location.host == host) {
				return true;
			}
		};
		return false;
	},

	contentScript: null,

	lang: "en",
	langData: null,

	codeData: null,
	getCodeData: function (onLoad) {
		$.getJSON('https://adopto.eu/Browser/GetCodeData')
			.done(function (data) {
				Adopto.codeData = data;
				if (onLoad) {
					onLoad();
				}
			});
	},

	//port: chrome.runtime.connect({name: 'adopto'}),
	//iconStatus: function () {
	//	if (Adopto.contentScript) {
	//		Adopto.port.postMessage({value: 'enabled'});
	//	} else {
	//		Adopto.port.postMessage({value: 'disabled'});
	//	}
	//}
};

(function ($) {

	$(function () {
		console.log('%c Adopto Extension started', 'font-size: 24px; font-weight: bold; color: #00acac;');

		//Adopto.iconStatus();
		//$(window).focus(Adopto.iconStatus);
	});

	$('.tab-header').click(function () {
		$('.tab-content .tab').hide();
		$('.nav-tabs .tab-header').removeClass('active');
		$(this).addClass('active');
		$('.tab-content .' + $(this).attr('data-tab')).show();
		//console.log($(this).attr('data-tab'));
	});

	$($('.nav-tabs .tab-header')[0]).addClass('active');
	$($('.tab-content .tab')[0]).show();

} (jQuery));