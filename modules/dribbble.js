(function ($, host) {

	//examples:
	//https://dribbble.com/idilunal
	//https://dribbble.com/ThePoddi
	//https://dribbble.com/Madgraphism

	if (!host('dribbble.com', 'www.dribbble.com')) return;

	Adopto.contentScript = {
		name: 'Dribbble',
		sourceType: 5,
		projsUrl: '',

		isProfilePageActive: function () {
			if ($('.profile-info .profile-essentials').length) {
				return true;
			}

			return false;
		},

		isProfileMoreInfoActive: function () {
			return false;
		},

		insertAdoptoIcon: function (content) {
			$('h2.vcard a.url').append(content);
			$('img.adoptoIconClick').css('position', 'relative');
			$('img.adoptoIconClick').css('top', '3px');
			$('img.adoptoIconClick').css('left', '5px');
		},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;

			var cd = candidateDataModel;
			cd.mainData.fullName = $('.profile-info h2.vcard a.url')[0].innerText.trim();
			cd.mainData.location = $('.profile-info h2.vcard span.location a.locality').html()
			cd.mainData.summary = $('.profile-info div.bio').length > 0 ? $('.profile-info div.bio').html().trim() : '';
			cd.mainData.profileImgUrl = $('.profile-info h2.vcard picture>img.photo').attr('src');

			cd.mainData.socialNetworks.dribble = window.location.href;

			var skills = $('.profile-info div.skills a');
			for (var i = 0; i < skills.length; i++) {
				cd.mainData.skills.push(skills[i].innerText);
			}

			var extra = $('.profile-info div.floating-sidebar-extra ul.profile-details li a');
			for (var i = 0; i < extra.length; i++) {
				if ($(extra[i]).attr('class') == null) {
					continue;
				}
				if ($(extra[i]).attr('class').indexOf('website') > -1) {
					cd.mainData.socialNetworks.website = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('twitter') > -1) {
					cd.mainData.socialNetworks.twitter = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('facebook') > -1) {
					cd.mainData.socialNetworks.facebook = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('github') > -1) {
					cd.mainData.socialNetworks.github = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('linkedin') > -1) {
					cd.mainData.socialNetworks.linkedin = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('skype') > -1) {
					cd.mainData.socialNetworks.skype = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('stackoverflow') > -1) {
					cd.mainData.socialNetworks.stackoverflow = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('angellist') > -1) {
					cd.mainData.socialNetworks.angellist = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('xing') > -1) {
					cd.mainData.socialNetworks.xing = $(extra[i]).attr('href');
				}
				else if ($(extra[i]).attr('class').indexOf('google') > -1) {
					cd.mainData.socialNetworks.googlePlus = $(extra[i]).attr('href');
				}
			}

			Adopto.contentScript.projsUrl = $('.full-tabs-links li.projects>a').attr('href');
			if (Adopto.contentScript.projsUrl != null) {
				Adopto.contentScript.getProjectsNextPage(1);
			}
			else {
				Adopto.contentScript.callback(candidateDataModel);
			}
		},

		getProjectsNextPage: function(pageNum) {
			$.ajax({
				url: Adopto.contentScript.projsUrl + '?page=' + pageNum + '&per_page=6',
				async: true,
				cache: true,
				success: function (response) {
					if (response.trim().length == 0) {
						Adopto.contentScript.callback(candidateDataModel);
					}
					var projs = $.parseHTML(response);
					var projsPropper = [];
					for (var i = 0; i < projs.length; i++) {
						if (projs[i].nodeName == 'LI') {
							projsPropper.push(projs[i]);
						}
					}
					for (var i = 0; i < projsPropper.length; i++) {
						var link = $(projsPropper[i]).find('div.bucket-name a').attr('href');
						var name = $(projsPropper[i]).find('div.bucket-name a').html();
						var proj = {
							projectTitle: name,
							url: link
						};
						proj.atPage = pageNum;

						if (i == projsPropper.length - 1) {
							proj.isLast = true;
						}

						$.ajax({
							url: $(projsPropper[i]).find('ol').attr('data-url'),
							async: true,
							cache: true,
							success: Adopto.contentScript.onGetDetailsData.bind(proj),
							error: function () {
								Adopto.contentScript.callback(candidateDataModel);
							}
						})
					}
				},
				error: function () {
					Adopto.contentScript.callback(candidateDataModel);
				}
			});
		},

		onGetDetailsData: function (data) {
			var proj = this;
			if (data[0].shots.length > 0) {
				var minDate = Adopto.contentScript.stringToDate(data[0].shots[0].published_at);
				var maxDate = Adopto.contentScript.stringToDate(data[0].shots[0].published_at);

				for (var i = 0; i < data[0].shots.length; i++) {
					var date = Adopto.contentScript.stringToDate(data[0].shots[i].published_at);
					if (date < minDate) {
						minDate = date;
					}
					if (date > maxDate) {
						maxDate = date;
					}
				}

				proj.startDate = minDate;
				proj.endDate = maxDate;

				candidateDataModel.mainData.projects.push(proj);
			}

			if (proj.isLast) {
				Adopto.contentScript.getProjectsNextPage(proj.atPage + 1);
			}
		},

		stringToDate: function (string) {
			var els = string.split(' ');
			var month;
			var day;
			var year;

			switch (els[0]) {
				case 'January':
					month = 0;
					break;
				case 'February':
					month = 1;
					break;
				case 'March':
					month = 2;
					break;
				case 'April':
					month = 3;
					break;
				case 'May':
					month = 4;
					break;
				case 'June':
					month = 5;
					break;
				case 'July':
					month = 6;
					break;
				case 'August':
					month = 7;
					break;
				case 'September':
					month = 8;
					break;
				case 'October':
					month = 9;
					break;
				case 'November':
					month = 10;
					break;
				case 'December':
					month = 11;
					break;
				default:
					return moment();
			}

			day = els[1].trim().replace(',', '');
			year = els[2].trim();

			return moment().year(year).month(month).date(day);
		}
	};

})(jQuery, Adopto.hostTest);