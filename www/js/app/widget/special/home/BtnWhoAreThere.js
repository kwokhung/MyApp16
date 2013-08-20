define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/string",
    "dijit/registry",
    "dojox/mobile/Button",
    "app/util/app"
], function (declare, lang, on, string, registry, Button, app) {
    return declare("app.widget.special.home.BtnWhoAreThere", [Button], {
        socketId: null,
        postCreate: function () {
            this.inherited(arguments);

            if (this.socketId != null) {
                on(this, "click", lang.hitch(this, function (e) {
                    if (e != null) {
                        e.preventDefault();
                    }

                    registry.byId(this.socketId).whoAreThere();
                }));
            }
        }
    });
});
