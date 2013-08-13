define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/on",
    "dojo/string",
    "dojox/mobile/RoundRectStoreList",
    "dijit/registry",
    "app/util/StoredData",
    "app/util/app"
], function (declare, lang, array, on, string, RoundRectStoreList, registry, StoredData, app) {
    return declare("app.widget.special.home.ListPairedDevice", [RoundRectStoreList, StoredData], {
        appendPairedDevice: function (label, message) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);
            this.store.put({ "id": itemId, "label": label, "rightText": message, "variableHeight": true, "anchorLabel": true });

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
                    app.generalHelper.natvieCall("BluetoothSerial", "connect", [this.store.get(itemId).rightText], lang.hitch(this, function (response) {
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
            //this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": label, "rightText": message.replace(/\n/g, "<br />"), "variableHeight": true });
            registry.byId("lstMessage").appendMessage(label, message);
        },
        getPairedDevice: function () {
            app.generalHelper.natvieCall("BluetoothSerial", "isEnabled", [], lang.hitch(this, function (response) {
                app.generalHelper.natvieCall("BluetoothSerial", "list", [], lang.hitch(this, function (response) {
                    response.forEach(lang.hitch(this, function (device) {
                        this.appendPairedDevice(device.name, device.address);
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
