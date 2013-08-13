define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/registry",
    "dojox/mobile/ScrollableView",
    "app/util/app"
], function (declare, lang, on, registry, ScrollableView, app) {
    return declare("app.widget.special.home.ViewPhoneInformation", [ScrollableView], {
        postCreate: function () {
            this.inherited(arguments);

            on(this, "afterTransitionIn", lang.hitch(this, function () {
                if (app.device != null) {
                    registry.byId("txtPlatform").set("value", app.device.platform);
                    registry.byId("txtVersion").set("value", app.device.version);
                }

                if (app.navigator != null) {
                    if (typeof app.navigator.network != "undefined") {
                        var connectionStates = {};
                        connectionStates[Connection.UNKNOWN] = "Unknown connection";
                        connectionStates[Connection.ETHERNET] = "Ethernet connection";
                        connectionStates[Connection.WIFI] = "WiFi connection";
                        connectionStates[Connection.CELL_2G] = "Cell 2G connection";
                        connectionStates[Connection.CELL_3G] = "Cell 3G connection";
                        connectionStates[Connection.CELL_4G] = "Cell 4G connection";
                        connectionStates[Connection.NONE] = "No network connection";

                        registry.byId("txtConnection").set("value", connectionStates[app.navigator.network.connection.type]);
                    }

                    if (typeof app.navigator.contacts != "undefined") {
                        app.navigator.contacts.find(["displayName", "phoneNumbers"], function (contacts) {
                            registry.byId("txtName").set("value", contacts[0].displayName);
                            registry.byId("txtPhone").set("value", contacts[0].phoneNumbers[0].value);
                        }, function (error) {
                            app.generalHelper.alert("Error getting contacts.", "Error Code: " + error.code);
                        }, {
                            filter: "\u6731\u570b\u96c4",
                            multiple: true
                        });
                    }

                    if (typeof app.navigator.geolocation != "undefined") {
                        app.navigator.geolocation.getCurrentPosition(function (position) {
                            registry.byId("txtLatitude").set("value", position.coords.latitude);
                            registry.byId("txtLongitude").set("value", position.coords.longitude);
                        }, function (error) {
                            app.generalHelper.alert("Error getting location.", "Error Code: " + error.code + "\n" + "Error Message: " + error.message);
                        }, {
                            enableHighAccuracy: false
                        });
                    }

                    if (typeof app.navigator.accelerometer != "undefined") {
                        app.navigator.accelerometer.watchAcceleration(function (acceleration) {
                            registry.byId("txtX").set("value", acceleration.x);
                            registry.byId("txtY").set("value", acceleration.y);
                            registry.byId("txtZ").set("value", acceleration.z);
                        }, function () {
                            app.generalHelper.alert("Error getting acceleration.", "");
                        }, {
                            frequency: 1000
                        });
                    }
                }
            }));
        }
    });
});
