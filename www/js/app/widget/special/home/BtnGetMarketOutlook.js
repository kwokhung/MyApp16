define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/string",
    "dojox/mobile/Button",
    "app/util/app"
], function (declare, lang, on, string, Button, app) {
    return declare("app.widget.special.home.BtnGetMarketOutlook", [Button], {
        postCreate: function () {
            this.inherited(arguments);

            on(this, "click", lang.hitch(this, function (e) {
                if (e != null) {
                    e.preventDefault();
                }

                app.serviceHelper.requestGetService(
                    string.substitute("${serviceUrl}?service=${service}&languageDisplay=${languageDisplay}", {
                        serviceUrl: "http://test04atmblinus.azurewebsites.net/test03",
                        service: "marketoutlook",
                        languageDisplay: app.language
                    }),
                    null,
                    function (response) {
                        document.getElementById("blkMarketOutlook").innerHTML = response.analysis;
                    }
                );
            }));
        }
    });
});
