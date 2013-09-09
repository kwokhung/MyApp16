String.prototype.dateFormat = function () {
    var that = this.toString();

    var date = new Date(that.substring(0, 4), that.substring(4, 6) - 1, that.substring(6, 8), that.substring(8, 10), that.substring(10, 12), that.substring(12));
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();

    return "" + year + "-" +
    (month < 10 ? "0" + month : month) + "-" +
    (day < 10 ? "0" + day : day) + " " +
    (hh < 10 ? "0" + hh : hh) + ":" +
    (mm < 10 ? "0" + mm : mm) + ":" +
    (ss < 10 ? "0" + ss : ss);
};

Number.prototype.format = function (format) {
    if (typeof format != "string") {
        return "";
    } // sanity check

    var hasComma = -1 < format.indexOf(","),
        psplit = format.split("."),
        that = this;

    // compute precision
    if (1 < psplit.length) {
        // fix number precision
        that = that.toFixed(psplit[1].length);
    }
        // error: too many periods
    else if (2 < psplit.length) {
        throw ("NumberFormatException: invalid format, formats should have no more than 1 period: " + format);
    }
        // remove precision
    else {
        that = that.toFixed(0);
    }

    // get the string now that precision is correct
    var fnum = that.toString();

    // format has comma, then compute commas
    if (hasComma) {
        // remove precision for computation
        psplit = fnum.split(".");

        var cnum = psplit[0],
            parr = [],
            j = cnum.length,
            m = Math.floor(j / 3),
            n = cnum.length % 3 || 3; // n cannot be ZERO or causes infinite loop

        // break the number into chunks of 3 digits; first chunk may be less than 3
        for (var i = 0; i < j; i += n) {
            if (i != 0) {
                n = 3;
            }

            parr[parr.length] = cnum.substr(i, n);
            m -= 1;
        }

        // put chunks back together, separated by comma
        fnum = parr.join(",");

        // add the precision back in
        if (psplit[1]) {
            fnum += "." + psplit[1];
        }
    }

    // replace the number portion of the format with fnum
    return format.replace(/[\d,?\.?]+/, fnum);
};

var onClickHandler = function (e) {
    alert("hi");
};

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

            /*app.generalHelper.natvieCall("Plugin02", "isSupported", [], function (response) {
                app.generalHelper.alert("Response", response);
                app.generalHelper.natvieCall("Plugin02", "enable", [], function (response) {
                    app.generalHelper.alert("Response", response);
                }, function (error) {
                    app.generalHelper.alert("Error", error);
                });
            }, function (error) {
                app.generalHelper.alert("Error", error);
            });*/

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