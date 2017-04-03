(function ($, sidebar, rootUrl) {

	sidebar.candidateData = {
		mainData: {
			fullName: 'Danijel Rudman',
			title: 'Software developer',
			profileImgUrl: '',
			location: 'Zagreb',
			contactInfo: {
				email: 'rudman0@gmail.com',
				phone: '098/745-8597'
			},
			socialNetworks: {
				linkedin: 'https://www.linkedin.com/in/danijel-rudman-7b771276/',
				//linkedin: '',
				facebook: 'https://www.facebook.com/danijel.rudman',
				//facebook: '',
				github: 'https://github.com/0Rudy0',
				//github: '',
				//skype: 'blabla',
				skype: '',
				//stackoverflow: 'bleble',
				stackoverflow: '',
				//angellist: 'blublu',
				angellist: '',
				xing: '',
				twitter: '',
				googlePlus: ''
			},
			summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque libero sem, tempor ut arcu quis, rhoncus molestie neque. Maecenas id',
			education: [
				{ title: 'Bachelor\'s Degree, Applied Computer Engineering, Software Engineering', atPlace: 'FER', placeLink: 'https://www.fer.unizg.hr/', placeLogo: 'http://www.clker.com/cliparts/7/4/b/6/13373556381963102819fer.logo_.png', startDate: moment('2006-09-01'), endDate: moment('2011-09-01') },
				{ title: 'Bachelor\'s Degree, Applied Computer Engineering, Software Engineerin', atPlace: 'FER', placeLink: 'https://www.fer.unizg.hr/', placeLogo: 'http://www.clker.com/cliparts/7/4/b/6/13373556381963102819fer.logo_.png', startDate: moment('2012-09-01'), endDate: moment('2013-09-01') }
			],
			experience: [
				{ title: 'Software developer', atPlace: 'HrPro d.o.o.', placeLink: 'http://hrpro.hr/', placeLogo: 'https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAlsAAAAJDBkYTQ5NGU4LWNmNjEtNDY0ZS1hNzdmLTk4NDIyMWRiYzAwNw.png', startDate: moment('2006-09-01'), endDate: moment('2008-09-01'), desc: 'Vel sapien elit in malesuada semper mi, id sollicitudin.' },
				{ title: 'Software developer', atPlace: 'HrPro d.o.o.', placeLink: 'http://hrpro.hr/', placeLogo: 'https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAlsAAAAJDBkYTQ5NGU4LWNmNjEtNDY0ZS1hNzdmLTk4NDIyMWRiYzAwNw.png', startDate: moment('2008-09-01'), endDate: moment('2010-09-01'), desc: 'Sapien elit in malesuada semper mi, id sollicitudin urna fermentum.' }
			],
			projects: [
				{ title: 'Being mama\'s boy', startDate: moment('2006-09-01'), endDate: moment('2009-09-01') },
				{ title: 'Being a motherfucker', startDate: moment('2009-09-01'), endDate: moment('2016-09-01') }
			],
			languages: ['English', 'German', 'Croatian', 'Bosnian', 'Serbian'],
			skills: ['C#', 'Visual studio', 'Cooking meth', 'Science bitch', 'Java', 'ASP.NET', 'Microsoft excel']
		},
		activities: [

		],
		communication: [

		]
	};

	sidebar.visible = function () {
		if ($('body').hasClass('adopto-sidebar-show')) {
			return true;
		}
		return false;
	}

	sidebar.show = function () {
		$('.adopto-sidebar').show(); // Solves uncompatibility with 'LastPass' chrome extension
		// setTimeout -> Solves uncompatibility with 'LastPass' chrome extension
		setTimeout(() => {
			//$('.adopto-sidebar').show();
			$('body').addClass('adopto-sidebar-show');
			$('.adopto-sidebar #name').focus();
			$('.adopto-sidebar').css('right', 0);

		}, 1);
	}

	sidebar.hide = function () {
		$('body').removeClass('adopto-sidebar-show');
		$('.adopto-sidebar').css('right', '-390px');
		setTimeout(() => function () {
			//$('.adopto-sidebar').hide();
		}, 50); // Solves uncompatibility with 'LastPass' chrome extension
	}

	sidebar.toggle = function () {
		if (Adopto.contentScript) {
			if (sidebar.visible()) {
				//console.log('hiding');
				sidebar.hide();
			} else {
				//console.log('showing');
				sidebar.show();
			}
		}
	}

	sidebar.getCandidateData = function () {
		if (Adopto.contentScript.isProfilePageActive()) {
			var cs = Adopto.contentScript;

			var cdata = sidebar.candidateData;
			$('.adopto-open-profile-msg').addClass('adopto-hidden');

			//var profileUrl = cs.getProfilePageUrl();
			//cdata.mainData.fullName = cs.getName().substring(0, 100);
			//cdata.mainData.contactInfo.email = cs.getEmail().substring(0, 100);
			//cdata.mainData.title = cs.getJobTitle().substring(0, 100);
			//cdata.mainData.location = cs.getLocation().substring(0, 100);
			//cdata.mainData.profileImgUrl = cs.getProfileImageURL();

			$('.adopto-loading').show();
			cs.getData(sidebar.setFormData);

			//sidebar.setFormData();
			$('.adopto-tab-content').addClass('blur');
			setTimeout(function () {
				sidebar.getAdoptoData();
			}, 200);

		} else {
			$('.adopto-open-profile-msg').removeClass('adopto-hidden');
			$('.adopto-tab-content').hide();
			$('.adopto-empty').show();
		}
	}

	sidebar.callback = function (data) {
		console.log(data);
	}

	sidebar.setFormData = function (cdata) {
		//var cdata = sidebar.candidateData;

		$('#adopto-form .main-info').show();
		$('#adopto-form .adopto-perspective').show();
		$('#adopto-form .main-info p.name').html(cdata.mainData.fullName);
		$('#adopto-form .main-info h5.jobTitle').html(cdata.mainData.title);
		$('#adopto-form .main-info p.location span').html(cdata.mainData.location);
		if (cdata.mainData.profileImgUrl == null || cdata.mainData.profileImgUrl.trim().length == 0) {
			$('#adopto-form .main-info img.profile-picture').attr('src', chrome.extension.getURL("images/no-profile-pic.png"));
		}
		else {
			$('#adopto-form .main-info img.profile-picture').attr('src', cdata.mainData.profileImgUrl);
		}

		$('#adopto-form .main-info .curr-info-edit input.name').val(cdata.mainData.fullName);
		$('#adopto-form .main-info .curr-info-edit input.jobTitle').val(cdata.mainData.title);
		$('#adopto-form .main-info .curr-info-edit input.location').val(cdata.mainData.location);

		//contact
		$('#adopto-form .adopto-group.contact .adopto-input.email p.value').html(cdata.mainData.contactInfo.email);
		$('#adopto-form .adopto-group.contact .adopto-input.phone p.value').html(cdata.mainData.contactInfo.phone);

		//social networks
		$('#adopto-form .adopto-group.social .adopto-input.linkedin a.value').attr('href', cdata.mainData.socialNetworks.linkedin);
		$('#adopto-form .adopto-group.social .adopto-input.facebook a.value').attr('href', cdata.mainData.socialNetworks.facebook);
		$('#adopto-form .adopto-group.social .adopto-input.skype a.value').attr('href', cdata.mainData.socialNetworks.skype);
		$('#adopto-form .adopto-group.social .adopto-input.github a.value').attr('href', cdata.mainData.socialNetworks.github);
		$('#adopto-form .adopto-group.social .adopto-input.stackOverflow a.value').attr('href', cdata.mainData.socialNetworks.stackoverflow);
		$('#adopto-form .adopto-group.social .adopto-input.angelList a.value').attr('href', cdata.mainData.socialNetworks.angellist);
		$('#adopto-form .adopto-group.social .adopto-input.xing a.value').attr('href', cdata.mainData.socialNetworks.xing);
		$('#adopto-form .adopto-group.social .adopto-input.twitter a.value').attr('href', cdata.mainData.socialNetworks.twitter);
		$('#adopto-form .adopto-group.social .adopto-input.googlePlus a.value').attr('href', cdata.mainData.socialNetworks.googlePlus);

		//summary
		$('#adopto-form .adopto-group.summary p.value').html(cdata.mainData.summary);

		//education
		for (var i = 0; i < cdata.mainData.education.length; i++) {
			var e = cdata.mainData.education[i];
			e.duration = Math.round(moment.duration(e.endDate.diff(e.startDate)).asYears()) + ' years';

			$('#adopto-form .adopto-group.education').append('<div class="education-item item withDetails" id="eduItem' + i + '"><div class="education-desc desc"><span><span class="main-desc">' + e.title + '</span><br/>at<a target="_blank" href="' + e.placeLink + '" class="side-desc"> ' + e.atPlace + '</a></span><div class="arrow"></div></div></div>');
			$('#eduItem' + i).click(sidebar.openDetailsPane.bind(e));
		}

		//experience
		for (var i = 0; i < cdata.mainData.experience.length; i++) {
			var e = cdata.mainData.experience[i];
			e.duration = Math.round(moment.duration(e.endDate.diff(e.startDate)).asYears()) + ' years';
			//console.log($('#adopto-form .adopto-group.experience'));
			$('#adopto-form .adopto-group.experience').append('<div class="experience-item item withDetails" id="expItem' + i + '"><div class="experience-desc desc"><span><span class="jobTitle main-desc">' + e.title + '</span><br/>at<a target="_blank" href="' + e.placeLink + '" class="company side-desc"> ' + e.atPlace + '</a></span><div class="arrow"></div></div></div>');
			$('#expItem' + i).click(sidebar.openDetailsPane.bind(e));
		}

		//projects
		for (var i = 0; i < cdata.mainData.projects.length; i++) {
			var p = cdata.mainData.projects[i];
			p.duration = Math.round(moment.duration(p.endDate.diff(p.startDate)).asYears()) + ' years';

			$('#adopto-form .adopto-group.projects').append('<div class="project-item item withDetails" id="projItem' + i + '"><div class="project-desc desc"><span class="projectTitle main-desc">' + p.title + '</span><br/><span class="side-desc">' + p.duration + '</span><div class="arrow"></div></div></div>');
			$('#projItem' + i).click(sidebar.openDetailsPane.bind(p));
		}

		//languages
		//$('#adopto-form .adopto-group.languages').append('<ul class="langList"></ul>');
		for (var i = 0; i < cdata.mainData.languages.length; i++) {
			var l = cdata.mainData.languages[i];
			$('#adopto-form .adopto-group.languages .langsList').append('<li class="item">' + l + '</li>');
		}

		//skills
		for (var i = 0; i < cdata.mainData.skills.length; i++) {
			var s = cdata.mainData.skills[i];
			$('#adopto-form .adopto-group.skills .skillsList').append('<li class="item">' + s + '</li>')
		}

		$('#adopto-form .adopto-group a').click(function (e) {
			e.preventDefault();
			//console.log();
			e.stopPropagation();
			if ($(this).attr('href').length > 0 && $(this).attr('href') != '#') {
				window.open($(this).attr('href'), '_blank');
			}
		});

		sidebar.hideEmptyGroups();
	}

	sidebar.getAdoptoData = function () {

		$.ajax({
			url: rootUrl + '/GetCandidateData',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			async: true,
			cache: false,
			data: JSON.stringify({
				email: sidebar.candidateData.mainData.contactInfo.email
			}),
			success: function (data) {
				//console.log(data);
				sidebar.candidateData.activities = data.activities;
				sidebar.candidateData.communicatio = data.communication;
			},
			error: function () {
				//console.log('error');
				$('.adopto-loading').hide();
				$('.adopto-tab-content').removeClass('blur');
				sidebar.candidateData.activities = [
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-phone'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					},
					{
						desc: 'Danijel Rudman scheduled Phone call with candidate Michelle William',
						when: '2 weeks ago',
						icon: 'fa-file-text'
					}
				];
				sidebar.candidateData.communication = [
					{
						desc: 'Danijel Rudman added a comment to candidate Michael Williams',
						when: '2 weeks ago',
						icon: 'fa-comment-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudman added a comment to candidate Michael Williams',
						when: '2 weeks ago',
						icon: 'fa-comment-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudmansend an email to candidate Michael Williams',
						when: '3 weeks ago',
						icon: 'fa-envelope-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudman send an email to candidate Michael Williams',
						when: '4 weeks ago',
						icon: 'fa-envelope-o',
						content: 'Lorem ipsum dolor sit amet.'
					},
					{
						desc: 'Danijel Rudman added a comment to candidate Michael Williams',
						when: '2 weeks ago',
						icon: 'fa-comment-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudman added a comment to candidate Michael Williams',
						when: '2 weeks ago',
						icon: 'fa-comment-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudmansend an email to candidate Michael Williams',
						when: '3 weeks ago',
						icon: 'fa-envelope-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudman send an email to candidate Michael Williams',
						when: '4 weeks ago',
						icon: 'fa-envelope-o',
						content: 'Lorem ipsum dolor sit amet.'
					},
					{
						desc: 'Danijel Rudman added a comment to candidate Michael Williams',
						when: '2 weeks ago',
						icon: 'fa-comment-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudman added a comment to candidate Michael Williams',
						when: '2 weeks ago',
						icon: 'fa-comment-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudmansend an email to candidate Michael Williams',
						when: '3 weeks ago',
						icon: 'fa-envelope-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudman send an email to candidate Michael Williams',
						when: '4 weeks ago',
						icon: 'fa-envelope-o',
						content: 'Lorem ipsum dolor sit amet.'
					},
					{
						desc: 'Danijel Rudman added a comment to candidate Michael Williams',
						when: '2 weeks ago',
						icon: 'fa-comment-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudman added a comment to candidate Michael Williams',
						when: '2 weeks ago',
						icon: 'fa-comment-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudmansend an email to candidate Michael Williams',
						when: '3 weeks ago',
						icon: 'fa-envelope-o',
						content: 'fusce varius nisl ac ipsum gravida vel pretium tellus tincidunt integer eu augue augue nunc elit dolor, luctus placerat.'
					},
					{
						desc: 'Danijel Rudman send an email to candidate Michael Williams',
						when: '4 weeks ago',
						icon: 'fa-envelope-o',
						content: 'Lorem ipsum dolor sit amet.'
					}
				];
				sidebar.setActivitiesData();
				sidebar.setCommunicationsData();
			}
		});
	}

	sidebar.setActivitiesData = function () {
		for (var i = 0; i < sidebar.candidateData.activities.length; i++) {
			var a = sidebar.candidateData.activities[i];
			$('.adopto-tab-content .tab.tabActivities .activities-group').append('<div class="activity"><div class="icon"><i class="fa ' + a.icon + '"></i></div><div class="content"><div class="description">' + a.desc + '</div><div class="when">' + a.when + '</div></div></div>');
		}
	}

	sidebar.setCommunicationsData = function () {
		for (var i = 0; i < sidebar.candidateData.communication.length; i++) {
			var c = sidebar.candidateData.communication[i];
			$('.adopto-tab-content .tab.tabCommunication .communications').append('<div class="comm-item"><div class="icon"><i class="fa ' + c.icon + '" aria-hidden="true"></i></div><div class="desc-content"><div class="desc">' + c.desc + '</div><div class="when">' + c.when + '</div></div><br/><br/><blockquote class="content"><p>' + c.content + '</p></blockquote><div class="fix"></div></div>');
		}
	}

	sidebar.openDetailsPane = function () {
		//console.log(this);
		$('.adopto-tab-content .tab').animate({ right: $('.adopto-tab-content').outerWidth() + 10 }, 200);
		$('.adopto-tab-content .adopto-details-pane').animate({ right: '0' }, 200);
		$('.topHeader>a').animate({ opacity: 0 }, 100, function () {
			$('.topHeader>a').hide();
			$('.topHeader .backPane').show();
			$('.topHeader .backPane').animate({ opacity: 1 }, 100);
		});

		var that = this;
		$.get(chrome.extension.getURL('markup/detailsPane.html'))
			.done(function (data) {
				$('.adopto-tab-content .adopto-details-pane').append(data);
				$('.adopto-tab-content .adopto-details-pane .pane .main-info .title').html(that.title);
				$('.adopto-tab-content .adopto-details-pane .pane .main-info .atPlace').html(that.atPlace);
				$('.adopto-tab-content .adopto-details-pane .pane .main-info .logo').attr('src', that.placeLogo);
				$('.adopto-tab-content .adopto-details-pane .pane .main-info .startDate').html(that.startDate.format('MMM YYYY'));
				$('.adopto-tab-content .adopto-details-pane .pane .main-info .endDate').html(that.endDate.format('MMM YYYY'));
				$('.adopto-tab-content .adopto-details-pane .pane .main-info .duration').html(that.duration);

				$('.adopto-tab-content .adopto-details-pane .pane .desc-info .desc').html(that.desc);

				if (that.placeLogo == null || that.placeLogo.trim().length == 0) {
					$('.adopto-tab-content .adopto-details-pane .pane .main-info .logo').hide();
				}
				else {
					$('.adopto-tab-content .adopto-details-pane .pane .main-info .logo').show();

				}

				if (that.desc == null || that.desc.trim().length == 0) {
					$('.adopto-tab-content .adopto-details-pane .pane .desc-info').hide();
				}
				else {
					$('.adopto-tab-content .adopto-details-pane .pane .desc-info').show();

				}

				if (that.atPlace == null || that.atPlace.trim().length == 0) {
					$('.adopto-tab-content .adopto-details-pane .pane .main-info .atPlaceHolder').hide();
				}
				else {
					$('.adopto-tab-content .adopto-details-pane .pane .main-info .atPlaceHolder').show();

				}
			});

	}

	sidebar.hideEmptyGroups = function () {
		var groups = $('#adopto-form .adopto-group');
		for (var i = 0; i < groups.length; i++) {
			var allEmpty = true;
			var items = $(groups[i]).find('.adopto-input');
			if (items.length > 0) {
				for (var j = 0; j < items.length; j++) {
					var p = $(items[j]).find('p.value');
					if (p.length > 0) {
						if (p[0].innerText.trim().length == 0) {
							$(items[j]).hide();
						}
						else {
							allEmpty = false;
						}
					}
					else {
						var a = $(items[j]).find('a.value');
						if ($(a[0]).attr('href').trim().length > 0) {
							allEmpty = false;
						}
						else {
							$(items[j]).hide();
						}
					}

				}
			}
			else {
				var items = $(groups[i]).find('.item');
				if (items.length > 0) {
					allEmpty = false;
				}
			}

			if (allEmpty) {
				$(groups[i]).hide();
			}
		}
	}

	sidebar.getCodeData = function (onLoad) {
		Adopto.getCodeData(function () {
			var template = '<li value="{{Id}}">{{Text}}</li>';
			var $ulJobList = $('#adopto-position-list ul');
			var $ulTalentList = $('#adopto-talent-list ul');

			$ulJobList.html(template.format({ Id: -1, Text: 'None' }));
			$ulTalentList.html(template.format({ Id: -1, Text: 'None' }));

			if (Adopto.codeData.Jobs.length) {
				$('#adopto-position-list').show();

				Adopto.codeData.Jobs.forEach(
					job => $ulJobList.append(template.format(job))
				);
			} else {
				$('#adopto-position-list').hide();
			}

			if (Adopto.codeData.TalentList.length) {
				$('#adopto-talent-list').show();

				Adopto.codeData.TalentList.forEach(
					talent => $ulTalentList.append(template.format(talent))
				);
			} else {
				$('#adopto-talent-list').hide();
			}

			if (onLoad) {
				onLoad();
			}
		});
	}

	sidebar.element.appendTo('body');

	$.getJSON(chrome.extension.getURL('lang/' + Adopto.lang + ".json"))
		.done(function (lang) {

			$.get(chrome.extension.getURL('markup/sidebar.html'))
				.done(function (data) {

					//console.log($('.adopto-sidebar'));
					//$('.adopto-sidebar').scroll(function (e) {
					//	console.log('scroll');
					//	e.stopPropagation();
					//});
					//$('.adopto-sidebar').click(function (e) {
					//	console.log('click');
					//	//e.stopPropagation();
					//});
					//document.getElementsByClassName('adopto-sidebar')[0].addEventListener('scroll', function () {
					//	console.log('scroll');
					//})
					//window.scroll(function () { console.log('scroll'); });

					sidebar.element.append(data.format(lang));

					$('.tab-header').click(function () {
						//console.log($('.adopto-tab-content>.tab'));
						$('.adopto-tab-content>.tab').hide();
						$('.nav-tabs .tab-header').removeClass('active');
						$(this).addClass('active');
						$('.adopto-tab-content .' + $(this).attr('data-tab')).show();
						//console.log($(this).attr('data-tab'));
					});

					$($('.nav-tabs .tab-header')[0]).addClass('active');
					$($('.adopto-tab-content .tab')[0]).show();

					$.get(chrome.extension.getURL('markup/form.html'))
						.done(function (data) {							

							//preventing scroll propagation
							$('#tabContent').bind('mousewheel', function (e) {
								if ($('.tab-header[data-tab="tabForm"').hasClass('active')) {
									if ((e.originalEvent.deltaY > 0 && $(this).scrollTop() === $('#adopto-form').outerHeight() - $(this).outerHeight() + 30) ||
										(e.originalEvent.deltaY < 0 && $(this).scrollTop() === 0)){
										e.preventDefault();
									}
								}
								else if ($('.tab-header[data-tab="tabActivities"').hasClass('active')) {
									//console.log('scrolling activities');
									if ((e.originalEvent.deltaY > 0 && $(this).scrollTop() === $('.tabActivities.tab .activities-group').outerHeight() - $(this).outerHeight() + 20) ||
										(e.originalEvent.deltaY < 0 && $(this).scrollTop() === 0)) {
										e.preventDefault();
									}
								}
								else if ($('.tab-header[data-tab="tabCommunication"').hasClass('active')) {
									//console.log('scrolling communication');
									if ((e.originalEvent.deltaY > 0 && $(this).scrollTop() === $('.tabCommunication.tab .communications').outerHeight() - $(this).outerHeight() + 10) ||
										(e.originalEvent.deltaY < 0 && $(this).scrollTop() === 0)) {
										e.preventDefault();
									}
								}
							});

							$('.nav-tabs.main').bind('mousewheel', function (e) {
								e.preventDefault();
							});

							$('.topHeader').bind('mousewheel', function (e) {
								e.preventDefault();
							});

							$('.adopto-tab-content .tab.tabForm').append(data.format(lang));

							$('.main-info .edit-icon').click(function () {
								$('.main-info .curr-info').hide();
								$('.main-info .curr-info-edit').show();
							});

							$('.main-info .done-icon').click(function () {
								//console.log('click');
								$('.main-info .curr-info').show();
								$('.main-info .curr-info-edit').hide();
								sidebar.candidateData.mainData.fullName = $('#adopto-form .main-info .curr-info-edit input.name').val();
								sidebar.candidateData.mainData.title = $('#adopto-form .main-info .curr-info-edit input.jobTitle').val();
								sidebar.candidateData.mainData.location = $('#adopto-form .main-info .curr-info-edit input.location').val();

								$('#adopto-form .main-info p.name').html(sidebar.candidateData.mainData.fullName);
								$('#adopto-form .main-info h5.jobTitle').html(sidebar.candidateData.mainData.title);
								$('#adopto-form .main-info p.location span').html(sidebar.candidateData.mainData.location);
							});

							$('#adopto-form .curr-info-edit').on('keypress', 'input', function (e) {
								if (e.which == 13) {
									$('.main-info .done-icon').click();
									return false;
								}
							});


							$('.topHeader .backPane').click(function () {
								$('.adopto-tab-content .tab').animate({ right: '0' }, 200);
								$('.adopto-tab-content .adopto-details-pane').animate({ right: '-100%' }, 200);
								$('.topHeader .backPane').animate({ opacity: 0 }, 100, function () {
									$('.topHeader .backPane').hide();
									$('.topHeader>a').show();
									$('.topHeader>a').animate({ opacity: 1 }, 100);
									$('.adopto-tab-content .adopto-details-pane .pane').remove();
								});
							});

							sidebar.getCandidateData();
						});



					$.get(chrome.extension.getURL('markup/activities.html'))
						.done(function (data) {
							$('.adopto-tab-content .tab.tabActivities').append(data.format(lang));
							sidebar.setActivitiesData();
						});

					$.get(chrome.extension.getURL('markup/communication.html'))
						.done(function (data) {
							$('.adopto-tab-content .tab.tabCommunication').append(data.format(lang));
							$('#notesSummernote').summernote({
								height: 195,
								toolbar: false,
								//placeholder: 'Type \'@\' for mention, or \'#\' for tags',
								disableDragAndDrop: true
							});
							$('#emailSummernote').summernote({
								height: 122,
								toolbar: [
								  ['style', ['bold', 'italic', 'underline', 'clear']],
								],
								resize: false
							});
							$('.note-statusbar').hide();

							$('.adopto-tab-content .tab.tabCommunication #noteTab .sendBtnHolder button').click(function () {
								//save note
							});
							$('.adopto-tab-content .tab.tabCommunication #emailTab .sendBtnHolder button').click(function () {
								//send email
							});

							sidebar.setCommunicationsData();
						});

					$.get(chrome.extension.getURL('markup/loader.html'))
						.done(function (data) {
							$('.adopto-loader-wrapper').append(data.format(lang));
						});

					$.get(chrome.extension.getURL('markup/open-profile-msg.html'))
						.done(function (data) {
							$('.adopto-open-profile-msg').append(data.format(lang));
						})

					$.get(chrome.extension.getURL('markup/login-msg.html'))
						.done(function (data) {
							$('.adopto-login-msg').append(data.format(lang));
						});

					$.get(chrome.extension.getURL('markup/sourced-msg.html'))
						.done(function (data) {
							$('.adopto-sourced-msg').append(data.format(lang));
						});

					sidebar.getCodeData();

				});

		});

	$('.adopto-sidebar').on('click', '.adopto-close', function () {
		sidebar.hide();
	});

	$('.adopto-sidebar').on('focus', '.adopto-input input, .adopto-input textarea', function () {
		$(this).parent().addClass('label-top');
	});

	$('.adopto-sidebar').on('blur', '.adopto-input input, .adopto-input textarea', function () {
		//console.log('blur');
		if (!this.value) {
			$(this).parent().removeClass('label-top');
		}
		if (this.validity.valid) {
			$(this).parent().removeClass('invalid');
			$(this).parent().removeClass('label-top');
		} else {
			$(this).parent().addClass('invalid');
		}
	});

	$(document).click(function (e) {
		if (!$(e.target).is('.adopto-select *')) {
			$('.adopto-select').removeClass('adopto-active');
		}
	});

	$('.adopto-sidebar').on('click', '.adopto-select', function () {
		$(this).toggleClass('adopto-active');
	});

	$('.adopto-sidebar').on('click', '.adopto-select li', function () {
		var $select = $(this).parent().parent();

		$select.find('span').text($(this).text());
		$select.find('input').val($(this).val());

		$select.addClass('label-top');
	});

	$('.adopto-sidebar').on('click', '.adopto-refresh', function () {
		sidebar.getCandidateData();
	});

	$('.adopto-sidebar').on('click', '.adopto-sourced-close', function () {
		$('.adopto-sourced-msg').addClass('adopto-hidden');
		sidebar.hide();
	});

	$('.adopto-sidebar').on('submit', '#adopto-form', function (e) {
		if (Adopto.codeData.IsAuthenticated) {
			var formData = $('#adopto-form').serialize();

			$('.adopto-loader-wrapper').removeClass('adopto-hidden');

			$.post(rootUrl + 'Browser/Save', formData)
				.done(function (data) {
					if (data == true) {
						$('.adopto-sourced-msg').removeClass('adopto-hidden');
						$('#adopto-form')[0].reset();
					} else {
						alert('Fail');
					}

					$('.adopto-loader-wrapper').addClass('adopto-hidden');
				});
		} else {
			$('.adopto-login-msg').removeClass('adopto-hidden');
		}

		e.preventDefault();
		return false;
	});

	$(window).focus(function () {
		if (!$('.adopto-login-msg').hasClass('adopto-hidden')) {
			$('.adopto-login-msg').addClass('adopto-hidden');
			$('.adopto-loader-wrapper').removeClass('adopto-hidden');

			sidebar.getCodeData(function () {
				$('.adopto-loader-wrapper').addClass('adopto-hidden');
			});
		}
	});

}(jQuery, Adopto.sidebar, Adopto.rootUrl));
