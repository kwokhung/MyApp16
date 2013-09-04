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
    return declare("app.widget.special.home.ListResourceDisk", [RoundRectStoreList, StoredData], {
        resourceSubscriber: null,
        gotoTopSubscriber: null,
        gotoBottomSubscriber: null,
        appendMessage: function (data) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            this.store.put({
                "id": itemId,
                "label": "<span style='color: blue;'>" + data.name + "</span><br />" + data.size + " / " + data.freeSpace,
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

            this.storeLabel = "Resource Disk";
            this.setStore(this.store);

            this.resourceSubscriber = topic.subscribe("/resourceDiskList/there.are", lang.hitch(this, this.thereAre));
            this.gotoTopSubscriber = topic.subscribe("/resourceDiskList/goto.top", lang.hitch(this, this.gotoTop));
            this.gotoBottomSubscriber = topic.subscribe("/resourceDiskList/goto.bottom", lang.hitch(this, this.gotoBottom));
        },
        destroy: function () {
            this.inherited(arguments);

            if (this.resourceSubscriber != null) {
                this.resourceSubscriber.remove();
                this.resourceSubscriber = null;
            }

            if (this.gotoTopSubscriber != null) {
                this.gotoTopSubscriber.remove();
                this.gotoTopSubscriber = null;
            }

            if (this.gotoBottomSubscriber != null) {
                this.gotoBottomSubscriber.remove();
                this.gotoBottomSubscriber = null;
            }
        }
    });
});
