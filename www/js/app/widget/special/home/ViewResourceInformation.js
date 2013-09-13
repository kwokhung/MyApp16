define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    //"dojo/number",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/View",
    "app/widget/_Subscriber"
], function (declare, lang, /*number, */topic, registry, View, _Subscriber) {
    return declare("app.widget.special.home.ViewResourceInformation", [View, _Subscriber], {
        who: null,
        resourceRefresh: null,
        resourceRefreshDuration: 1000,
        showDetails: function (data) {
            this.who = data.who;

            registry.byId("txtResourceName").set("value", "undefined");
            registry.byId("txtResourceComputerSystemName").set("value", "undefined");
            registry.byId("txtResourceComputerSystemDescription").set("value", "undefined");
            registry.byId("txtResourceComputerSystemDomain").set("value", "undefined");
            registry.byId("txtResourceComputerSystemManufacturer").set("value", "undefined");
            registry.byId("txtResourceComputerSystemSystemType").set("value", "undefined");
            registry.byId("txtResourceComputerSystemTotalPhysicalMemory").set("value", "undefined");
            registry.byId("txtResourceComputerSystemStatus").set("value", "undefined");
            registry.byId("txtResourceOperatingSystemCaption").set("value", "undefined");
            registry.byId("txtResourceOperatingSystemVersion").set("value", "undefined");
            registry.byId("txtResourceOperatingSystemCSDVersion").set("value", "undefined");
            registry.byId("txtResourceOperatingSystemOSArchitecture").set("value", "undefined");
            registry.byId("txtResourceOperatingSystemManufacturer").set("value", "undefined");
            registry.byId("txtResourceOperatingSystemFreePhysicalMemory").set("value", "undefined");
            registry.byId("txtResourceOperatingSystemFreeVirtualMemory").set("value", "undefined");
            registry.byId("txtResourceOperatingSystemLocalDateTime").set("value", "undefined");
            registry.byId("txtResourceOperatingSystemStatus").set("value", "undefined");

            topic.publish("/resourceDiskList/clear.message");
            topic.publish("/resourceProcessList/clear.message");
            topic.publish("/resourceServiceList/clear.message");

            topic.publish("/switch/resourceInformation/refresh/on");

            if (this.resourceRefresh != null) {
                clearInterval(this.resourceRefresh);
                this.resourceRefresh = null;
            }

            this.resourceRefresh = setInterval(lang.hitch(this, function () {
                topic.publish("/resourceMonitor/tell.someone", {
                    whom: this.who,
                    what: {
                        toDo: "updateYourDetails"
                    }
                });
            }), this.resourceRefreshDuration);
        },
        renderDetails: function (data) {
            registry.byId("txtResourceName").set("value", data.what.details.who);

            if (typeof data.what.details.computerSystem != "undefined" && data.what.details.computerSystem != null) {
                registry.byId("txtResourceComputerSystemName").set("value", data.what.details.computerSystem.name);
                registry.byId("txtResourceComputerSystemDescription").set("value", data.what.details.computerSystem.description);
                registry.byId("txtResourceComputerSystemDomain").set("value", data.what.details.computerSystem.domain);
                registry.byId("txtResourceComputerSystemManufacturer").set("value", data.what.details.computerSystem.manufacturer);
                registry.byId("txtResourceComputerSystemSystemType").set("value", data.what.details.computerSystem.systemType);
                //registry.byId("txtResourceComputerSystemTotalPhysicalMemory").set("value", number.format(data.what.details.computerSystem.totalPhysicalMemory / 1024 / 1024 / 1024, { pattern: "#,###.###" }) + " GB");
                registry.byId("txtResourceComputerSystemTotalPhysicalMemory").set("value", (data.what.details.computerSystem.totalPhysicalMemory / 1024 / 1024 / 1024).format("0,000.000") + " GB");
                registry.byId("txtResourceComputerSystemStatus").set("value", data.what.details.computerSystem.status);
                registry.byId("txtResourceOperatingSystemCaption").set("value", data.what.details.operatingSystem.caption);
                registry.byId("txtResourceOperatingSystemVersion").set("value", data.what.details.operatingSystem.version);
                registry.byId("txtResourceOperatingSystemCSDVersion").set("value", data.what.details.operatingSystem.csdVersion);
                registry.byId("txtResourceOperatingSystemOSArchitecture").set("value", data.what.details.operatingSystem.osArchitecture);
                registry.byId("txtResourceOperatingSystemManufacturer").set("value", data.what.details.operatingSystem.manufacturer);
                //registry.byId("txtResourceOperatingSystemFreePhysicalMemory").set("value", number.format(data.what.details.operatingSystem.freePhysicalMemory / 1024 / 1024, { pattern: "#,###.###" }) + " GB");
                registry.byId("txtResourceOperatingSystemFreePhysicalMemory").set("value", (data.what.details.operatingSystem.freePhysicalMemory / 1024 / 1024).format("0,000.000") + " GB");
                //registry.byId("txtResourceOperatingSystemFreeVirtualMemory").set("value", number.format(data.what.details.operatingSystem.freeVirtualMemory / 1024 / 1024, { pattern: "#,###.###" }) + " GB");
                registry.byId("txtResourceOperatingSystemFreeVirtualMemory").set("value", (data.what.details.operatingSystem.freeVirtualMemory / 1024 / 1024).format("0,000.000") + " GB");
                registry.byId("txtResourceOperatingSystemLocalDateTime").set("value", data.what.details.operatingSystem.localDateTime.dateFormat());
                registry.byId("txtResourceOperatingSystemStatus").set("value", data.what.details.operatingSystem.status);

                topic.publish("/resourceDiskList/there.are", data.what.details.disks);
                topic.publish("/resourceProcessList/there.are", data.what.details.processes);
                topic.publish("/resourceServiceList/there.are", data.what.details.services);
            }
        },
        refresh: function (data) {
            switch (data.newState) {
                case "on":
                    if (this.resourceRefresh != null) {
                        clearInterval(this.resourceRefresh);
                        this.resourceRefresh = null;
                    }

                    this.resourceRefresh = setInterval(lang.hitch(this, function () {
                        topic.publish("/resourceMonitor/tell.someone", {
                            whom: this.who,
                            what: {
                                toDo: "updateYourDetails"
                            }
                        });
                    }), this.resourceRefreshDuration);

                    break;

                case "off":
                    if (this.resourceRefresh != null) {
                        clearInterval(this.resourceRefresh);
                        this.resourceRefresh = null;
                    }

                    break;
            }
        },
        setRefreshDuration: function (data) {
            topic.publish("/switch/resourceInformation/refresh/off");
            this.resourceRefreshDuration = data.newValue * 1000;
        },
        postCreate: function () {
            this.inherited(arguments);

            this.subscribers.push(topic.subscribe("/resourceInformation/show.details", lang.hitch(this, this.showDetails)));
            this.subscribers.push(topic.subscribe("/resourceInformation/render.details", lang.hitch(this, this.renderDetails)));
            this.subscribers.push(topic.subscribe("/resourceInformation/refresh", lang.hitch(this, this.refresh)));
            this.subscribers.push(topic.subscribe("/resourceInformation/setRefreshDuration", lang.hitch(this, this.setRefreshDuration)));

            this.subscribers.push(topic.subscribe("/dojox/mobile/afterTransitionIn", lang.hitch(this, function (transitionView) {
                if (transitionView.id == this.id) {
                }
            })));

            this.subscribers.push(topic.subscribe("/dojox/mobile/afterTransitionOut", lang.hitch(this, function (transitionView) {
                if (transitionView.id == this.id) {
                    if (this.resourceRefresh != null) {
                        clearInterval(this.resourceRefresh);
                        this.resourceRefresh = null;
                    }
                }
            })));
        }
    });
});
