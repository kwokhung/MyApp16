var main = function () {
    require([
        "dojo/ready",
        "dojo/json",
        "app/util/app"
    ], function (ready, json, app) {
        ready(function () {
            if (typeof cordova != "undefined") {
                app.cordova = cordova;
            }

            if (typeof device != "undefined") {
                app.device = device;
            }

            if (typeof navigator != "undefined") {
                app.navigator = navigator;
            }

            /*app.generalHelper.natvieCall("BluetoothSerial", "isEnabled", [], function (response) {
                app.generalHelper.alert("Response", response);
                app.generalHelper.natvieCall("BluetoothSerial", "list", [], function (response) {
                    response.forEach(function (device) {
                        app.generalHelper.alert("Paired Device Name", device.name);
                        app.generalHelper.alert("Paired Device Address", device.address);
                        app.generalHelper.natvieCall("BluetoothSerial", "connect", [device.address], function (response) {
                            app.generalHelper.alert("Response", response);
                        }, function (error) {
                            app.generalHelper.alert("Error (" + device.address + ")", error);
                        });
                    });
                }, function (error) {
                    app.generalHelper.alert("Error", json.stringify(error));
                });
            }, function (error) {
                app.generalHelper.alert("Error", error);
            });*/

            /*app.generalHelper.natvieCall("Plugin01", "echo", ["Check if bluetooth is enabled."], function (response) {
                app.generalHelper.alert("Response", response);
            }, function (error) {
                app.generalHelper.alert("Error", error);
            });*/

            /*app.generalHelper.natvieCall("Plugin02", "test", ["Succeeded."], function (response) {
                app.generalHelper.alert("Response", response);
            }, function (error) {
                app.generalHelper.alert("Error", error);
            });*/

            app.generalHelper.natvieCall("Plugin02", "isSupported", [], function (response) {
                app.generalHelper.alert("Response", response);
                app.generalHelper.natvieCall("Plugin02", "enable", [], function (response) {
                    app.generalHelper.alert("Response", response);
                }, function (error) {
                    app.generalHelper.alert("Error", error);
                });
            }, function (error) {
                app.generalHelper.alert("Error", error);
            });

            require([
                "dojox/mobile/compat",
                "dojox/mobile/deviceTheme",
                "app/widget/special/layout/PnlMain"
            ]);

            ready(function () {
                require([
                    "dojox/mobile/parser",
                    "dojo/domReady!"
                ], function (parser) {
                    parser.parse();
                });
            });
        });
    });
};