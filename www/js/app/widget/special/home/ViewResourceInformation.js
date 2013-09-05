define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/View"
], function (declare, lang, array, topic, registry, View) {
    return declare("app.widget.special.home.ViewResourceInformation", [View], {
        subscribers: [],
        showDetails: function (data) {
            registry.byId("txtResourceName").set("value", "undefined");
            registry.byId("txtResourcePlatform").set("value", "undefined");
            registry.byId("txtResourceArch").set("value", "undefined");

            topic.publish("/resourceMonitor/tell.someone", {
                whom: data.who,
                what: {
                    toDo: "updateYourDetails"
                }
            });
        },
        renderDetails: function (data) {
            console.debug(data.what.details);
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
        },
        destroy: function () {
            this.inherited(arguments);

            array.forEach(this.subscribers, lang.hitch(this, function (item, index) {
                if (item != null) {
                    item.remove();
                    item = null;
                }
            }));
        }
    });
});
