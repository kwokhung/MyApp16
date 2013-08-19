define([
    "dojo/_base/declare",
    "dojox/mobile/Container"
], function (declare, Container) {
    return declare("app.widget.PnlContainer", [Container], {
        postCreate: function () {
            this.inherited(arguments);

            this.resize();
        }
    });
});
