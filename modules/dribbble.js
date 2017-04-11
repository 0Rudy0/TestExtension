(function ($, host) {

	if (!host('dribbble.com', 'www.dribbble.com')) return;

	Adopto.contentScript = {
		name: 'Dribbble',
		sourceType: 5,

		isProfilePageActive: function () {
			if ($('.profile-actions>.profile-hire>a.hire').length) {
				return true;
			}

			return false;
		},

		isProfileMoreInfoActive: function () {
			return false;
		},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;

			var cd = candidateDataModel;
			cd.mainData.fullName = $('.profile-info h2.vcard a.url')[0].innerText.trim();
			cd.mainData.location = $('.profile-info h2.vcard span.location a.locality').html()
			cd.mainData.summary = $('.profile-info div.bio').html().trim()
			cd.mainData.profileImgUrl = $('.profile-info h2.vcard picture>img.photo').attr('src');

			cd.mainData.socialNetworks.dribble = window.location.href;

			var skills = $('.profile-info div.skills a');
			for (var i = 0; i < skills.length; i++) {
				cd.mainData.skills.push(skills[i].innerText);
			}

			var extra = $('.profile-info div.profile-extra ul.profile-details li a');
			for (var i = 0; i < extra.length; i++) {
				if ($(extra[i]).attr('class').indexOf('website') > -1) {
					cd.mainData.socialNetworks.website = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('twitter') > -1) {
					cd.mainData.socialNetworks.twitter = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('facebook') > -1) {
					cd.mainData.socialNetworks.facebook = $(extra[i]).attr('href');
				}
			}

			$.ajax({
				url: $('.full-tabs-links li.projects>a').attr('href'),
				async: true,
				cache: true,
				success: function (response) {
					var projs = $(response).find('#content ol.list-of-scrolling-rows li.group.bucket div.bucket-name a');
					for (var i = 0; i < projs.length; i++) {
						$.ajax({							
							url: $(projs[i]).attr('href'),
							async: true,
							cache: true,
							success: function (resp) {
								var name = $(response).find('.profile-info h2.vcard>a.url[rel!="contact"]').html();
								console.log(name);
							}
						})
					}
				},
				error: function () {

				}
			})

			Adopto.contentScript.callback(cd);
		}
	};

})(jQuery, Adopto.hostTest);