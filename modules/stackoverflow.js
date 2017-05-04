(function ($, host) {

	//http://stackoverflow.com/users/2849934/john
	//http://stackoverflow.com/users/6612932/wasthishelpful
	//http://stackoverflow.com/users/63550/peter-mortensen

	if (!host('stackoverflow.com', 'www.stackoverflow.com', 'meta.stackoverflow.com')) return;

	Adopto.contentScript = {
		name: 'Stack Overflow',
		sourceType: 7,
		callback: null,
		minUpvotesForSkillToCount: 10,

		isProfilePageActive: function () {
			if ($('.user-card-name').length) {
				return true;
			}
			return false;
		},

		insertAdoptoIcon: function (content) {
			$('.user-card-name').append(content);
			$('img.adoptoIconClick').css('position', 'relative');
			$('img.adoptoIconClick').css('top', '3px');
		},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;

			var cd = candidateDataModel;
			cd.mainData.fullName = $('.user-card-name').contents()[0].nodeValue.trim();
			cd.mainData.socialNetworks.stackoverflow = window.location.href;
			cd.mainData.location = $('.icon-location').parent().text().trim();
			cd.mainData.profileImgUrl = $('#avatar-card img').attr('src');
			cd.mainData.title = $('.current-position').html().trim();
			cd.mainData.summary = $('.bio')[0].innerText;

			cd.mainData.socialNetworks.github = $('.icon-github').parent().find('a').attr('href');
			cd.mainData.socialNetworks.twitter = $('.icon-twitter').parent().find('a').attr('href');

			Adopto.contentScript.getSkills(window.location.href + '?tab=tags&sort=votes&page=', 1);
		},

		getSkills: function (url, page) {
			$.ajax({
				url: url + page,
				ajax: true,
				cache: true,
				success: function (response) {
					if ($(response).find('.user-tags tr td').length == 0) {
						Adopto.contentScript.callback(candidateDataModel);
					}
					else {
						var tags = $(response).find('.user-tags tr td');
						var goToNextPage = true;
						for (var i = 0; i < tags.length; i++) {
							var t = tags[i];
							var name = $(t).find('a.post-tag').html();
							var score = $(t).find('div.answer-votes').html();
							if (parseInt(score) >= Adopto.contentScript.minUpvotesForSkillToCount) {
								candidateDataModel.mainData.skills.push(name);
							}
							else {
								goToNextPage = false;
							}
						}
						if (goToNextPage) {
							Adopto.contentScript.getSkills(url, page + 1);
						}
						else {
							Adopto.contentScript.callback(candidateDataModel);

						}
					}
				}
			});
		}

	};

})(jQuery, Adopto.hostTest);