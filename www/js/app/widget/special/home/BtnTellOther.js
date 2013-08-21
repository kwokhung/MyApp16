define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/string",
    "dijit/registry",
    "dojox/mobile/Button",
    "app/util/app"
], function (declare, lang, on, string, registry, Button, app) {
    return declare("app.widget.special.home.BtnTellOther", [Button], {
        resourceMonitorId: null,
        postCreate: function () {
            this.inherited(arguments);

            if (this.resourceMonitorId != null) {
                on(this, "click", lang.hitch(this, function (e) {
                    if (e != null) {
                        e.preventDefault();
                    }

                    registry.byId(this.resourceMonitorId).tellOther("I am fine.");
                }));
            }
        }
    });
});
