(function ($, host) {

	if (!host('codeproject.com', 'www.codeproject.com')) return;

	Adopto.contentScript = {
		name: 'CodeProject',
		sourceType: 8,
		callback: null,

		isProfilePageActive: function () {
			if ($('.username').length) {
				return true;
			}

			return false;
		},

		isProfileMoreInfoActive: function () {
			return false;
		},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;

			var cd = candidateDataModel;
			cd.mainData.fullName = $('h1').text().split(' -')[0];
			//cd.mainData.socialNetworks.stackoverflow = window.location.href;
			cd.mainData.location = $('#ctl00_MC_Prof_MemberImage').parent().text().trim();
			cd.mainData.profileImgUrl = $('#ctl00_MC_Prof_MemberImage').attr('src');
			cd.mainData.title = $('#ctl00_MC_Prof_MemberProRow').text().trim();
			//cd.mainData.summary = $('.bio p').html();

			cd.mainData.socialNetworks.codeproject = 'http://codeproject.com' + $('.username a').attr('href');
			//cd.mainData.socialNetworks.twitter = $('.icon-twitter').parent().find('a').attr('href');

			Adopto.contentScript.callback(cd);
		}
	};

})(jQuery, Adopto.hostTest);