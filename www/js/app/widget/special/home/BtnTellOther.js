define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/Button"
], function (declare, lang, on, topic, registry, Button) {
    return declare("app.widget.special.home.BtnTellOther", [Button], {
        whatId: null,
        postCreate: function () {
            this.inherited(arguments);

            if (this.whatId != null) {
                on(this, "click", lang.hitch(this, function (e) {
                    if (e != null) {
                        e.preventDefault();
                    }

                    topic.publish("/resourceMonitor/tell.other", registry.byId(this.whatId).get("value"));
                }));
            }
        }
    });
});
