(function ($, host) {

	//https://twitter.com/VonC_
	
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

		insertAdoptoIcon: function (content) {
			$('.ProfileHeaderCard-nameLink').append(content);
			$('img.adoptoIconClick').css('position', 'relative');
			$('img.adoptoIconClick').css('top', '3px');
			$('img.adoptoIconClick').css('left', '5px');
		},

		isProfileMoreInfoActive: function () {
			return false;
		},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;
			var m = candidateDataModel;

			m.mainData.fullName = $('.ProfileHeaderCard-nameLink').text();
			m.mainData.socialNetworks.twitter = window.location.href;
			m.mainData.location = $('.ProfileHeaderCard-locationText').text().trim();
			m.mainData.profileImgUrl = $('img.ProfileAvatar-image').attr('src');
			m.mainData.summary = $('p.ProfileHeaderCard-bio.u-dir').length > 0 ? $('p.ProfileHeaderCard-bio.u-dir').html().trim() : '';

			var links = $('.ProfileHeaderCard-url a');
			for (var i = 0; i < links.length; i++) {
				var a = links[i];
				if (a.getAttribute('href').indexOf('stackoverflow.com') > -1) {
					m.mainData.socialNetworks.stackoverflow = a.getAttribute('href');
				}
				else if (a.getAttribute('href').indexOf('facebook.com') > -1) {
					m.mainData.socialNetworks.facebook = a.getAttribute('href');
				}
				else if (a.getAttribute('href').indexOf('linkedin.com') > -1) {
					m.mainData.socialNetworks.linkedin = a.getAttribute('href');
				}
				else if (a.getAttribute('href').indexOf('github.com') > -1) {
					m.mainData.socialNetworks.github = a.getAttribute('href');
				}
				else if (a.getAttribute('href').indexOf('vine.co') > -1) {

				}
				else {
					m.mainData.socialNetworks.website = a.getAttribute('href');
				}
			}

			Adopto.contentScript.callback(m);
		}
	};

})(jQuery, Adopto.hostTest);