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
			m.mainData.profileImgUrl = $('.vcard-avatar img.avatar').attr('src');
			m.mainData.socialNetworks.website = $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html();
			m.mainData.summary = $('.user-profile-bio').length > 0 ? $('.user-profile-bio')[0].innerText : '';


			var username = $('span.vcard-username').html();
			Adopto.contentScript.getSkills(username, m);
			//m.mainData.skills = Adopto.contentScript.getSkills(m);

			//callback(m);
		},

		getSkills: function (username, m) {
			$.ajax({
				url: 'https://github.com/' + username + '?tab=repositories',
				async: true,
				cache: true,
				success: function (response) {
					var langs = $(response).find('span[itemprop="programmingLanguage"]');
					for (var i = 0; i < langs.length; i++) {
						if (m.mainData.skills.indexOf(langs[i].innerText.trim()) < 0) {
							m.mainData.skills.push(langs[i].innerText.trim());
						}
					}
					Adopto.contentScript.callback(m);
				},
				error: function (error) {
					console.log(error);
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