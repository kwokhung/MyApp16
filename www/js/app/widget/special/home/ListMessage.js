define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData"
], function (declare, lang, array, topic, registry, RoundRectStoreList, StoredData) {
    return declare("app.widget.special.home.ListMessage", [RoundRectStoreList, StoredData], {
        messageSubscriber: null,
        clearMessageSubscriber: null,
        gotoTopSubscriber: null,
        gotoBottomSubscriber: null,
        appendMessage: function (who, what) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            if (typeof what != "undefined" && (typeof what == "string" || what.constructor == String)) {
                this.store.put({
                    "id": itemId,
                    "label": "<span style='color: blue;'>" + who + "</span><br />" + what.replace(/\n/g, "<br />"),
                    "variableHeight": true
                });
            }
            else {
                this.store.put({
                    "id": itemId,
                    "label": "<span style='color: blue;'>" + who + "</span><br />" + what,
                    "variableHeight": true
                });
            }

            this.getParent().scrollIntoView(registry.byId(itemId).domNode);
        },
        someoneSaid: function (data) {
            this.appendMessage(data.who, data.what);
        },
        clearMessage: function () {
            array.forEach(this.store.query({}), lang.hitch(this, function (item, index) {
                this.store.remove(item.id);
            }));
        },
        gotoTop: function () {
            var topItemId = this.id + "_" + (1);

            this.getParent().scrollIntoView(registry.byId(topItemId).domNode, true);
        },
        gotoBottom: function () {
            var bottomItemId = this.id + "_" + (this.data.length);

            this.getParent().scrollIntoView(registry.byId(bottomItemId).domNode, false);
        },
        postCreate: function () {
            this.inherited(arguments);

            this.storeLabel = "Message";
            this.setStore(this.store);

            this.messageSubscriber = topic.subscribe("/messageList/someone.said", lang.hitch(this, this.someoneSaid));
            this.clearMessageSubscriber = topic.subscribe("/messageList/clear.message", lang.hitch(this, this.clearMessage));
            this.gotoTopSubscriber = topic.subscribe("/messageList/goto.top", lang.hitch(this, this.gotoTop));
            this.gotoBottomSubscriber = topic.subscribe("/messageList/goto.bottom", lang.hitch(this, this.gotoBottom));
        },
        destroy: function () {
            this.inherited(arguments);

            if (this.messageSubscriber != null) {
                this.messageSubscriber.remove();
                this.messageSubscriber = null;
            }

            if (this.clearMessageSubscriber != null) {
                this.clearMessageSubscriber.remove();
                this.clearMessageSubscriber = null;
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
