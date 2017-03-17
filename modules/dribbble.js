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

		getProfilePageUrl: function () {
			return window.location.href;
		},

		getName: function () {
			return $('.profile-name [rel=contact]').attr('title');
		},

		getEmail: function () {
			return '';
		},

		getJobTitle: function () {
			return $('h2.bio').text();
		},

		getLocation: function () {
			return $('.profile-location .location').text();
		},

		getProfileImageURL: function () {
			return $('.profile-photo img').attr('src');
		},

		buttonPlaceholder: function (button) {
			
		}
	};

})(jQuery, Adopto.hostTest);