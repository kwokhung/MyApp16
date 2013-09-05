define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/on",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData"
], function (declare, lang, array, on, topic, registry, RoundRectStoreList, StoredData) {
    return declare("app.widget.special.home.ListResourceProcess", [RoundRectStoreList, StoredData], {
        subscribers: [],
        appendMessage: function (data) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            this.store.put({
                "id": itemId,
                "label": "<span style='color: blue;'>" + data.name + "</span><br />" + data.processId + " / " + data.user + "<br />" + data.creationDate + " / " + data.priority + " / " + data.workingSetSize,
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
            this.subscribers.push(topic.subscribe("/resourceProcessList/goto.top", lang.hitch(this, this.gotoTop)));
            this.subscribers.push(topic.subscribe("/resourceProcessList/goto.bottom", lang.hitch(this, this.gotoBottom)));
        },
        destroy: function () {
            this.inherited(arguments);

            array.forEach(this.subscribers, lang.hitch(this, function (item, index) {
                if (item != null) {
                    item.remove();
                    item = null;
                }
            }));
        }
    });
});
