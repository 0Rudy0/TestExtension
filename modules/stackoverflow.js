(function ($, host) {
	
	if (!host('stackoverflow.com', 'www.stackoverflow.com')) return;

	Adopto.contentScript = {
		name: 'Stack Overflow',
		sourceType: 7,

		isProfilePageActive: function () {
			if ($('.user-card-name').length) {
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
			return $('.user-card-name').contents()[0].nodeValue.trim();
		},

		getEmail: function () {
			return '';
		},

		getJobTitle: function () {
			return '';
		},

		getLocation: function () {
			return $('.icon-location').parent().text().trim();
		},

		getProfileImageURL: function () {
			return $('.avatar img').attr('src');
		},

		buttonPlaceholder: function (button) {

		}
	};

})(jQuery, Adopto.hostTest);