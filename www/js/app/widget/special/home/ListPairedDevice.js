define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/string",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData",
    "app/util/app"
], function (declare, lang, on, string, topic, registry, RoundRectStoreList, StoredData, app) {
    return declare("app.widget.special.home.ListPairedDevice", [RoundRectStoreList, StoredData], {
        appendPairedDevice: function (data) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            var label =
                "<span style='color: blue;'>" +
                    data.name +
                "</span>" +
                "<br />" +
                "<span style='font-size: 50%; color: green;'>";


            if (typeof data.address != "undefined" && (typeof data.address == "string" || (data.address != null && data.address.constructor == String))) {
                label = label + data.address.replace(/\n/g, "<br />");
            }
            else if (typeof data.address != "undefined" && (typeof data.address == "object" || (data.address != null && data.address.constructor == Object))) {
                label = label + json.stringify(data.address);
            }
            else {
                label = label + data.address;
            }

            label = label +
                "</span>";

            this.store.put({
                "id": itemId,
                "label": label,
                "address": data.address,
                "variableHeight": true,
                "anchorLabel": true
            });

            on(registry.byId(itemId), "anchorLabelClicked", lang.hitch(this, function (e) {
                if (e != null) {
                    e.preventDefault();
                }

                app.generalHelper.natvieCall("BluetoothSerial", "isConnected", [], lang.hitch(this, function (response) {
                    this.appendMessage("isConnected", response);
                    app.generalHelper.natvieCall("BluetoothSerial", "disconnect", [], lang.hitch(this, function (response) {
                        this.appendMessage("disconnect", response);
                    }), lang.hitch(this, function (error) {
                        this.appendMessage("disconnect", error);
                    }));
                }), lang.hitch(this, function (error) {
                    this.appendMessage("isConnected", error);
                    app.generalHelper.natvieCall("BluetoothSerial", "connect", [this.store.get(itemId).address], lang.hitch(this, function (response) {
                        this.appendMessage("connect", response);
                        app.generalHelper.natvieCall("BluetoothSerial", "subscribe", ["\n"], lang.hitch(this, function (response) {
                            this.appendMessage("subscribe", response);
                        }), lang.hitch(this, function (error) {
                            this.appendMessage("subscribe", error);
                        }));
                        app.generalHelper.natvieCall("BluetoothSerial", "write", ["Hello\n"], lang.hitch(this, function (response) {
                            this.appendMessage("write", response);
                        }), lang.hitch(this, function (error) {
                            this.appendMessage("write", error);
                        }));
                    }), lang.hitch(this, function (error) {
                        this.appendMessage("connect", error);
                    }));
                }));
            }));
        },
        appendMessage: function (label, message) {
            topic.publish("/bluetooth/messageList/someone.said", {
                who: label,
                what: message,
                when: new Date().yyyyMMddHHmmss()
            });
        },
        getPairedDevice: function () {
            app.generalHelper.natvieCall("BluetoothSerial", "isEnabled", [], lang.hitch(this, function (response) {
                app.generalHelper.natvieCall("BluetoothSerial", "list", [], lang.hitch(this, function (response) {
                    response.forEach(lang.hitch(this, function (device) {
                        this.appendPairedDevice({ name: device.name, address: device.address });
                    }));
                }), lang.hitch(this, lang.hitch(this, function (error) {
                    this.appendMessage("list", error);
                })));
            }), lang.hitch(this, function (error) {
                this.appendMessage("isEnabled", error);
            }));
        },
        postCreate: function () {
            this.inherited(arguments);

            this.storeLabel = "Paired Device";
            this.setStore(this.store);

            this.getPairedDevice();
        }
    });
});
