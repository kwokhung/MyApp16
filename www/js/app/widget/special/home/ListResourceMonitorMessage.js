define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dijit/registry",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData"
], function (declare, lang, array, registry, RoundRectStoreList, StoredData) {
    return declare("app.widget.special.home.ListResourceMonitorMessage", [RoundRectStoreList, StoredData], {
        resourceUrl: null,
        who: null,
        resourceListId: null,
        socket: null,
        appendMessage: function (label, message) {
            if (typeof message == "undefined" && (typeof message == "string" || message.constructor == String)) {
                this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": label, "rightText": message.replace(/\n/g, "<br />"), "variableHeight": true });
            }
            else {
                this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": label, "rightText": message, "variableHeight": true });
            }
        },
        logMessage: function (data) {
            this.appendMessage("System", data.message);
        },
        handleMessage: function () {
            var socket = this.socket;

            socket.on("connecting", lang.hitch(this, function () {
                this.appendMessage("System", "connecting");
            }));

            socket.on("connect", lang.hitch(this, function () {
                this.appendMessage("System", "connect");

                socket.on("heartbeat", lang.hitch(this, function (data) {
                    this.appendMessage("heartbeat", data.time);
                }));

                socket.on("you.are", lang.hitch(this, function (data) {
                    this.appendMessage("you.are", data.who);
                }));

                socket.on("he.is", lang.hitch(this, function (data) {
                    this.appendMessage("he.is", data.who);
                }));

                socket.on("they.are", lang.hitch(this, function (data) {
                    array.forEach(data.who, lang.hitch(this, function (item, index) {
                        this.appendMessage("they.are", item.id);
                    }));

                    if (this.resourceListId != null) {
                        registry.byId(this.resourceListId).theyAre(data.who);
                    }
                }));

                socket.on("someone.said", lang.hitch(this, function (data) {
                    this.appendMessage("someone.said", data.what + " by " + data.who);
                }));

                socket.on("someone.joined", lang.hitch(this, function (data) {
                    this.appendMessage("someone.joined", data.who);
                }));

                this.iAm();
            }));

            socket.on("connect_failed", lang.hitch(this, function (e) {
                this.appendMessage("System", (e ? e.type : "connect_failed"));
            }));

            socket.on("message", lang.hitch(this, function (message, callback) {
                this.appendMessage("System", message);
            }));

            socket.on("disconnect", lang.hitch(this, function () {
                this.appendMessage("disconnect", "disconnect");
            }));

            socket.on("reconnecting", lang.hitch(this, function () {
                this.appendMessage("System", "reconnecting");
            }));

            socket.on("reconnect", lang.hitch(this, function () {
                this.appendMessage("System", "reconnect");
            }));

            socket.on("reconnect_failed", lang.hitch(this, function () {
                this.appendMessage("System", (e ? e.type : "reconnect_failed"));
            }));

            socket.on("error", lang.hitch(this, function (e) {
                this.appendMessage("System", (e ? e.type : "unknown error"));
            }));
        },
        iAm: function () {
            this.socket.emit("i.am", { who: this.who }, lang.hitch(this, this.logMessage));
        },
        tellOther: function (what) {
            this.socket.emit("tell.other", { who: this.who, what: what }, lang.hitch(this, this.logMessage));
        },
        whoAreThere: function () {
            this.socket.emit("who.are.there", null, lang.hitch(this, this.logMessage));
        },
        postCreate: function () {
            this.inherited(arguments);

            if (this.resourceUrl != null) {
                this.storeLabel = "Resource Monitor Message";
                this.setStore(this.store);

                this.socket = io.connect(this.resourceUrl, { "force new connection": false });

                this.handleMessage();
            }
        }
    });
});