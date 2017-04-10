(function ($, host) {

	if (!host('dribbble.com', 'www.dribbble.com')) return;

	Adopto.contentScript = {
		name: 'Dribbble',
		sourceType: 5,

		isProfilePageActive: function () {
			if ($('.profile-name [rel=contact]').length) {
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
			cd.mainData.fullName = $('.profile-name [rel=contact]').attr('title');
			//cd.mainData.socialNetworks.stackoverflow = window.location.href;
			cd.mainData.location = $('.profile-location .location').text();
			cd.mainData.profileImgUrl = $('.profile-photo img').attr('src');
			cd.mainData.title = $('h2.bio').text();
			//cd.mainData.summary = $('.bio p').html();

			cd.mainData.socialNetworks.dribble = window.location.href;
			//cd.mainData.socialNetworks.twitter = $('.icon-twitter').parent().find('a').attr('href');

			Adopto.contentScript.callback(cd);
		}
	};

})(jQuery, Adopto.hostTest);