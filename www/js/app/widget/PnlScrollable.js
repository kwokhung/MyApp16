define([
    "dojo/_base/declare",
    "dojox/mobile/ScrollablePane"
], function (declare, ScrollablePane) {
    return declare("app.widget.PnlScrollable", [ScrollablePane], {
        postCreate: function () {
            this.inherited(arguments);

            this.resize();
        }
    });
});
