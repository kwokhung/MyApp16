define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/Button"
], function (declare, lang, on, topic, registry, Button) {
    return declare("app.widget.special.home.BtnSetResourceUrl", [Button], {
        textId: null,
        postCreate: function () {
            this.inherited(arguments);

            if (this.textId != null) {
                on(this, "click", lang.hitch(this, function (e) {
                    if (e != null) {
                        e.preventDefault();
                    }

                    topic.publish("/resourceMonitor/set.resource.url", registry.byId(this.textId).get("value"));
                }));
            }
        }
    });
});