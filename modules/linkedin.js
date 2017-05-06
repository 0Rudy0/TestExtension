(function ($, host) {

	if (!host('linkedin.com', 'www.linkedin.com')) return;

	Adopto.contentScript = {
		name: 'LinkedIn',
		sourceType: 6,
		callback: null,
		aseFrameContents: null,

		isProfilePageActive: function () {
			if ($(".pv-top-card-section__body .pv-top-card-section__name").length) {
				return true;
			}

			return false;
		},

		siteLanguage: "en",

		monthAsNumber:
			[
				["en", "Present", ["Jan", 0], ["Feb", 1], ["Mar", 2], ["Apr", 3], ["May", 4], ["Jun", 5], ["Jul", 6], ["Aug", 7], ["Sep", 8], ["Oct", 9], ["Nov", 10], ["Dec", 11]],
				["de", "Heute", ["Jan.", 0], ["Feb.", 1], ["März", 2], ["Apr.", 3], ["Mai", 4], ["Juni", 5], ["Juli", 6], ["Aug.", 7], ["Sep.", 8], ["Okt.", 9], ["Nov.", 10], ["Dez.", 11]]
			],

		parseDateRange: function (dateRange) {
			dateRange = dateRange.split("–");
			if (dateRange.length == 2) {
				for (var i = 0; i < dateRange.length; i++) {
					for (var j = 0; j < Adopto.contentScript.monthAsNumber.length; j++) {
						if (Adopto.contentScript.siteLanguage === Adopto.contentScript.monthAsNumber[j][0]) {
							var dateString = dateRange[i].trim();

							if (dateString === Adopto.contentScript.monthAsNumber[j][1]) {
								dateRange[i] = new Date();
							} else if (/^\d+$/.test(dateString)) {
								dateRange[i] = new Date(parseInt(dateString), 5);
							} else {

								var dateArray = dateString.split(" ");

								if (dateArray.length == 2) {
									var year = /^\d+$/.test(dateArray[0]) ? parseInt(dateArray[0]) : parseInt(dateArray[1]);
									var month = /^\d+$/.test(dateArray[0]) ? dateArray[1].trim() : dateArray[0].trim();

									for (var k = 2; k < Adopto.contentScript.monthAsNumber[j].length; k++) {
										if (month == Adopto.contentScript.monthAsNumber[j][k][0]) {
											month = Adopto.contentScript.monthAsNumber[j][k][1];
											break;
										}
									}

									dateRange[i] = new Date(year, month);
								}
							}
						}
					}
				}
				return dateRange;
			}
		},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;

			var oldIframe = $("#aseFrame").remove();
			var iframe = document.createElement("iframe");
			iframe.onload = function () {

				switch ($("#nav-settings__dropdown-trigger").text().trim()) {
					case "Me":
						Adopto.contentScript.siteLanguage = "en";
						break;
					case "Sie":
						Adopto.contentScript.siteLanguage = "de";
						break;
				}

				aseFrameContents = $("#aseFrame").contents();

				$(".pv-contact-info button", aseFrameContents).click();

				var stap = 100;
				var $body = $("body", aseFrameContents);

				var scrollInterval = setInterval(function () {
					if (($body.scrollTop() + stap) < ($body.height() - $(window).height())) {
						$body.scrollTop($body.scrollTop() + stap);
					} else {
						clearInterval(scrollInterval);
						Adopto.contentScript.expandDataOnPage();
					}
				}, 10);
			};

			iframe.id = "aseFrame";
			iframe.src = window.location.href;
			iframe.style.position = "absolute";
			iframe.style.display = "none";
			iframe.style.top = "0";
			iframe.style.width = "100%";
			iframe.style.height = "100%";
			document.body.appendChild(iframe);
		},

		expandDataOnPage: function () {
			var cd = candidateDataModel;

			cd.mainData.fullName = $(".pv-top-card-section__name", aseFrameContents).text();
			cd.mainData.title = $(".pv-top-card-section__headline", aseFrameContents).text();
			cd.mainData.summary = $(".truncate-multiline--truncation-target", aseFrameContents).text().trim();

			cd.mainData.profileImgUrl = $(".pv-top-card-section__header img").attr("src");

			var $experienceExpend = $(".experience-section .pv-profile-section__actions-inline button", aseFrameContents);
			if ($experienceExpend.attr("aria-expanded") === "false")
				$experienceExpend.click();

			var $educationExpand = $(".education-section .pv-profile-section__actions-inline button", aseFrameContents);
			if ($educationExpand.attr("aria-expanded") === "false")
				$educationExpand.click();

			var $skillsExpand = $(".pv-featured-skills-section .pv-skills-section__additional-skills", aseFrameContents);
			if ($skillsExpand.attr("aria-expanded") === "false")
				$skillsExpand.click();

			var $contacts = $(".pv-contact-info button", aseFrameContents);
			if ($contacts.attr("data-control-name") === "contact_see_more") {
				$contacts.click();
			}
            
            var $projectsExpand = $(".pv-profile-section.pv-accomplishments-block.projects .pv-accomplishments-block__expand", aseFrameContents);
            $projectsExpand.click();

			var $languagesExpand = $(".pv-profile-section.pv-accomplishments-block.languages button", aseFrameContents);
			if ($languagesExpand.attr("aria-expanded") === "false") {
				$languagesExpand.click();
			}

			setTimeout(function () {
				$(".experience-section .pv-profile-section__section-info button", aseFrameContents).each(function () {
					if ($(this).attr("aria-expanded") === "false")
						$(this).click();
				});

				$(".education-section .pv-profile-section__section-info button", aseFrameContents).each(function () {
					if ($(this).attr("aria-expanded") === "false")
						$(this).click();
				});

				// Contacts
				$(".pv-contact-info__contact-type", aseFrameContents).each(function () {
					switch (this.classList[1]) {
						case "ci-vanity-url":
							var link = $(".pv-contact-info__contact-item", this).text().trim();
							cd.mainData.socialNetworks.linkedin = "https://www." + link;
							break;
						case "ci-websites":
							var webSites = "";
							$(".pv-contact-info__ci-container", this).each(function () {
								webSites = webSites + " " + $(".pv-contact-info__action", this)[0].href;
							});
							cd.mainData.contactInfo.website = webSites.trim();
							break;
						case "ci-email":
							var email = $(".pv-contact-info__contact-item", this).text().trim();
							cd.mainData.contactInfo.email = email;
							break;
						case "ci-phone":
							var text = $(".pv-contact-info__contact-item", this).text().trim();
							var value = text.substring(0, text.lastIndexOf("(")).trim();
							cd.mainData.contactInfo.phone = value;
							break;
						case "ci-address":
							var address = $(".pv-contact-info__action", this)[0];
							cd.mainData.location = address.innerText.trim();
							break;
						case "ci-twitter":
							var twitter = $(".pv-contact-info__action", this)[0];
                            cd.mainData.socialNetworks.twitter = "https://twitter.com/" + twitter.text.trim();
							break;
						case "ci-ims":
							$(".pv-contact-info__ci-container", this).each(function () {
								var text = $(this).text().trim();
								var value = text.substring(0, text.lastIndexOf("(")).trim();
								var type = text.substring(text.lastIndexOf("(") + 1, text.lastIndexOf(")"));

								switch (type) {
									case "Skype":
										cd.mainData.socialNetworks.skype = value;
										break;
									default:

										break;
								}
							});
							break;
					}
				});

				// Experience
				$(".pv-profile-section.experience-section .pv-profile-section__card-item", aseFrameContents).each(function () {
					var positionName = $(".pv-entity__summary-info h3", this).text().trim();
					var companyName = $(".pv-position-entity__secondary-title", this).text().trim();
					var companyLogo = $(".pv-entity__logo img", this).attr("src");
					var companyLink = $("[data-control-name='background_details_company']", this).attr("href");
					var description = $(".pv-entity__description", this).text().trim();
					var dateRange = Adopto.contentScript.parseDateRange($($(".pv-entity__date-range", this).children()[1]).text());
					dateRange = dateRange ? dateRange : ["", ""];
					cd.mainData.experience.push({
						title: positionName,
						atPlace: companyName,
						placeLink: companyLink ? location.origin + companyLink : "#",
						placeLogo: companyLogo,
						startDate: moment(dateRange[0]),
						endDate: moment(dateRange[1]),
						description: description
					});
				});

				// Education
				$(".pv-profile-section.education-section .pv-profile-section__card-item", aseFrameContents).each(function () {
					var title = "";
					$(".pv-entity__comma-item", this).each(function () {
						title = title == "" ? $(this).text() : title + ", " + $(this).text();
					});
					var place = $(".pv-entity__school-name", this).text().trim();
					var dateRange = Adopto.contentScript.parseDateRange($($(".pv-education-entity__date", this).children()[1]).text().trim());
					dateRange = dateRange ? dateRange : ["", ""];
					cd.mainData.education.push({
						title: title,
						atPlace: place,
						placeLink: '#',
						placeLogo: '',
						startDate: moment(dateRange[0]),
						endDate: moment(dateRange[1])
					});
				});

				// Skills
				$(".pv-skill-entity__skill-name", aseFrameContents).each(function () {
					cd.mainData.skills.push($(this).text());
				});

				// Projects
				$(".pv-profile-section.pv-accomplishments-block.projects .pv-accomplishment-entity", aseFrameContents).each(function () {
					$(".pv-accomplishment-entity__title span", this).remove();
					var title = $(".pv-accomplishment-entity__title", this).text().trim();
					var dateRangeString = $(".pv-accomplishment-entity__date", this).text().trim();
					var dateRange = dateRangeString ? Adopto.contentScript.parseDateRange(dateRangeString) : ["", ""];
					$(".pv-accomplishment-entity__description div", this).remove();
					var description = $(".pv-accomplishment-entity__description", this).text().trim();

					if (title) {
						cd.mainData.projects.push({
                            projectTitle: title,
							startDate: moment(dateRange[0]),
							endDate: moment(dateRange[1]),
							desc: description
						})
					}
				});

				//Languages
				$(".pv-profile-section.pv-accomplishments-block.languages .pv-accomplishment-entity", aseFrameContents).each(function () {
					$(".pv-accomplishment-entity__title span", this).remove();
					var language = $(".pv-accomplishment-entity__title", this).text().trim();

					if (language) {
						cd.mainData.languages.push(language);
					}
				});

				Adopto.contentScript.returnData();
			}, 1000);
		},

		returnData: function () {
			Adopto.contentScript.callback(candidateDataModel);
		}
	};

})(jQuery, Adopto.hostTest);