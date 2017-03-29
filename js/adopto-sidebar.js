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
				facebook: 'https://www.facebook.com/danijel.rudman',
				github: 'https://github.com/0Rudy0',
				skype: ''
			},
			summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque libero sem, tempor ut arcu quis, rhoncus molestie neque. Maecenas id',
			education: [
				{ desc: 'Bachelor\'s Degree, Applied Computer Engineering, Software Engineering', atPlace: 'FER', placeLink: '#', startDate: new Date(2006, 9, 1, 0), endDate: new Date(2012, 3, 1, 0) },
				{ desc: 'Bachelor\'s Degree, Applied Computer Engineering, Software Engineerin', atPlace: 'FER', placeLink: '#', startDate: new Date(2006, 9, 1, 0), endDate: new Date(2012, 3, 1, 0) }
			],
			experience: [
				{ jobTitle: 'Software developer', atPlace: 'HrPro d.o.o.', placeLink: '#', placeLogo: '', startDate: '', endDate: '' },
				{ jobTitle: 'Software developer', atPlace: 'HrPro d.o.o.', placeLink: '#', placeLogo: '', startDate: '', endDate: '' }
			],
			projects: [
				{ title: 'Being mama\'s boy', startDate: '', endDate: '' },
				{ title: 'Being a motherfucker', startDate: '', endDate: '' }
			],
			languages: ['English', 'German', 'Croatian', 'Bosnian', 'Serbian'],
			skills: ['C#', 'Visual studio', 'Cooking meth', 'Science bitch', 'Java', 'ASP.NET', 'Microsoft excel']
		},
		activities: [],
		communication: []
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
				console.log('hiding');
				sidebar.hide();
			} else {
				console.log('showing');
				sidebar.show();
			}
		}
	}

	sidebar.getCandidateData = function () {
		if (Adopto.contentScript.isProfilePageActive()) {
			var cs = Adopto.contentScript;
			var cdata = sidebar.candidateData;

			$('.adopto-open-profile-msg').addClass('adopto-hidden');

			var profileUrl = cs.getProfilePageUrl();
			cdata.mainData.fullName = cs.getName().substring(0, 100);
			//cdata.mainData.contactInfo.email = cs.getEmail().substring(0, 100);
			//cdata.mainData.title = cs.getJobTitle().substring(0, 100);
			//cdata.mainData.location = cs.getLocation().substring(0, 100);
			cdata.mainData.profileImgUrl = cs.getProfileImageURL();

			$('#adopto-form .main-info p.name').html(cdata.mainData.fullName);
			$('#adopto-form .main-info h5.jobTitle').html(cdata.mainData.title);
			$('#adopto-form .main-info p.location span').html(cdata.mainData.location);

			$('#adopto-form .main-info .curr-info-edit input.name').html(cdata.mainData.fullName);
			$('#adopto-form .main-info .curr-info-edit input.jobTitle').html(cdata.mainData.title);
			$('#adopto-form .main-info .curr-info-edit input.location').html(cdata.mainData.location);

			//contact
			$('#adopto-form .adopto-group.contact .adopto-input.email p.value').html(cdata.mainData.contactInfo.email);
			$('#adopto-form .adopto-group.contact .adopto-input.phone p.value').html(cdata.mainData.contactInfo.phone);

			//social networks
			//$('#adopto-form .adopto-group.social .adopto-input.linkedin a.value').html(cdata.mainData.socialNetworks.linkedin);
			$('#adopto-form .adopto-group.social .adopto-input.linkedin a.value').attr('src', cdata.mainData.socialNetworks.linkedin);
			//$('#adopto-form .adopto-group.social .adopto-input.facebook a.value').html(cdata.mainData.socialNetworks.facebook);
			$('#adopto-form .adopto-group.social .adopto-input.facebook a.value').attr('src', cdata.mainData.socialNetworks.facebook);
			//$('#adopto-form .adopto-group.social .adopto-input.skype a.value').html(cdata.mainData.socialNetworks.skype);
			$('#adopto-form .adopto-group.social .adopto-input.skype a.value').attr('src', cdata.mainData.socialNetworks.skype);

			//summary
			$('#adopto-form .adopto-group.summary p.value').html(cdata.summary);

			//education
			for (var i = 0; i < cdata.mainData.education.length; i++) {
				var e = cdata.mainData.education[i];

				$('#adopto-form .adopto-group.education').append('<div class="education-item item withDetails" id="eduItem' + i + '"><div class="education-desc desc"><span><span class="main-desc">' + e.desc + '</span><br/>at<a href="' + e.placeLink + '" class="side-desc"> ' + e.atPlace + '</a></span><div class="arrow"></div></div></div>');
				$('#eduItem' + i).click(sidebar.openDetailsPane.bind(e));
			}

			//experience
			for (var i = 0; i < cdata.mainData.experience.length; i++) {
				var e = cdata.mainData.experience[i];

				$('#adopto-form .adopto-group.experience').append('<div class="experience-item item withDetails" id="expItem' + i + '"><div class="experience-desc desc"><span><span class="jobTitle main-desc">' + e.jobTitle + '</span><br/>at<a href="' + e.placeLink + '" class="company side-desc"> ' + e.atPlace + '</a></span><div class="arrow"></div></div></div>');
				$('#expItem' + i).click(sidebar.openDetailsPane.bind(e));
			}

			//projects
			for (var i = 0; i < cdata.mainData.projects.length; i++) {
				var p = cdata.mainData.projects[i];
				p.duration = '2 years';

				$('#adopto-form .adopto-group.projects').append('<div class="project-item item withDetails" id="projItem' + i + '"><div class="project-desc desc"><span class="projectTitle main-desc">' + p.title + '</span><br/><span class="side-desc">' + p.duration + '</span><div class="arrow"></div></div></div>');
				$('#projItem' + i).click(sidebar.openDetailsPane.bind(p));
			}

			//languages
			for (var i = 0; i < cdata.mainData.languages.length; i++) {

			}

			//skills
			for (var i = 0; i < cdata.mainData.skills.length; i++) {

			}

			sidebar.hideEmptyGroups();

		} else {
			$('.adopto-open-profile-msg').removeClass('adopto-hidden');
		}
	}

	sidebar.openDetailsPane = function () {
		console.log(this);
		$.get(chrome.extension.getURL('markup/detailsPane.html'))
						.done(function (data) {
							$('.adopto-tab-content .adopto-details-pane').append(data);
						});

		$('.adopto-tab-content .tab').animate({ right: $('.adopto-tab-content').outerWidth() + 10 }, 200);
		$('.adopto-tab-content .adopto-details-pane').animate({ right: '0' }, 200);
		$('.topHeader>a').animate({ opacity: 0 }, 100, function () {
			$('.topHeader>a').hide();
			$('.topHeader .backPane').show();
			$('.topHeader .backPane').animate({ opacity: 1 }, 100);
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
						if (a[0].innerText.trim().length > 0) {
							allEmpty = false;
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

					$('.adopto-sidebar .adopto-tab-content').scroll(function (e) {
						console.log('scroll');
						e.stopPropagation();
					})

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

							$('.adopto-tab-content .tab.tabForm').append(data.format(lang));

							$('.main-info .edit-icon').click(function () {
								$('.main-info .curr-info').hide();
								$('.main-info .curr-info-edit').show();
							});

							$('.main-info .done-icon').click(function () {
								console.log('click');
								$('.main-info .curr-info').show();
								$('.main-info .curr-info-edit').hide();
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
						});

					$.get(chrome.extension.getURL('markup/communication.html'))
						.done(function (data) {
							$('.adopto-tab-content .tab.tabCommunication').append(data.format(lang));

							//$('ul.nav.nav-tabs a').tab('show');

							$('#notesSummernote').summernote({
								height: 165,
								toolbar: false,
								//placeholder: 'Type \'@\' for mention, or \'#\' for tags',
								disableDragAndDrop: true
							});
							$('#emailSummernote').summernote({
								height: 92,
								toolbar: [
								  ['style', ['bold', 'italic', 'underline', 'clear']],
								],
								//disableResizeEditor: true,
								//disableResize: true,
								resize: false
							});
							$('.note-statusbar').hide();
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
		if (!this.value) {
			$(this).parent().removeClass('label-top');
		}
		if (this.validity.valid) {
			$(this).parent().removeClass('invalid');
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
