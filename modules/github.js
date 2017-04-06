(function ($, host) {

	if (!host('github.com', 'www.github.com')) return;

	Adopto.contentScript = {
		name: 'GitHub',
		sourceType: 2,
		callback: null,

		isProfilePageActive: function () {
			if ($('.vcard-fullname').length) {
				return true;
			}

			return false;
		},

		//isProfileMoreInfoActive: function () {
		//	return false;
		//},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;
			var m = candidateDataModel;
			m.mainData.fullName = $('.vcard-fullname').text();
			m.mainData.title = $('[itemprop=worksFor]').attr('title');
			m.mainData.contactInfo.email = $('li[itemprop="email"] a').html();
			m.mainData.location = $('[itemprop=homeLocation]').attr('title');
			//console.log($('.vcard-avatar img.avatar').attr('src'));
			m.mainData.profileImgUrl = $('.vcard-avatar img.avatar').attr('src');
			m.mainData.skills = Adopto.contentScript.getSkills();

			callback(m);
		},

		getSkills: function () {
			$.ajax({
				url: window.location.href + '?tab=repositories',
				async: true,
				cache: true,
				success: function (response) {
					var repos = $(response).find('#user-repositories-list li');
					var skills = [];
					for (var i = 0; i < repos.length; i++) {
						var skill = 'test';
						if (skills.indexOf(skill) < 0) {
							skills.push(skill);
						}
					}
					return skills;
				},
				error: function (error) {

				}
			})
			
		}

		//getProfilePageUrl: function () {
		//	return window.location.href;
		//},

		//getName: function () {
		//	return $('.vcard-fullname').text();
		//},

		//getEmail: function () {
		//	return '';
		//},

		//getJobTitle: function () {
		//	return $('[itemprop=worksFor]').attr('title');
		//},

		//getLocation: function () {
		//	return $('[itemprop=homeLocation]').attr('title');
		//},

		//getProfileImageURL: function () {
		//	return $('[itemprop=image] img').attr('src');
		//},

		//buttonPlaceholder: function (button) {
		//}
	};

})(jQuery, Adopto.hostTest);