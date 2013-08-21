define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dijit/registry",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData"
], function (declare, lang, array, registry, RoundRectStoreList, StoredData) {
    return declare("app.widget.special.home.ListResource", [RoundRectStoreList, StoredData], {
        resourceMonitorId: null,
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
        theyAre: function (who) {
            array.forEach(this.store.query({}), lang.hitch(this, function (item, index) {
                this.store.remove(item.id);
            }));
            array.forEach(who, lang.hitch(this, function (item, index) {
                this.appendMessage("they.are", item.id);
            }));
        },
        postCreate: function () {
            this.inherited(arguments);

            if (this.resourceMonitorId != null) {
                this.storeLabel = "Resource";
                this.setStore(this.store);

                registry.byId(this.resourceMonitorId).whoAreThere();
            }
        }
    });
});
