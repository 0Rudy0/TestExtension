(function ($, host) {
	
	if (!host('twitter.com')) return;

	Adopto.contentScript = {
		name: 'Twitter',
		sourceType: 13,

		isProfilePageActive: function () {
			if ($('.ProfileHeaderCard-nameLink').length) {
				return true;
			}

			return false;
		},

		isProfileMoreInfoActive: function () {
			return false;
		},

		getProfilePageUrl: function () {
			return $('.ProfileHeaderCard-screennameLink').attr('href');
		},

		getName: function () {
			return $('.ProfileHeaderCard-nameLink').text();
		},

		getEmail: function () {
			return '';
		},

		getJobTitle: function () {
			return '';
		},

		getLocation: function () {
			return $('.ProfileHeaderCard-locationText').text().trim();
		},

		getProfileImageURL: function () {
			return $('.ProfileAvatar-image').attr('src');
		},

		buttonPlaceholder: function (button) {

		}
	};

})(jQuery, Adopto.hostTest);