(function ($, host) {

	if (!host('linkedin.com', 'www.linkedin.com')) return;

	Adopto.contentScript = {
		name: 'LinkedIn',
		sourceType: 6,
		callback: null,
		aseFrameContents: null,

		isProfilePageActive: function () {
			if ($('.full-name').length) {
				return true;
			}

			//return false;
			return true;
		},

		getData: function (callback) {
			Adopto.contentScript.callback = callback;

			//cd.mainData.fullName = $('.user-card-name').contents()[0].nodeValue.trim();
			//cd.mainData.socialNetworks.stackoverflow = window.location.href;
			//cd.mainData.location = $('.icon-location').parent().text().trim();
			//cd.mainData.profileImgUrl = $('#avatar-card img').attr('src');
			//cd.mainData.title = $('.current-position').html().trim();
			//cd.mainData.summary = $('.bio p').html();

			//cd.mainData.socialNetworks.github = $('.icon-github').parent().find('a').attr('href');
			//cd.mainData.socialNetworks.twitter = $('.icon-twitter').parent().find('a').attr('href');

			var oldIframe = $("#aseFrame").remove();
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

			var $projectsExpand = $(".pv-profile-section.pv-accomplishments-block.projects button", aseFrameContents);
			if ($projectsExpand.attr("aria-expanded") === "false") {
				$projectsExpand.click();
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

				//Collect contacts
				$(".pv-contact-info__contact-type", aseFrameContents).each(function () {
					switch (this.classList[1]) {
						case "ci-vanity-url":
							var link = $(".pv-contact-info__contact-item", this).text().trim();
							cd.mainData.socialNetworks.linkedin = link;
							break;
						case "ci-websites":
							$(".pv-contact-info__ci-container", this).each(function () {
								//profileInfo.contacts.push(new Contact("website", $(this).text().replace("\n", "").trim(), $(".pv-contact-info__action", this)[0].href));
							});
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
							//profileInfo.contacts.push(new Contact("address", address.innerText.trim(), address.href));
							break;
						case "ci-twitter":
							var twitter = $(".pv-contact-info__action", this)[0];
							//profileInfo.contacts.push(new Contact("twitter", twitter.innerText.trim(), twitter.href));
							cd.mainData.socialNetworks.twitter = twitter;
							break;
						case "ci-ims":
							$(".pv-contact-info__ci-container", this).each(function () {
								var text = $(this).text().trim();
								var value = text.substring(0, text.lastIndexOf("(")).trim();
								//var type = text.substring(text.lastIndexOf("(") + 1, text.lastIndexOf(")")).toLower();
								//profileInfo.contacts.push(new Contact("im", text, value));
							});
							break;
					}
				});

				//Collect experience
				$(".pv-profile-section.experience-section .pv-profile-section__card-item", aseFrameContents).each(function () {
					var positionName = $(".pv-entity__summary-info h3", this).text().trim();
					var companyName = $(".pv-position-entity__secondary-title", this).text().trim();
					var dateRange = $($(".pv-entity__date-range", this).children()[1]).text();
					var description = $(".pv-entity__description", this).text().trim();
					//profileInfo.experience.push(new Experience(positionName, companyName, dateRange, description));
					cd.mainData.experience.push({
						title: positionName,
						atPlace: companyName,
						placeLink: '#',
						placeLogo: '',
						startDate: moment('2006-09-01'),
						endDate: moment('2006-09-01'),
						description: description
					});
				});

				//Collect education
				$(".pv-profile-section.education-section .pv-profile-section__card-item", aseFrameContents).each(function () {
					var title = $(".pv-entity__school-name", this).text().trim();
					//var secondaryTitle = $(".pv-education-entity__secondary-title", this).text().trim();
					var dateRange = $($(".pv-education-entity__date", this).children()[1]).text().trim();
					//profileInfo.education.push(new Education(title, dateRange));
					cd.mainData.education.push({
						title: title,
						atPlace: '',
						placeLink: '#',
						placeLogo: '',
						startDate: moment('2006-09-01'),
						endDate: moment('2006-09-01')
					});
				});

				//Collect skills
				$(".pv-skill-entity__skill-name", aseFrameContents).each(function () {
					//profileInfo.skills.push($(this).text());
					cd.mainData.skills.push($(this).text());
				});

				//Collect projects
				$(".pv-profile-section.pv-accomplishments-block.projects", aseFrameContents).each(function () {
					$(".pv-accomplishment-entity__title span", this).remove();
					var title = $(".pv-accomplishment-entity__title", this).text().trim();
					var dateRange = $(".pv-accomplishment-entity__date", this).text().trim();
					$(".pv-accomplishment-entity__description div", this).remove();
					var description = $(".pv-accomplishment-entity__description", this).text().trim();

					if(title) {
						//profileInfo.projects.push(new Project(title, dateRange, description));
						cd.mainData.projects.push({
							title: title,
							startDate: moment('2006-09-01'),
							endDate: moment('2006-09-01'),
							description: description
						})
					}
				});

				Adopto.contentScript.returnData();
			}, 200);
		},

		returnData: function () {
			Adopto.contentScript.callback(candidateDataModel);
		}		
};

})(jQuery, Adopto.hostTest);