define([
    "dojo/_base/declare",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData"
], function (declare, RoundRectStoreList, StoredData) {
    return declare("app.widget.ListMessage", [RoundRectStoreList, StoredData], {
        appendMessage: function (label, message) {
            this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": label, "rightText": message.replace(/\n/g, "<br />"), "variableHeight": true });
        },
        postCreate: function () {
            this.inherited(arguments);

            this.storeLabel = "Message";
            this.setStore(this.store);
        }
    });
});
