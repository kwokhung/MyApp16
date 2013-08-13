define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/string",
    "dojox/mobile/ScrollableView",
    "app/util/app"
], function (declare, lang, on, string, ScrollableView, app) {
    return declare("app.widget.special.home.ViewMarketOutlook", [ScrollableView], {
        postCreate: function () {
            this.inherited(arguments);

            on(this, "afterTransitionIn", lang.hitch(this, function () {
                app.serviceHelper.requestGetService(
                    string.substitute("${serviceUrl}?service=${service}&languageDisplay=${languageDisplay}", {
                        serviceUrl: "https://www.guococom.com/GuocoCommoditiesServer/serviceportal.aspx",
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
