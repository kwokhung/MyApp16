define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/json",
    "dojo/topic",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData",
    "app/widget/_Subscriber"
], function (declare, lang, json, topic, RoundRectStoreList, StoredData, _Subscriber) {
    return declare("app.widget.ListMessage", [RoundRectStoreList, StoredData, _Subscriber], {
        appendMessage: function (data) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            var label =
                "<span style='color: blue;'>" +
                    data.who +
                "</span>" +
                "<br />" +
                "<span style='font-size: 50%; color: green;'>" +
                    data.when.dateFormat() + ": ";


            if (typeof data.what != "undefined" && (typeof data.what == "string" || (data.what != null && data.what.constructor == String))) {
                label = label + data.what.replace(/\n/g, "<br />");
            }
            else if (typeof data.what != "undefined" && (typeof data.what == "object" || (data.what != null && data.what.constructor == Object))) {
                label = label + json.stringify(data.what);
            }
            else {
                label = label + data.what;
            }

            label = label +
                "</span>";

            this.store.put({
                "id": itemId,
                "label": label,
                "variableHeight": true
            });
        },
        someoneSaid: function (data) {
            alert(data);
            this.appendMessage(data);
        },
        postCreate: function () {
            this.inherited(arguments);

            this.storeLabel = "Message";
            this.setStore(this.store);

            this.subscribers.push(topic.subscribe("/bluetooth/messageList/someone.said", lang.hitch(this, this.someoneSaid)));
        }
    });
});
