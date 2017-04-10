(function ($, host) {

	if (!host('stackoverflow.com', 'www.stackoverflow.com')) return;

	Adopto.contentScript = {
		name: 'Stack Overflow',
		sourceType: 7,
		callback: null,

		isProfilePageActive: function () {
			if ($('.user-card-name').length) {
				return true;
			}
			return false;
		},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;

			var cd = candidateDataModel;
			cd.mainData.fullName = $('.user-card-name').contents()[0].nodeValue.trim();
			cd.mainData.socialNetworks.stackoverflow = window.location.href;
			cd.mainData.location = $('.icon-location').parent().text().trim();
			cd.mainData.profileImgUrl = $('#avatar-card img').attr('src');
			cd.mainData.title = $('.current-position').html().trim();
			cd.mainData.summary = $('.bio p').html();

			cd.mainData.socialNetworks.github = $('.icon-github').parent().find('a').attr('href');
			cd.mainData.socialNetworks.twitter = $('.icon-twitter').parent().find('a').attr('href');

			//Adopto.contentScript.returnData();
			Adopto.contentScript.callback(candidateDataModel);
		}
	};

})(jQuery, Adopto.hostTest);