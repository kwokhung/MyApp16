define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData"
], function (declare, lang, array, topic, RoundRectStoreList, StoredData) {
    return declare("app.widget.special.home.ListResource", [RoundRectStoreList, StoredData], {
        resourceSubscriber: null,
        appendMessage: function (who) {
            if (typeof who != "undefined" && (typeof who == "string" || who.constructor == String)) {
                this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": who.replace(/\n/g, "<br />"), "variableHeight": true });
            }
            else {
                this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": who, "variableHeight": true });
            }
        },
        thereAre: function (who) {
            array.forEach(this.store.query({}), lang.hitch(this, function (item, index) {
                this.store.remove(item.id);
            }));
            array.forEach(who, lang.hitch(this, function (item, index) {
                this.appendMessage(item.id);
            }));
        },
        postCreate: function () {
            this.inherited(arguments);

            this.storeLabel = "Resource";
            this.setStore(this.store);

            this.resourceSubscriber = topic.subscribe("/resourceList/there.are", lang.hitch(this, this.thereAre));
            topic.publish("/resourceMonitor/who.are.there");
        },
        destroy: function () {
            this.inherited(arguments);

            if (this.resourceSubscriber != null) {
                this.resourceSubscriber.remove();
                this.resourceSubscriber = null;
            }
        }
    });
});
