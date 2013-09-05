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
    return declare("app.widget.special.home.ListResourceDisk", [RoundRectStoreList, StoredData, _Subscriber], {
        appendMessage: function (data) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            this.store.put({
                "id": itemId,
                "label": "<span style='color: blue;'>" + data.name + "</span><br />" + data.freeSpace + " / " + data.size,
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

            this.storeLabel = "Resource Disk";
            this.setStore(this.store);

            this.subscribers.push(topic.subscribe("/resourceDiskList/there.are", lang.hitch(this, this.thereAre)));
            this.subscribers.push(topic.subscribe("/resourceDiskList/clear.message", lang.hitch(this, this.clearMessage)));
            this.subscribers.push(topic.subscribe("/resourceDiskList/goto.top", lang.hitch(this, this.gotoTop)));
            this.subscribers.push(topic.subscribe("/resourceDiskList/goto.bottom", lang.hitch(this, this.gotoBottom)));
        }
    });
});
