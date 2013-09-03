define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData"
], function (declare, lang, array, topic, registry, RoundRectStoreList, StoredData) {
    return declare("app.widget.special.home.ListResourceMonitorMessage", [RoundRectStoreList, StoredData], {
        resourceUrl: null,
        who: "anonymous",
        socket: null,
        setResourceUrlSubscriber: null,
        iAmSubscriber: null,
        iAmNoMoreSubscriber: null,
        tellOtherSubscriber: null,
        tellSomeoneSubscriber: null,
        whoAreThereSubscriber: null,
        clearMessageSubscriber: null,
        gotoTopSubscriber: null,
        gotoBottomSubscriber: null,
        appendMessage: function (label, message) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            if (typeof message != "undefined" && (typeof message == "string" || (message != null && message.constructor == String))) {
                this.store.put({
                    "id": itemId,
                    "label": "<span style='color: blue;'>" + label + "</span><br />" + message.replace(/\n/g, "<br />"),
                    "variableHeight": true
                });
            }
            else {
                this.store.put({
                    "id": itemId,
                    "label": "<span style='color: blue;'>" + label + "</span><br />" + message,
                    "variableHeight": true
                });
            }

            this.getParent().scrollIntoView(registry.byId(itemId).domNode, false);
        },
        logMessage: function (data) {
            this.appendMessage("System", data.message);
        },
        handleMessage: function () {
            var socket = this.socket;

            socket.on("connecting", lang.hitch(this, function () {
                this.appendMessage("System", "connecting");
            }));

            socket.on("connect", lang.hitch(this, function () {
                this.appendMessage("System", "connect");

                socket.on("heartbeat", lang.hitch(this, function (data) {
                    this.appendMessage("heartbeat", data.when);

                    socket.emit("heartbeat", {
                        who: this.who,
                        when: new Date().getTime()
                    }, lang.hitch(this, this.logMessage));
                }));

                socket.on("you.are", lang.hitch(this, function (data) {
                    this.appendMessage("you.are", data.who);
                    this.whoAreThere();
                }));

                socket.on("you.are.no.more", lang.hitch(this, function (data) {
                    this.appendMessage("you.are.no.more", data.who);
                    this.whoAreThere();
                }));

                socket.on("he.is", lang.hitch(this, function (data) {
                    this.appendMessage("he.is", data.who);
                    this.whoAreThere();
                }));

                socket.on("he.is.no.more", lang.hitch(this, function (data) {
                    this.appendMessage("he.is.no.more", data.who);
                    this.whoAreThere();
                }));

                socket.on("there.are", lang.hitch(this, function (data) {
                    array.forEach(data.who, lang.hitch(this, function (item, index) {
                        this.appendMessage("there.are", item.who);
                    }));

                    topic.publish("/resourceList/there.are", data.who);
                }));

                socket.on("someone.said", lang.hitch(this, function (data) {
                    this.appendMessage("someone.said", data.what + " by " + data.who);

                    topic.publish("/messageList/someone.said", data);

                    if (typeof data.what.toDo != "undefined" && data.what.toDo != null) {
                        switch (data.what.toDo) {
                            case "draw":
                                topic.publish("/canvas/draw", data);

                                break;

                            case "updateYourDetails":
                                var enhancedData = {
                                    whom: data.who,
                                    what: {
                                        toDo: "updateHisDetails",
                                        name: this.who
                                    }
                                };

                                this.tellSomeone(enhancedData);

                                break;

                            case "updateHisDetails":
                                registry.byId("txtResourceName").set("value", data.what.name);
                                registry.byId("txtResourcePlatform").set("value", data.what.platform);
                                registry.byId("txtResourceArch").set("value", data.what.arch);

                                break;
                        }
                    }
                }));

                socket.on("someone.joined", lang.hitch(this, function (data) {
                    this.appendMessage("someone.joined", data.who);
                }));

                socket.on("someone.left", lang.hitch(this, function (data) {
                    this.appendMessage("someone.left", data.who);
                }));

                socket.on("someone.beat", lang.hitch(this, function (data) {
                    this.appendMessage("someone.beat", data.when + " by " + data.who);

                    topic.publish("/resourceList/someone.beat", data);
                }));

                this.iAm();
            }));

            socket.on("connect_failed", lang.hitch(this, function (e) {
                this.appendMessage("System", (e ? e.type : "connect_failed"));
            }));

            socket.on("message", lang.hitch(this, function (message, callback) {
                this.appendMessage("System", message);
            }));

            socket.on("disconnect", lang.hitch(this, function () {
                this.appendMessage("disconnect", "disconnect");
            }));

            socket.on("reconnecting", lang.hitch(this, function () {
                this.appendMessage("System", "reconnecting");
            }));

            socket.on("reconnect", lang.hitch(this, function () {
                this.appendMessage("System", "reconnect");
            }));

            socket.on("reconnect_failed", lang.hitch(this, function () {
                this.appendMessage("System", (e ? e.type : "reconnect_failed"));
            }));

            socket.on("error", lang.hitch(this, function (e) {
                this.appendMessage("System", (e ? e.type : "unknown error"));
            }));
        },
        setResourceUrl: function (resourceUrl) {
            this.resourceUrl = resourceUrl;
            this.socket = io.connect(this.resourceUrl, { "force new connection": false });

            this.handleMessage();
        },
        iAm: function (data) {
            if (typeof data != "undefined" && typeof data.who != "undefined" && data.who != null && data.who != "") {
                if (this.socket != null) {
                    this.socket.emit("i.am", {
                        who: data.who,
                        when: new Date().getTime()
                    }, lang.hitch(this, this.logMessage));
                }

                this.who = data.who;
            }
            else {
                if (this.socket != null) {
                    this.socket.emit("i.am", {
                        who: this.who,
                        when: new Date().getTime()
                    }, lang.hitch(this, this.logMessage));
                }
            }
        },
        iAmNoMore: function (data) {
            if (typeof data != "undefined" && typeof data.who != "undefined" && data.who != null && data.who != "") {
                if (this.socket != null) {
                    this.socket.emit("i.am.no.more", {
                        who: data.who,
                        when: new Date().getTime()
                    }, lang.hitch(this, this.logMessage));
                }
            }
            else {
                if (this.socket != null) {
                    this.socket.emit("i.am.no.more", {
                        who: this.who,
                        when: new Date().getTime()
                    }, lang.hitch(this, this.logMessage));
                }
            }

            this.who = "anonymous";
        },
        tellOther: function (data) {
            if (this.socket != null) {
                var enhancedData = {
                    who: this.who,
                    what: data.what,
                    when: new Date().getTime()
                };

                this.socket.emit("tell.other", enhancedData, lang.hitch(this, this.logMessage));

                topic.publish("/messageList/someone.said", enhancedData);
            }
        },
        tellSomeone: function (data) {
            if (this.socket != null) {
                var enhancedData = {
                    who: this.who,
                    whom: data.whom,
                    what: data.what,
                    when: new Date().getTime()
                };

                this.socket.emit("tell.someone", enhancedData, lang.hitch(this, this.logMessage));

                topic.publish("/messageList/someone.said", enhancedData);
            }
        },
        whoAreThere: function () {
            if (this.socket != null) {
                this.socket.emit("who.are.there", null, lang.hitch(this, this.logMessage));
            }
        },
        whatAreSaid: function () {
            alert("whatAreSaid");
        },
        clearMessage: function () {
            array.forEach(this.store.query({}), lang.hitch(this, function (item, index) {
                this.store.remove(item.id);
            }));
        },
        gotoTop: function () {
            var topItem = registry.byId(this.id + "_" + (1));

            if (typeof topItem != "undefined" && topItem != null) {
                this.getParent().scrollIntoView(topItem.domNode, true);
            }
        },
        gotoBottom: function () {
            var bottomItem = registry.byId(this.id + "_" + (this.data.length));

            if (typeof bottomItem != "undefined" && bottomItem != null) {
                this.getParent().scrollIntoView(bottomItem.domNode, false);
            }
        },
        postCreate: function () {
            this.inherited(arguments);

            if (this.resourceUrl != null) {
                this.storeLabel = "Resource Monitor Message";
                this.setStore(this.store);

                //this.socket = io.connect(this.resourceUrl, { "force new connection": false });

                //this.handleMessage();

                this.setResourceUrlSubscriber = topic.subscribe("/resourceMonitor/set.resource.url", lang.hitch(this, this.setResourceUrl));
                this.iAmSubscriber = topic.subscribe("/resourceMonitor/i.am", lang.hitch(this, this.iAm));
                this.iAmNoMoreSubscriber = topic.subscribe("/resourceMonitor/i.am.no.more", lang.hitch(this, this.iAmNoMore));
                this.tellOtherSubscriber = topic.subscribe("/resourceMonitor/tell.other", lang.hitch(this, this.tellOther));
                this.tellSomeoneSubscriber = topic.subscribe("/resourceMonitor/tell.someone", lang.hitch(this, this.tellSomeone));
                this.whoAreThereSubscriber = topic.subscribe("/resourceMonitor/who.are.there", lang.hitch(this, this.whoAreThere));
                this.clearMessageSubscriber = topic.subscribe("/resourceMonitor/clear.message", lang.hitch(this, this.clearMessage));
                this.gotoTopSubscriber = topic.subscribe("/resourceMonitor/goto.top", lang.hitch(this, this.gotoTop));
                this.gotoBottomSubscriber = topic.subscribe("/resourceMonitor/goto.bottom", lang.hitch(this, this.gotoBottom));
            }
        },
        destroy: function () {
            this.inherited(arguments);

            if (this.setResourceUrlSubscriber != null) {
                this.setResourceUrlSubscriber.remove();
                this.setResourceUrlSubscriber = null;
            }

            if (this.iAmSubscriber != null) {
                this.iAmSubscriber.remove();
                this.iAmSubscriber = null;
            }

            if (this.iAmNoMoreSubscriber != null) {
                this.iAmNoMoreSubscriber.remove();
                this.iAmNoMoreSubscriber = null;
            }

            if (this.tellOtherSubscriber != null) {
                this.tellOtherSubscriber.remove();
                this.tellOtherSubscriber = null;
            }

            if (this.tellSomeoneSubscriber != null) {
                this.tellSomeoneSubscriber.remove();
                this.tellSomeoneSubscriber = null;
            }

            if (this.whoAreThereSubscriber != null) {
                this.whoAreThereSubscriber.remove();
                this.whoAreThereSubscriber = null;
            }

            if (this.clearMessageSubscriber != null) {
                this.clearMessageSubscriber.remove();
                this.clearMessageSubscriber = null;
            }

            if (this.gotoTopSubscriber != null) {
                this.gotoTopSubscriber.remove();
                this.gotoTopSubscriber = null;
            }

            if (this.gotoBottomSubscriber != null) {
                this.gotoBottomSubscriber.remove();
                this.gotoBottomSubscriber = null;
            }
        }
    });
});
