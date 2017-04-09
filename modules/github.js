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

		getData: function (callback) {
			Adopto.contentScript.callback = callback;
			var m = candidateDataModel;
			m.mainData.fullName = $('.vcard-fullname') ? $('.vcard-fullname').text().trim() : '';
			m.mainData.title = $('[itemprop=worksFor]').attr('title') ? $('[itemprop=worksFor]').attr('title').trim() : '';
			m.mainData.contactInfo.email = $('li[itemprop="email"] a').html() ? $('li[itemprop="email"] a').html().trim() : '';
			m.mainData.location = $('[itemprop=homeLocation]') && $('[itemprop=homeLocation]').attr('title') ? $('[itemprop=homeLocation]').attr('title').trim() : '';
			m.mainData.profileImgUrl = $('.vcard-avatar img.avatar') ? $('.vcard-avatar img.avatar').attr('src').trim() : '';
			m.mainData.socialNetworks.website = $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html() ? $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html().trim() : '';
			m.mainData.summary = $('.user-profile-bio').length > 0 ? $('.user-profile-bio')[0].innerText : '';


			var username = $('span.vcard-username').html();
			m.mainData.socialNetworks.github = 'https://github.com/' + username;
			Adopto.contentScript.getSkills(username, m);
			//m.mainData.skills = Adopto.contentScript.getSkills(m);

			//callback(m);
		},

		getSkills: function (username, m) {
			$.ajax({
				url: m.mainData.socialNetworks.github + '?tab=repositories',
				async: true,
				cache: false,
				success: function (response) {
					var langs = $(response).find('span[itemprop="programmingLanguage"]');
					for (var i = 0; i < langs.length; i++) {
						if (m.mainData.skills.indexOf(langs[i].innerText.trim()) < 0) {
							m.mainData.skills.push(langs[i].innerText.trim());
						}
					}
					Adopto.contentScript.callback(m);
					//return;
					var reps = $(response).find('div.js-repo-list>li');
					for (var i = 0; i < reps.length; i++) {
						var r = reps[i];
						//console.log($(r).find('h3>a').attr('href'));
						//console.log($(r).find('h3>a').html());
						//console.log($(r).find('p[itemprop="description"]').html());
						var newProj = {
							title: $(r).find('h3>a').html().trim(),
							desc: $(r).find('p[itemprop="description"]').html().trim(),
							url: $(r).find('h3>a').attr('href').trim(),
							startDate: moment(),
							endDate: moment()
						};
						m.mainData.projects.push(newProj);

						if (i == 0) {
							setTimeout(function () {
								$.ajax({
									url: $(r).find('h3>a').attr('href').trim() + '/graphs/contributors-data',
									async: true,
									cache: true,
									success: Adopto.contentScript.onGetProjectUrl.bind(newProj),
									error: function (err) {

									}
								});
							}, (i + 1) * 2000);
							
						}
					}

				},
				error: function (error) {
					console.log(error);
				}
			})
			
		},

		onGetProjectUrl: function (response) {
			//return;
			var proj = this;
			//var dateRange = $(response).find('h3.js-date-range').html().trim();
			var multiply = Math.pow(10, 13 - response[0].weeks[0].w.toString().length);
			var startDate = new Date(response[0].weeks[0].w * multiply);
			var endDate = new Date(response[0].weeks[response[0].weeks.length - 1].w * multiply);
			console.log(startDate.toLocaleDateString('hr') + ' - ' + endDate.toLocaleDateString('hr'));
		}
	};

})(jQuery, Adopto.hostTest);