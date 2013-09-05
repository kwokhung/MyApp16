define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/View",
    "app/widget/_Subscriber"
], function (declare, lang, topic, registry, View, _Subscriber) {
    return declare("app.widget.special.home.ViewResourceMonitor", [View, _Subscriber], {
        dummyLoad: function (data) {
            console.debug(data);
        },
        postCreate: function () {
            this.inherited(arguments);

            this.subscribers.push(topic.subscribe("/resourceMonitor/dummy.load", lang.hitch(this, this.dummyLoad)));
        }
    });
});
