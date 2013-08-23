define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData"
], function (declare, lang, array, topic, RoundRectStoreList, StoredData) {
    return declare("app.widget.special.home.ListMessage", [RoundRectStoreList, StoredData], {
        messageSubscriber: null,
        appendMessage: function (who, what) {
            if (typeof what != "undefined" && (typeof what == "string" || what.constructor == String)) {
                this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": "<span style='color: blue;'>" + who + "</span><br />" + what.replace(/\n/g, "<br />"), "variableHeight": true });
            }
            else {
                this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": "<span style='color: blue;'>" + who + "</span><br />" + what, "variableHeight": true });
            }
        },
        someoneSaid: function (data) {
            this.appendMessage(data.who, data.what);
        },
        postCreate: function () {
            this.inherited(arguments);

            this.storeLabel = "Message";
            this.setStore(this.store);

            this.messageSubscriber = topic.subscribe("/messageList/someone.said", lang.hitch(this, this.someoneSaid));
            topic.publish("/resourceMonitor/what.are.said");
        },
        destroy: function () {
            this.inherited(arguments);

            if (this.messageSubscriber != null) {
                this.messageSubscriber.remove();
                this.messageSubscriber = null;
            }
        }
    });
});
