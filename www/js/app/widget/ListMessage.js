define([
    "dojo/_base/declare",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData"
], function (declare, RoundRectStoreList, StoredData) {
    return declare("app.widget.ListMessage", [RoundRectStoreList, StoredData], {
        appendMessage: function (label, message) {
            if (typeof message == "undefined" && (typeof message == "string" || message.constructor == String)) {
                this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": label, "rightText": message.replace(/\n/g, "<br />"), "variableHeight": true });
            }
            else {
                this.store.put({ "id": this.id + "_" + (this.data.length + 1), "label": label, "rightText": message, "variableHeight": true });
            }
        },
        postCreate: function () {
            this.inherited(arguments);

            this.storeLabel = "Message";
            this.setStore(this.store);
        }
    });
});
