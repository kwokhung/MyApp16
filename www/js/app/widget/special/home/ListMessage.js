define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/json",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData",
    "app/widget/_ScrollableStoreList",
    "app/widget/_Subscriber"
], function (declare, lang, array, json, topic, registry, RoundRectStoreList, StoredData, _ScrollableStoreList, _Subscriber) {
    return declare("app.widget.special.home.ListMessage", [RoundRectStoreList, StoredData, _ScrollableStoreList, _Subscriber], {
        appendMessage: function (data) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            var date = new Date(data.when);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hh = date.getHours();
            var mm = date.getMinutes();
            var ss = date.getSeconds();

            var when = "" + year + "-" +
            (month < 10 ? "0" + month : month) + "-" +
            (day < 10 ? "0" + day : day) + " " +
            (hh < 10 ? "0" + hh : hh) + ":" +
            (mm < 10 ? "0" + mm : mm) + ":" +
            (ss < 10 ? "0" + ss : ss);

            var label = null;

            if (typeof data.what != "undefined" && (typeof data.what == "string" || (data.what != null && data.what.constructor == String))) {
                label = "<span style='color: blue;'>" + data.who + "</span><span style='font-size: 50%; color: green; float: right;'>" + when + "</span><br />" + data.what.replace(/\n/g, "<br />");
            }
            else if (typeof data.what != "undefined" && (typeof data.what == "object" || (data.what != null && data.what.constructor == Object))) {
                label = "<span style='color: blue;'>" + data.who + "</span><span style='font-size: 50%; color: green; float: right;'>" + when + "</span><br />" + json.stringify(data.what);
            }
            else {
                label = "<span style='color: blue;'>" + data.who + "</span><span style='font-size: 50%; color: green; float: right;'>" + when + "</span><br />" + data.what;
            }

            this.store.put({
                "id": itemId,
                "label": label,
                "variableHeight": true
            });

            this.getParent().scrollIntoView(registry.byId(itemId).domNode);
        },
        someoneSaid: function (data) {
            this.appendMessage(data);
        },
        postCreate: function () {
            this.inherited(arguments);

            this.storeLabel = "Message";
            this.setStore(this.store);

            this.subscribers.push(topic.subscribe("/messageList/someone.said", lang.hitch(this, this.someoneSaid)));
            this.subscribers.push(topic.subscribe("/messageList/clear.message", lang.hitch(this, this.clearMessage)));
            this.subscribers.push(topic.subscribe("/messageList/goto.top", lang.hitch(this, this.gotoTop)));
            this.subscribers.push(topic.subscribe("/messageList/goto.bottom", lang.hitch(this, this.gotoBottom)));
        }
    });
});
