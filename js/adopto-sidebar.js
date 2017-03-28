(function ($, sidebar, rootUrl) {

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
			sidebar.getCandidateData();
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

			$('.adopto-open-profile-msg').addClass('adopto-hidden');

			var profileUrl = cs.getProfilePageUrl();
			var name = cs.getName().substring(0, 100);
			var email = cs.getEmail().substring(0, 100);
			var jobpos = cs.getJobTitle().substring(0, 100);
			var addr = cs.getLocation().substring(0, 100);
			var img = cs.getProfileImageURL();

			$('#adopto-source-name').val(cs.name);
			$('#adopto-source-type').val(cs.sourceType);
			$('#adopto-profile-url').val(cs.getProfilePageUrl());

			if (name) {
				$('#adopto-name').val(name).parent().addClass('label-top');
			}
			if (email) {
				$('#adopto-email').val(email).parent().addClass('label-top');
			}
			if (jobpos) {
				$('#adopto-job-position').val(jobpos).parent().addClass('label-top');
			}
			if (addr) {
				$('#adopto-address').val(addr).parent().addClass('label-top');
			}
			if (img) {
				$('.adopto-profile-picture').css('background-image', 'url(' + img + ')');
				$('#adopto-profile-image').val(img);
			} else {
				$('.adopto-profile-picture').css('background-image', chrome.extension.getURL('images/no-profile-pic.png'));
				$('#adopto-profile-image').val('');
			}
		} else {
			$('.adopto-open-profile-msg').removeClass('adopto-hidden');
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

							$('.adopto-group .item.withDetails').click(function () {
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
