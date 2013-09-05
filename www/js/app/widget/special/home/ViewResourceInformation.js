define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/View",
    "app/widget/_Subscriber"
], function (declare, lang, topic, registry, View, _Subscriber) {
    return declare("app.widget.special.home.ViewResourceInformation", [View, _Subscriber], {
        showDetails: function (data) {
            registry.byId("txtResourceName").set("value", "undefined");
            registry.byId("txtResourcePlatform").set("value", "undefined");
            registry.byId("txtResourceArch").set("value", "undefined");

            topic.publish("/resourceDiskList/clear.message");
            topic.publish("/resourceProcessList/clear.message");

            topic.publish("/resourceMonitor/tell.someone", {
                whom: data.who,
                what: {
                    toDo: "updateYourDetails"
                }
            });
        },
        renderDetails: function (data) {
            registry.byId("txtResourceName").set("value", data.what.details.who);
            registry.byId("txtResourcePlatform").set("value", data.what.platform);
            registry.byId("txtResourceArch").set("value", data.what.arch);

            topic.publish("/resourceDiskList/there.are", data.what.details.disks);
            topic.publish("/resourceProcessList/there.are", data.what.details.processes);
        },
        postCreate: function () {
            this.inherited(arguments);

            this.subscribers.push(topic.subscribe("/resourceInformation/show.details", lang.hitch(this, this.showDetails)));
            this.subscribers.push(topic.subscribe("/resourceInformation/render.details", lang.hitch(this, this.renderDetails)));
        }
    });
});
