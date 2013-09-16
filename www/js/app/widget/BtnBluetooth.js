define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojox/mobile/Button",
    "app/util/app"
], function (declare, lang, on, Button, app) {
    return declare("app.widget.BtnBluetooth", [Button], {
        enableBluetoothOnClick: function () {
            on(this, "click", lang.hitch(this, function (e) {
                if (e != null) {
                    e.preventDefault();
                }

                app.generalHelper.natvieCall("Plugin02", "isSupported", [], lang.hitch(this, function (response) {
                    app.generalHelper.alert("Response", response);
                    app.generalHelper.natvieCall("Plugin02", "enable", [], lang.hitch(this, function (response) {
                        app.generalHelper.alert("Response", response);
                    }), lang.hitch(this, function (error) {
                        app.generalHelper.alert("Error", error);
                    }));
                }), lang.hitch(this, function (error) {
                    app.generalHelper.alert("Error", error);
                }));
            }));
        },
        postCreate: function () {
            this.inherited(arguments);

            this.enableBluetoothOnClick();
        }
    });
});
