(function ($, host) {

	if (!host('linkedin.com', 'www.linkedin.com')) return;

	Adopto.contentScript = {
		name: 'LinkedIn',
		sourceType: 6,

		isProfilePageActive: function () {
			if ($('.full-name').length) {
				return true;
			}

			return false;
		},

		isProfileMoreInfoActive: function () {
			return false;
		},

		getProfilePageUrl: function () {
			return $('.view-public-profile').text();
		},

		getName: function () {
			return $('.full-name').text();
		},

		getEmail: function () {
			return $('#email-view').text();
		},

		getJobTitle: function () {
			return $('#headline-container').text();
		},

		getLocation: function () {
			return '';
		},

		getProfileImageURL: function () {
			return $('.profile-picture img').attr('src');
		},

		buttonPlaceholder: function (button) {
		}
	};

})(jQuery, Adopto.hostTest);