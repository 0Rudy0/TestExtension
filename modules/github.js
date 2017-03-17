(function ($, host) {

	if (!host('github.com', 'www.github.com')) return;

	Adopto.contentScript = {
		name: 'GitHub',
		sourceType: 2,

		isProfilePageActive: function () {
			if ($('.vcard-fullname').length) {
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
			return $('.vcard-fullname').text();
		},

		getEmail: function () {
			return '';
		},

		getJobTitle: function () {
			return $('[itemprop=worksFor]').attr('title');
		},

		getLocation: function () {
			return $('[itemprop=homeLocation]').attr('title');
		},

		getProfileImageURL: function () {
			return $('[itemprop=image] img').attr('src');
		},

		buttonPlaceholder: function (button) {
		}
	};

})(jQuery, Adopto.hostTest);