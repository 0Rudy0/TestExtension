(function ($, host) {

	if (!host('facebook.com', 'www.facebook.com')) return;

	Adopto.contentScript = {
		name: 'Facebook',
		sourceType: 1,
		callback: null,

		isProfilePageActive: function () {
			if ($('img.coverPhotoImg.photo.img').length) {
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

		getData: function (callback) {
			Adopto.contentScript.callback = callback;
			var m = candidateDataModel;
			m.mainData.fullName = $('#fb-timeline-cover-name') ? $('#fb-timeline-cover-name').html().trim() : '';
			//m.mainData.title = $('[itemprop=worksFor]').attr('title') ? $('[itemprop=worksFor]').attr('title').trim() : '';
			var intro = $('#intro_container_id');
			m.mainData.summary = intro.find('#profile_intro_card_bio')[0].innerText;
			var lis = intro.find('li');

			for (var i = 0; i < lis.length; i++) {
				if ($(lis[i]).find('i.img.sx_3adcbb').length > 0) {
					m.mainData.title = $(lis[i]).find('div._50f3')[0].innerText;
				}
				else if ($(lis[i]).find('i.img.sx_a97b39').length > 0) {
					m.mainData.location = $(lis[i]).find('div._50f3')[0].innerText;
				}
			}
			//m.mainData.contactInfo.email = $('li[itemprop="email"] a').html() ? $('li[itemprop="email"] a').html().trim() : '';
			//m.mainData.location = $('[itemprop=homeLocation]') && $('[itemprop=homeLocation]').attr('title') ? $('[itemprop=homeLocation]').attr('title').trim() : '';
			//m.mainData.profileImgUrl = $('.vcard-avatar img.avatar') ? $('.vcard-avatar img.avatar').attr('src').trim() : '';
			//m.mainData.socialNetworks.website = $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html() ? $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html().trim() : '';
			//m.mainData.summary = $('.user-profile-bio').length > 0 ? $('.user-profile-bio')[0].innerText : '';


			//var username = $('span.vcard-username').html();
			//Adopto.contentScript.getSkills(username, m);
			//m.mainData.skills = Adopto.contentScript.getSkills(m);

			callback(m);
		},

		getSkills: function (username, m) {
			//$.ajax({
			//	url: 'https://github.com/' + username + '?tab=repositories',
			//	async: true,
			//	cache: true,
			//	success: function (response) {
			//		var langs = $(response).find('span[itemprop="programmingLanguage"]');
			//		for (var i = 0; i < langs.length; i++) {
			//			if (m.mainData.skills.indexOf(langs[i].innerText.trim()) < 0) {
			//				m.mainData.skills.push(langs[i].innerText.trim());
			//			}
			//		}
			//		Adopto.contentScript.callback(m);
			//	},
			//	error: function (error) {
			//		console.log(error);
			//	}
			//})
			
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