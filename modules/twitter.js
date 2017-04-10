(function ($, host) {
	
	if (!host('twitter.com')) return;

	Adopto.contentScript = {
		name: 'Twitter',
		sourceType: 13,
		callback: null,

		isProfilePageActive: function () {
			if ($('.ProfileHeaderCard-nameLink').length) {
				return true;
			}

			return false;
		},

		isProfileMoreInfoActive: function () {
			return false;
		},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;
			var m = candidateDataModel;

			m.mainData.fullName = $('.ProfileHeaderCard-nameLink').text();
			//m.mainData.title = $('[itemprop=worksFor]').attr('title') ? $('[itemprop=worksFor]').attr('title').trim() : '';
			//m.mainData.contactInfo.email = $('li[itemprop="email"] a').html() ? $('li[itemprop="email"] a').html().trim() : '';
			m.mainData.location = $('.ProfileHeaderCard-locationText').text().trim();
			m.mainData.profileImgUrl = $('.ProfileHeaderCard-screennameLink').attr('href');
			m.mainData.socialNetworks.linkedin = $('.ProfileHeaderCard-screennameLink').attr('href');
			//m.mainData.summary = $('.user-profile-bio').length > 0 ? $('.user-profile-bio')[0].innerText : '';


			//var username = $('span.vcard-username').html();
			//m.mainData.socialNetworks.github = 'https://github.com/' + username;
			//Adopto.contentScript.getSkills(username, m);
			//m.mainData.skills = Adopto.contentScript.getSkills(m);

			Adopto.contentScript.callback(m);
			//callback(m);
		}
	};

})(jQuery, Adopto.hostTest);