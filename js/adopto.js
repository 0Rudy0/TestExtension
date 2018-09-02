var Adopto = {
	sidebar: {
		element: $('<div class="adopto-sidebar"></div>')
	},
	//rootUrl: 'http://adopto-local-eu/',
    rootUrl: 'https://adopto.eu/',
    mgr: null,

	hostTest: function () {
		for (var i = 0; i < arguments.length; i++) {
			host = arguments[i];
			if (window.location.host == host) {
				return true;
			}
		};
		return false;
	},

	contentScript: null,

	lang: "en",
	langData: null,

	codeData: null,
	getCodeData: function (onLoad) {
		$.getJSON(Adopto.rootUrl + 'Browser/GetCodeData')
			.done(function (data) {
				Adopto.codeData = data;
				if (onLoad) {
					onLoad();
				}
			});
	},

	port: chrome.runtime.connect({name: 'adopto'}),
	iconStatus: function () {
		if (Adopto.contentScript) {
			Adopto.port.postMessage({value: 'enabled'});
		} else {
			Adopto.port.postMessage({value: 'disabled'});
		}
    },
    configOAuth: function() {
        var config = {
            authority: "http://localhost:5000",
            client_id: "js",
            redirect_uri: "http://localhost:5003/callback.html",
            response_type: "id_token token",
            scope: "openid profile api1",
            post_logout_redirect_uri: "http://localhost:5003/index.html"
        };
        mgr = new Oidc.UserManager(config);
    },
    loginUser: function () {
        mgr.signinRedirect();
    },
    logoutUser: function () {
        mgr.signoutRedirect();
    },
    getToken: function () {
        mgr.getUser().then(function (user) {
            if (user) {
                var url = "http://localhost:5001/identity";

                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.onload = function () {
                    //log(xhr.status, JSON.parse(xhr.responseText));
                };
                xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
                xhr.send();
            }
        });
    },
    callback: function () {
        new Oidc.UserManager().signinRedirectCallback().then(function () {
            window.location = "index.html";
        }).catch(function (e) {
            console.error(e);
        });
    }
};

(function ($) {

	$(function () {
		//console.log('%c Adopto Extension started', 'font-size: 24px; font-weight: bold; color: #00acac;');

		Adopto.iconStatus();
		$(window).focus(Adopto.iconStatus);
		Adopto.sidebar.toggle();
		Adopto.sidebar.insertAdoptoIcon();
	});

	


} (jQuery));