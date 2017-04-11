(function ($, host) {

	//examples:
	//https://angel.co/jdh
	//https://angel.co/dfjjosh

	if (!host('angel.co')) return;

	Adopto.contentScript = {
		name: 'AngelList',
		sourceType: 3,
		callback: null,

		isProfilePageActive: function () {
			if ($('[itemprop=name]').length) {
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
			m.mainData.fullName = $('[itemprop="name"]').text().trim();
			m.mainData.title = $('.subheader-tags span.fontello-tag-1').next().html();
			//m.mainData.contactInfo.email = $('li[itemprop="email"] a').html() ? $('li[itemprop="email"] a').html().trim() : '';
			m.mainData.location = $('.subheader-tags span.fontello-location').next().html();

			m.mainData.profileImgUrl = $('.js-avatar-img').attr('src');
			//m.mainData.socialNetworks.website = $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html() ? $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html().trim() : '';
			//m.mainData.summary = $('.user-profile-bio').length > 0 ? $('.user-profile-bio')[0].innerText : '';


			//var username = $('span.vcard-username').html();
			m.mainData.socialNetworks.angellist = window.location.href;
			m.mainData.socialNetworks.linkedin = $('a.fontello-linkedin[data-field="linkedin_url"]').attr('href');
			m.mainData.socialNetworks.twitter = $('a.fontello-twitter[data-field="twitter_url"]').attr('href');
			m.mainData.socialNetworks.facebook = $('a.fontello-facebook[data-field="facebook_url"]').attr('href');
			m.mainData.socialNetworks.linkedin = $('a.fontello-linkedin[data-field="linkedin_url"]').attr('href');
			//Adopto.contentScript.getSkills(username, m);
			//m.mainData.skills = Adopto.contentScript.getSkills(m);

			if ($('.js-modules-container .experience .profile-module>div.startup_roles').length > 0) {
				var exp = JSON.parse($('.js-modules-container .experience .profile-module>div.startup_roles').attr('data-roles'));
				for (var i = 0; i < exp.length; i++) {
					var startDate;
					var endDate;
					if (exp[i].dates_for_select.started_at.month) {
						startDate = moment().month(exp[i].dates_for_select.started_at.month);
						startDate = startDate.year(exp[i].dates_for_select.started_at.year);
					}
					if (exp[i].dates_for_select.ended_at.month) {
						endDate = moment().month(exp[i].dates_for_select.ended_at.month);
						endDate = endDate.year(exp[i].dates_for_select.ended_at.year);
					}
					m.mainData.experience.push({
						title: exp[i].role.charAt(0).toUpperCase() + exp[i].role.slice(1).replace('_', ' '),
						atPlace: exp[i].startup_company_name,
						placeLink: exp[i].startup_slug_url,
						placeLogo: exp[i].startup_avatar,
						startDate: startDate,
						endDate: endDate
					})
				}
			}

			var skills = $('div.profile-module div.show div.module_taggings[data-field=tags_skills] span.tag a');
			for (var i = 0; i < skills.length; i++) {
				m.mainData.skills.push(skills[i].innerHTML);
			}

			//m.mainData.summary = $('div.profile-module div.show div.content.summary').length > 0 ? $('div.profile-module div.show div.content.summary')[0].innerText.trim() : '';
			m.mainData.summary = $('div[data-field="bio"]').length > 0 ? $('div[data-field="bio"]')[0].innerText.trim() : '';

			if ($('.js-modules-container .education .profile-module>div.profiles-show').length > 0) {
				var edu = JSON.parse($('.js-modules-container .education .profile-module>div.profiles-show').attr('data-taggings'))
				for (var i = 0; i < edu.length; i++) {

					m.mainData.education.push({
						title: edu[i].degree_name == null ? (edu[i].full_degree_name == null ? 'Student' : edu[i].full_degree_name) : edu[i].degree_name,
						atPlace: edu[i].name,
						placeLink: edu[i].new_tag.tag_url,
						placeLogo: edu[i].new_tag.logo_src,
						startDate: null,
						endDate: edu[i].graduation_month != null ? moment().month(edu[i].graduation_month).year(edu[i].graduation_year) : null
					})
				}
			}

			Adopto.contentScript.callback(m);
			//callback(m);
		}
	};

})(jQuery, Adopto.hostTest);