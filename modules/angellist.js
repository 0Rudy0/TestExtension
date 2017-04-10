(function ($, host) {

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
			m.mainData.fullName = $('[itemprop=name]').text().trim();
			m.mainData.title = $('.fontello-tag-1 + a').text();
			//m.mainData.contactInfo.email = $('li[itemprop="email"] a').html() ? $('li[itemprop="email"] a').html().trim() : '';
			m.mainData.location = $('.fontello-location + a').text();

			m.mainData.profileImgUrl = $('.js-avatar-img').attr('src');
			//m.mainData.socialNetworks.website = $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html() ? $('.vcard-details li.vcard-detail[aria-label="Blog or website"] a').html().trim() : '';
			//m.mainData.summary = $('.user-profile-bio').length > 0 ? $('.user-profile-bio')[0].innerText : '';


			//var username = $('span.vcard-username').html();
			m.mainData.socialNetworks.angellist = window.location.href
			//Adopto.contentScript.getSkills(username, m);
			//m.mainData.skills = Adopto.contentScript.getSkills(m);

			Adopto.contentScript.callback(cd);
			//callback(m);
		}
	};

})(jQuery, Adopto.hostTest);