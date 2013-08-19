define([
    "dojo/_base/declare",
    "dojox/mobile/ScrollableView"
], function (declare, ScrollableView) {
    return declare("app.widget.ViewScrollable", [ScrollableView], {
        postCreate: function () {
            this.inherited(arguments);

            this.resize();
        }
    });
});
