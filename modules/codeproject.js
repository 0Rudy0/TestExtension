(function ($, host) {

	//example profiles
	// https://www.codeproject.com/script/Membership/View.aspx?mid=40863
	// https://www.codeproject.com/script/Membership/View.aspx?mid=4425742
	// https://www.codeproject.com/script/Membership/View.aspx?mid=36803

	if (!host('codeproject.com', 'www.codeproject.com')) return;

	Adopto.contentScript = {
		name: 'CodeProject',
		sourceType: 8,
		callback: null,

		isProfilePageActive: function () {
			if ($('.username').length) {
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
			cd.mainData.fullName = $('h1').text().split(' -')[0];
			//cd.mainData.socialNetworks.stackoverflow = window.location.href;
			cd.mainData.location = $('#ctl00_MC_Prof_MemberImage').parent().text().trim();
			cd.mainData.profileImgUrl = $('#ctl00_MC_Prof_MemberImage').attr('src');
			cd.mainData.title = $('#ctl00_MC_Prof_MemberProRow').text().trim();
			cd.mainData.summary = $('.member-profile>tbody>tr>td>div:nth-child(3)').html();
			if (cd.mainData.summary.indexOf('<br') > -1) {
				cd.mainData.summary = cd.mainData.summary.substring(0, cd.mainData.summary.indexOf('<br'));
			}
			cd.mainData.socialNetworks.codeproject = 'http://codeproject.com' + $('.username a').attr('href');

			var links = $('.member-rep-list.extended>tbody>tr>td:nth-child(2) a');
			for (var i = 0; i < links.length; i++) {
				if (links[i].getAttribute('href').indexOf('twitter.com') > -1) {
					cd.mainData.socialNetworks.twitter = links[i].getAttribute('href');
				}
				else if (links[i].getAttribute('href').indexOf('linkedin.com') > -1) {
					cd.mainData.socialNetworks.linkedin = links[i].getAttribute('href');
				}
				else if (links[i].getAttribute('title').indexOf('View member\'s homepage') > -1) {
					cd.mainData.socialNetworks.website = links[i].getAttribute('title');
				}
			}

			var articlesLink = $('#ctl00_MC_Prof_ArticleContributionLink').attr('href');
			$.ajax({
				url: articlesLink,
				async: true,
				cache: true,
				success: function (data) {
					var skills = $(data).find('table.padded>tbody>tr>td>h5');
					for (var i = 0; i < skills.length; i++) {
						if (candidateDataModel.mainData.skills.indexOf(skills[i].innerText)) {
							candidateDataModel.mainData.skills.push(skills[i].innerText);
						}

					}
					Adopto.contentScript.callback(cd);
				}
			});

		}
	};

})(jQuery, Adopto.hostTest);