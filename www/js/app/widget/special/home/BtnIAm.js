define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/Button"
], function (declare, lang, on, topic, registry, Button) {
    return declare("app.widget.special.home.BtnIAm", [Button], {
        whoId: null,
        postCreate: function () {
            this.inherited(arguments);

            if (this.whoId != null) {
                on(this, "click", lang.hitch(this, function (e) {
                    if (e != null) {
                        e.preventDefault();
                    }

                    topic.publish("/resourceMonitor/i.am", {
                        whoAmI: registry.byId(this.whoId).get("value")
                    });
                    topic.publish("/resourceMonitor/who.are.there");
                }));
            }
        }
    });
});
