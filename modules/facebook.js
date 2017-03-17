(function ($, host) {

	if (!host('facebook.com', 'www.facebook.com')) return;

	Adopto.contentScript = {
		name: 'Facebook',
		sourceType: 1,

		isProfilePageActive: function () {
			if ($('#fbCoverImageContainer').length) {
				return true;
			}

			return false;
		},

		isProfileMoreInfoActive: function () {
			if (window.location.pathname.split('/')[2] == 'about') {
				return true;
			}

			return false;
		},

		getProfilePageUrl: function () {
			return window.location.origin + '/' + window.location.pathname.split('/')[1] + '/about'
		},

		getName: function () {
			return $('#fb-timeline-cover-name').html();
		},

		getEmail: function () {
			if (this.isProfileMoreInfoActive()) {

			}

			return '';
		},

		getJobTitle: function () {

			return '';
		},

		getLocation: function () {

			return '';
		},

		getProfileImageURL: function () {
			return $('.profilePic').attr('src');
		},

		buttonPlaceholder: function (button) {
			
		}
	};

})(jQuery, Adopto.hostTest);