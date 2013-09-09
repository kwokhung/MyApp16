define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData",
    "app/widget/_Subscriber"
], function (declare, lang, array, topic, registry, RoundRectStoreList, StoredData, _Subscriber) {
    return declare("app.widget.special.home.ListResourceProcess", [RoundRectStoreList, StoredData, _Subscriber], {
        appendMessage: function (data) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            this.store.put({
                "id": itemId,
                "label":
                    "<span style='color: blue;'>" +
                        data.name +
                    "</span>" +
                    "<br />" +
                    "<span style='font-size: 50%; color: green;'>Process Id: " +
                        data.processId +
                    "</span>" +
                    "<br />" +
                    "<span style='font-size: 50%; color: green;'>User: " +
                        data.user +
                    "</span>" +
                    "<br />" +
                    "<span style='font-size: 50%; color: green;'>Creation Date: " +
                        data.creationDate.dateFormat() +
                    "</span>" +
                    "<br />" +
                    "<span style='font-size: 50%; color: green;'>Priority: " +
                        data.priority +
                    "</span>" +
                    "<br />" +
                    "<span style='font-size: 50%; color: green;'>Working Set Size: " +
                        (data.workingSetSize / 1024 / 1024).format("0,000.000") + " MB" +
                    "</span>",
                "variableHeight": true
            });

            this.getParent().scrollIntoView(registry.byId(itemId).domNode);
        },
        thereAre: function (who) {
            array.forEach(this.store.query({}), lang.hitch(this, function (item, index) {
                this.store.remove(item.id);
            }));
            array.forEach(who, lang.hitch(this, function (item, index) {
                this.appendMessage(item);
            }));
        },
        clearMessage: function () {
            array.forEach(this.store.query({}), lang.hitch(this, function (item, index) {
                this.store.remove(item.id);
            }));
        },
        gotoTop: function () {
            var topItem = registry.byId(this.id + "_" + (1));

            if (typeof topItem != "undefined" && topItem != null) {
                this.getParent().scrollIntoView(topItem.domNode, true);
            }
        },
        gotoBottom: function () {
            var bottomItem = registry.byId(this.id + "_" + (this.data.length));

            if (typeof bottomItem != "undefined" && bottomItem != null) {
                this.getParent().scrollIntoView(bottomItem.domNode, false);
            }
        },
        postCreate: function () {
            this.inherited(arguments);

            this.storeLabel = "Resource Process";
            this.setStore(this.store);

            this.subscribers.push(topic.subscribe("/resourceProcessList/there.are", lang.hitch(this, this.thereAre)));
            this.subscribers.push(topic.subscribe("/resourceProcessList/clear.message", lang.hitch(this, this.clearMessage)));
            this.subscribers.push(topic.subscribe("/resourceProcessList/goto.top", lang.hitch(this, this.gotoTop)));
            this.subscribers.push(topic.subscribe("/resourceProcessList/goto.bottom", lang.hitch(this, this.gotoBottom)));
        }
    });
});
