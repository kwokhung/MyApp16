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
            this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": label, "rightText": message.replace(/\n/g, "<br />"), "variableHeight": true });
        },
        handleMessage: function () {
            var socket = io.connect(this.resourceUrl, { "force new connection": false });

            socket.on("connect", lang.hitch(this, function () {
                this.appendMessage("connect", "Connected");

                socket.on("announcement", function (msg) {
                    this.appendMessage("announcement", msg);
                });

                socket.on("nicknames", function (nicknames) {
                    this.appendMessage("nicknames", JSON.stringify(nicknames));
                });

                socket.on("user message", this.appendMessage);

                socket.on("reconnect", function () {
                    this.appendMessage("System", "Reconnected to the server");
                });

                socket.on("reconnecting", function () {
                    this.appendMessage("System", "Attempting to re-connect to the server");
                });

                socket.on("error", function (e) {
                    this.appendMessage("System", (e ? e : "A unknown error occurred"));
                });

                socket.on("disconnect", function () {
                    this.appendMessage("disconnect", "Disconnected");
                });
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
