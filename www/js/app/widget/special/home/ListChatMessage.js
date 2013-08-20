define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData",
    "app/util/app"
], function (declare, lang, RoundRectStoreList, StoredData, app) {
    return declare("app.widget.special.home.ListChatMessage", [RoundRectStoreList, StoredData], {
        resourceUrl: null,
        appendMessage: function (label, message) {
            if (typeof message == "undefined" && (typeof message == "string" || message.constructor == String)) {
                this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": label, "rightText": message.replace(/\n/g, "<br />"), "variableHeight": true });
            }
            else {
                this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": label, "rightText": message, "variableHeight": true });
            }
        },
        handleMessage: function () {
            var socket = io.connect(this.resourceUrl, { "force new connection": false });

            socket.on("connect", lang.hitch(this, function () {
                this.appendMessage("connect", "Connected");

                socket.on("data", lang.hitch(this, function (data) {
                    this.appendMessage("data", data);
                }));

                socket.on("announcement", lang.hitch(this, function (message) {
                    this.appendMessage("announcement", message);
                }));

                socket.on("nicknames", lang.hitch(this, function (nicknames) {
                    this.appendMessage("nicknames", JSON.stringify(nicknames));
                }));

                socket.on("user message", lang.hitch(this, this.appendMessage));

                socket.on("reconnect", lang.hitch(this, function () {
                    this.appendMessage("System", "Reconnected to the server");
                }));

                socket.on("reconnecting", lang.hitch(this, function () {
                    this.appendMessage("System", "Attempting to re-connect to the server");
                }));

                socket.on("error", lang.hitch(this, function (e) {
                    this.appendMessage("System", (e ? e.type : "A unknown error occurred"));
                }));

                socket.on("disconnect", lang.hitch(this, function () {
                    this.appendMessage("disconnect", "Disconnected");
                }));
            }));
        },
        postCreate: function () {
            this.inherited(arguments);

            if (this.resourceUrl != null) {
                this.storeLabel = "Chat Message";
                this.setStore(this.store);

                this.handleMessage();
            }
        }
    });
});
