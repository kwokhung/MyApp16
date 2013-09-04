define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/View"
], function (declare, lang, topic, registry, View) {
    return declare("app.widget.special.home.ViewResourceInformation", [View], {
        resourceSubscriber: null,
        resourceInformationSubscriber: null,
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

            this.resourceSubscriber = topic.subscribe("/resourceInformation/show.details", lang.hitch(this, this.showDetails));
            this.resourceInformationSubscriber = topic.subscribe("/resourceInformation/render.details", lang.hitch(this, this.renderDetails));
        },
        destroy: function () {
            this.inherited(arguments);

            if (this.resourceSubscriber != null) {
                this.resourceSubscriber.remove();
                this.resourceSubscriber = null;
            }

            if (this.resourceInformationSubscriber != null) {
                this.resourceInformationSubscriber.remove();
                this.resourceInformationSubscriber = null;
            }
        }
    });
});
