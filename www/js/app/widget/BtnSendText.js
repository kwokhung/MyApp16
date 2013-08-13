define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/registry",
    "dojox/mobile/Button",
    "app/widget/_Clickable"
], function (declare, lang, on, registry, Button, _Clickable) {
    return declare("app.widget.BtnSendText", [Button, _Clickable], {
        textId: null,
        postCreate: function () {
            this.inherited(arguments);

            if (this.textId != null) {
                this.sendTextOnClick(this.textId);
            }
        }
    });
});
