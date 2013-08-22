define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "dojox/mobile/Button"
], function (declare, lang, on, topic, Button) {
    return declare("app.widget.special.home.BtnWhoAreThere", [Button], {
        postCreate: function () {
            this.inherited(arguments);

            on(this, "click", lang.hitch(this, function (e) {
                if (e != null) {
                    e.preventDefault();
                }

                topic.publish("/resourceMonitor/who.are.there");
            }));
        }
    });
});
