(function ($, host) {

	if (!host('facebook.com', 'www.facebook.com')) return;

	Adopto.contentScript = {
		name: 'Facebook',
		sourceType: 1,
		callback: null,
		finishedOverview: false,
		finishedEducation: false,
		finishedContact: false,
		aseFrameContents: null,

		isProfilePageActive: function () {
			if ($('img.coverPhotoImg.photo.img').length || $('#fbCoverImageContainer').length) {
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

		insertAdoptoIcon: function (content) {
			$('[itemprop="name"]').append(content);
			$('img.adoptoIconClick').css('position', 'relative');
			$('img.adoptoIconClick').css('top', '3px');
		},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;
			var m = candidateDataModel;
			m.mainData.fullName = $('#fb-timeline-cover-name') ? $('#fb-timeline-cover-name').html().trim() : '';
			m.mainData.socialNetworks.facebook = window.location.href;
			m.mainData.profileImgUrl = $('.profilePicThumb img.profilePic').attr('src');
			//m.mainData.title = $('[itemprop=worksFor]').attr('title') ? $('[itemprop=worksFor]').attr('title').trim() : '';
			var intro = $('#intro_container_id');
			m.mainData.summary = intro.find('#profile_intro_card_bio i[alt="Edit Bio"]').length > 0 ? intro.find('#profile_intro_card_bio')[0].innerText : '';
			var lis = intro.find('li');

			for (var i = 0; i < lis.length; i++) {
				if ($(lis[i]).find('i.img.sp_8HRwYyV2j2G.sx_3adcbb').length > 0) {
					var el = $(lis[i]).find('div._50f3')[0];
					if (el != null) {
						m.mainData.title = el.innerHTML.substring(0, el.innerHTML.indexOf(' at '));
						console.log($(el).find('a.profileLink').attr('href'));
					}
				}
				else if ($(lis[i]).find('i.img.sx_a97b39').length > 0) {
					m.mainData.location = $(lis[i]).find('div._50f3 a')[0].innerText;
				}
			}

			var aboutUrl = $('#fbTimelineHeadline a[data-tab-key="about"]').attr('href');

			var iframe = document.createElement("iframe");
			iframe.onload = function () {
				aseFrameContents = $("#aseFrame").contents();

				$(".pv-contact-info button", aseFrameContents).click();

				var stap = 100;
				var $body = $("body", aseFrameContents);

				var scrollInterval = setInterval(function () {
					if (($body.scrollTop() + stap) < ($body.height() - $(window).height())) {
						$body.scrollTop($body.scrollTop() + stap);
					} else {
						clearInterval(scrollInterval);
						Adopto.contentScript.getWorkAndEducation();
					}
				}, 10);
			};

			iframe.id = "aseFrame";
			iframe.src = aboutUrl + '&section=overview&target="_top"&pnref=about';
			//iframe.src = window.location.href;
			iframe.style.position = "absolute";
			iframe.style.display = "none";
			iframe.style.top = "0";
			iframe.style.width = "100%";
			iframe.style.height = "100%";
			document.body.appendChild(iframe);

			//getOverview(aboutUrl + '&section=overview&pnref=about', m);
			//Adopto.contentScript.getWorkAndEducation(aboutUrl + '&section=education&pnref=about', m);
			//getContactAndBasicInfo(aboutUrl + '&section=contact-info&pnref=about', m);
			//m.mainData.contactInfo.email = $('li[itemprop="email"] a').html() ? $('li[itemprop="email"] a').html().trim() : '';
			//m.mainData.location = $('[itemprop=homeLocation]') && $('[itemprop=homeLocation]').attr('title') ? $('[itemprop=homeLocation]').attr('title').trim() : '';
			//m.mainData.profileImgUrl = $('.vcard-avatar img.avatar') ? $('.vcard-avatar img.avatar').attr('src').trim() : '';
			//m.mainData.socialNetworks.website = $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html() ? $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html().trim() : '';
			//m.mainData.summary = $('.user-profile-bio').length > 0 ? $('.user-profile-bio')[0].innerText : '';


			//var username = $('span.vcard-username').html();
			//Adopto.contentScript.getSkills(username, m);
			//m.mainData.skills = Adopto.contentScript.getSkills(m);

			//callback(m);
		},

		//getOtherInfo: function (m) {
		//	$.ajax({
		//		url: $('#fbTimelineHeadline a[data-tab-key="about"]').attr('href'),
		//		async: true,
		//		cache: true,
		//		success: function (response) {
					
		//			Adopto.contentScript.callback(m);
		//		},
		//		error: function (error) {
		//			console.log(error);
		//		}
		//	})			
		//},

		getOverview: function (url) {
			$.ajax({
				url: url,
				async: false,
				cache: true,
				success: function (response) {
					//Adopto.contentScript.finishedOverview = true;
					//var items = $(response).find('div[data-pnref="overview"] li');
					//for (var i = 0; i < items.length; i++) {
					//	if ($(items[i]).find('div.clearfix _5y02 _2kio').attr('data-overview'))
					//}
					////var workId = $('li#u_3r_3');

					//if (Adopto.contentScript.finishedEducation && 
					//	Adopto.contentScript.finishedContact &&
					//	Adopto.contentScript.finishedOverview) {
					//	Adopto.contentScript.callback(m);
					//}
				},
				error: function (error) {
					console.log(error);
				}
			})
		},
		
		getWorkAndEducation: function (url, m) {
			var exp = $('div[data-pnref="work"] ul.fbProfileEditExperiences li.experience', aseFrameContents);
			for (var i = 0; i < exp.length; i++) {
				var e = exp[i];
				var companyLogo = $(e).find('a._ohe img').attr('src');
				var companyUrl = $(e).find('._2lzr._50f5._50f7 a').attr('href');
				var companyName = $(e).find('._2lzr._50f5._50f7 a').html();
				var jobDescEl = $(e).find('div.fsm.fwn.fcg');
				var jobTitle = jobDescEl.length > 0 ? jobDescEl.html().substring(0, jobDescEl.html().indexOf('<span')) : '';
				var jobDscTxt = jobDescEl.length > 0 ? jobDescEl.html() : '';
				var duration = jobDscTxt.substring(jobDscTxt.indexOf('</span>') + 7);
				duration = duration.substring(0, duration.indexOf('<span'));

				//console.log('');
				//console.log(companyLogo);
				//console.log(companyUrl);
				//console.log(companyName);
				//console.log(jobTitle);
				//console.log(duration);

				m.mainData.experience.push({
					title: jobTitle,
					atPlace: companyName,
					placeLink: companyUrl,
					placeLogo: companyLogo,
					startDate: moment(),
					endDate: moment()
				});
			}

			return;
			$.ajax({
				url: url,
				async: false,
				cache: true,
				success: function (response) {
					Adopto.contentScript.finishedEducation = true;
					
					var exp = $('div[data-pnref="work"] ul.fbProfileEditExperiences li.experience');
					for (var i = 0; i < exp.length; i++) {
						var e = exp[i];
						var companyLogo = $(e).find('a._ohe img').attr('src');
						var companyUrl = $(e).find('._2lzr._50f5._50f7 a').attr('href');
						var companyName = $(e).find('._2lzr._50f5._50f7 a').html();
						var jobDescEl = $(e).find('div.fsm.fwn.fcg');
						var jobTitle = jobDescEl.length > 0 ? jobDescEl.html().substring(0, jobDescEl.html().indexOf('<span')) : '';
						var jobDscTxt = jobDescEl.length > 0 ? jobDescEl.html() : '';
						var duration = jobDscTxt.substring(jobDscTxt.indexOf('</span>') + 7);
						duration = duration.substring(0, duration.indexOf('<span'));

						//console.log('');
						//console.log(companyLogo);
						//console.log(companyUrl);
						//console.log(companyName);
						//console.log(jobTitle);
						//console.log(duration);

						m.mainData.experience.push({
							title: jobTitle,
							atPlace: companyName,
							placeLink: companyUrl,
							placeLogo: companyLogo,
							startDate: moment(),
							endDate: moment()
						});
					}

					var edu = $('div[data-pnref="edu"] ul.fbProfileEditExperiences li.experience');
					for (var i = 0; i < edu.length; i++) {
						var e = edu[i];
						var companyLogo = $(e).find('a._ohe img').attr('src');
						var companyUrl = $(e).find('._2lzr._50f5._50f7 a').attr('href');
						var companyName = $(e).find('._2lzr._50f5._50f7 a').html();
						var jobDescEl = $(e).find('div.fsm.fwn.fcg');
						var jobTitle = jobDescEl.length > 0 ? jobDescEl.html().substring(0, jobDescEl.html().indexOf('<span')) : '';
						var jobDscTxt = jobDescEl.length > 0 ? jobDescEl.html() : '';
						var duration = jobDscTxt.substring(jobDscTxt.indexOf('</span>') + 7);
						duration = duration.substring(0, duration.indexOf('<span'));
						var desc = $(e).find('._3-8w._50f8').length > 0 ? $(e).find('._3-8w._50f8')[0].innerHTML : '';

						//console.log('');
						//console.log(companyLogo);
						//console.log(companyUrl);
						//console.log(companyName);
						//console.log(jobTitle);
						//console.log(duration);
						//console.log(desc);

						m.mainData.education.push({
							title: jobTitle,
							atPlace: companyName,
							placeLink: companyUrl,
							placeLogo: companyLogo,
							startDate: moment(),
							endDate: moment(),
							desc: desc
						});
					}

					Adopto.contentScript.callback(m);
					if (Adopto.contentScript.finishedEducation && 
						Adopto.contentScript.finishedContact &&
						Adopto.contentScript.finishedOverview) {
						Adopto.contentScript.callback(m);
					}
				},
				error: function (error) {
					console.log(error);
				}
			})
		},

		getContactAndBasicInfo: function(url, m) {
			$.ajax({
				url: url,
				async: false,
				cache: true,
				success: function (response) {
					//Adopto.contentScript.finishedContact = true;
					//var items = $(response).find('div[data-pnref="overview"] li');
					//for (var i = 0; i < items.length; i++) {
					//	if ($(items[i]).find('div.clearfix _5y02 _2kio').attr('data-overview'))
					//}
					////var workId = $('li#u_3r_3');

					//if (Adopto.contentScript.finishedEducation && 
					//	Adopto.contentScript.finishedContact &&
					//	Adopto.contentScript.finishedOverview) {
					//	Adopto.contentScript.callback(m);
					//}
				},
				error: function (error) {
					console.log(error);
				}
			})
		}
	};

})(jQuery, Adopto.hostTest);