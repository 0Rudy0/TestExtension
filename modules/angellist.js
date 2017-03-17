(function ($, host) {

	if (!host('angel.co')) return;

	Adopto.contentScript = {
		name: 'AngelList',
		sourceType: 3,

		isProfilePageActive: function () {
			if ($('[itemprop=name]').length) {
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
			return $('[itemprop=name]').text().trim();
		},

		getEmail: function () {
			return '';
		},

		getJobTitle: function () {
			return $('.fontello-tag-1 + a').text();
		},

		getLocation: function () {
			return $('.fontello-location + a').text();
		},

		getProfileImageURL: function () {
			return $('.js-avatar-img').attr('src');
		},

		buttonPlaceholder: function (button) {
		}
	};

})(jQuery, Adopto.hostTest);