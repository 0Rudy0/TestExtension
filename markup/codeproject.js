(function ($, host) {

	if (!host('codeproject.com', 'www.codeproject.com')) return;

	Adopto.contentScript = {
		name: 'CodeProject',
		sourceType: 8,

		isProfilePageActive: function () {
			if ($('.username').length) {
				return true;
			}

			return false;
		},

		isProfileMoreInfoActive: function () {
			return false;
		},

		getProfilePageUrl: function () {
			return 'http://codeproject.com' + $('.username a').attr('href');
		},

		getName: function () {
			return $('h1').text().split(' -')[0];
		},

		getEmail: function () {
			return '';
		},

		getJobTitle: function () {
			return $('#ctl00_MC_Prof_MemberProRow').text().trim();
		},

		getLocation: function () {
			return $('#ctl00_MC_Prof_MemberImage').parent().text().trim();
		},

		getProfileImageURL: function () {
			return $('#ctl00_MC_Prof_MemberImage').attr('src');
		},

		buttonPlaceholder: function (button) {
		}
	};

})(jQuery, Adopto.hostTest);