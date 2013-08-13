define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/registry",
    "dojox/mobile/ScrollablePane"
], function (declare, lang, on, registry, ScrollablePane) {
    return declare("app.widget.PnlScrollable", [ScrollablePane], {
        postCreate: function () {
            this.inherited(arguments);

            this.resize();
        }
    });
});
