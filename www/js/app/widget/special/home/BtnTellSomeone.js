define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/Button"
], function (declare, lang, on, topic, registry, Button) {
    return declare("app.widget.special.home.BtnTellSomeone", [Button], {
        whomId: null,
        whatId: null,
        postCreate: function () {
            this.inherited(arguments);

            if (this.whomId != null && this.whatId != null) {
                on(this, "click", lang.hitch(this, function (e) {
                    if (e != null) {
                        e.preventDefault();
                    }

                    topic.publish("/resourceMonitor/tell.someone", {
                        whom: registry.byId(this.whomId).get("value"),
                        what: registry.byId(this.whatId).get("value")
                    });
                }));
            }
        }
    });
});
