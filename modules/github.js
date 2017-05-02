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

		insertAdoptoIcon: function (content) {
			$('[itemprop="name"]').append(content);
			$('img.adoptoIconClick').css('position', 'relative');
			$('img.adoptoIconClick').css('top', '3px');
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
					//return;
					var reps = $(response).find('div.js-repo-list>li');
					for (var i = 0; i < Math.min(reps.length, 2); i++) {
						var r = reps[i];
						//console.log($(r).find('h3>a').attr('href'));
						//console.log($(r).find('h3>a').html());
						//console.log($(r).find('p[itemprop="description"]').html());
						var newProj = {
							projectTitle: $(r).find('h3>a').html().trim(),
							desc: $(r).find('p[itemprop="description"]').length > 0 ? $(r).find('p[itemprop="description"]').html().trim() : '',
							url: 'https://github.com' + $(r).find('h3>a').attr('href').trim(),
							//startDate: moment(),
							//endDate: moment()
						};
						if (i == Math.min(reps.length, 1)) {
							newProj.isLast = true;
						}
						m.mainData.projects.push(newProj);
						m.mainData.projects.push(newProj);
						m.mainData.projects.push(newProj);
						m.mainData.projects.push(newProj);
						m.mainData.projects.push(newProj);
						m.mainData.projects.push(newProj);
						m.mainData.projects.push(newProj);

						setTimeout(Adopto.contentScript.getProjectData.bind(newProj), (i + 1) * 200);
					}

				},
				error: function (error) {
					console.log(error);
				}
			})
			
		},

		getProjectData: function () {
			var newProj = this;
			$.ajax({
				url: newProj.url + '/graphs/contributors-data',
				async: true,
				cache: true,
				success: Adopto.contentScript.onGetProjectUrl.bind(newProj),
				error: function (err) {

				}
			});
		},

		onGetProjectUrl: function (response) {
			//return;
			var proj = this;
			if (response[0].weeks != null && response[0].weeks.length > 0) {
				var multiply = Math.pow(10, 13 - response[0].weeks[0].w.toString().length);
				var startDate = new Date(response[0].weeks[0].w * multiply);
				var endDate = startDate;
				//var maxTime = startDate;
				//var dateRange = $(response).find('h3.js-date-range').html().trim();
				for (var i = 0; i < response.length; i++) {
					var user = response[i].weeks;
					for (var j = 0; j < user.length; j++) {
						if (user[j].a > 0 || user[j].c > 0 || user[j].d > 0) {
							if (new Date(user[j].w * multiply) > endDate) {
								endDate = new Date(user[j].w * multiply);
							}
						}
					}
				}
				proj.startDate = moment(startDate.getTime());
				//ako je bilo aktivnosti na projektu u zadnjih mjesec dana, endDate je null sto znaci do danas
				proj.endDate = ((new Date()).getTime() - endDate.getTime()) > (30 * 24 * 60 * 60 * 1000) ? moment(endDate.getTime()) : null;
			}

			if (proj.isLast) {
				Adopto.contentScript.callback(candidateDataModel);
			}
			//console.log(proj.title);
			//console.log(startDate.toLocaleDateString('hr') + ' - ' + endDate.toLocaleDateString('hr'));
		}
	};

})(jQuery, Adopto.hostTest);