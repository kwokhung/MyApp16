define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dojo/string",
    "dijit/registry",
    "dojox/mobile/ContentPane",
    "app/util/app"
], function (declare, lang, on, topic, string, registry, ContentPane, app) {
    return declare("app.widget.special.layout.PnlMain", [ContentPane], {
        postCreate: function () {
            this.inherited(arguments);

            on(this, "load", lang.hitch(this, function (e) {
                if (e != null) {
                    e.preventDefault();
                }

                app.currentViewId = "viewHome";
                app.previousViewId = "";

                topic.subscribe("/dojox/mobile/afterTransitionIn", function (transitionView) {
                    app.previousViewId = app.currentViewId;
                    app.currentViewId = transitionView.id;
                });

                on(document, "menubutton", function (e) {
                    if (e != null) {
                        e.preventDefault();
                    }

                    registry.byId("viewPhoneInformation").show();
                });

                on(document, "backbutton", function (e) {
                    if (e != null) {
                        e.preventDefault();
                    }

                    if (app.navigator != null) {
                        if (typeof app.navigator.app != "undefined") {
                            if (app.currentViewId == "viewHome") {
                                app.navigator.app.exitApp();
                            }
                            else if (app.currentViewId == "viewPhoneInformation") {
                                registry.byId(app.previousViewId).show();
                            }
                        }
                    }
                });
            }));
        }
    });
});
