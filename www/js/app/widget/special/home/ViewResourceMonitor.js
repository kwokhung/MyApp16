define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic",
    "dojox/mobile/View",
    "app/util/special/mobile/SimpleDialog",
    "app/util/app",
    "app/util/ResourceHelper",
    "app/widget/_Subscriber"
], function (declare, lang, array, topic, View, Dialog, app, ResourceHelper, _Subscriber) {
    return declare("app.widget.special.home.ViewResourceMonitor", [View, _Subscriber], {
        resourceUrl: null,
        who: "anonymous",
        socket: null,
        resourceHelper: null,
        appendMessage: function (data) {
            topic.publish("/resourceMonitorMessageList/resourceMonitor.said", data);
        },
        logMessage: function (result) {
            if (result.status) {
                this.appendMessage({ who: "System (Succeeded)", what: result.message });
            }
            else {
                this.appendMessage({ who: "System (Failed)", what: result.message });
                this._handleException(result.message);
            }
        },
        handleMessage: function () {
            var socket = this.socket;

            socket.on("connecting", lang.hitch(this, function () {
                this.appendMessage({ who: "System", what: "connecting" });
            }));

            socket.on("connect", lang.hitch(this, function () {
                this.appendMessage({ who: "System", what: "connect" });

                this.handleConnectMessage();

                this.iAmNoMore({
                    whoAmI: "Resource Monitor"
                });

                this.iAm({
                    whoAmI: "Resource Monitor"
                });
            }));

            socket.on("connect_failed", lang.hitch(this, function (e) {
                this.appendMessage({ who: "System", what: (e ? e.type : "connect_failed") });
            }));

            socket.on("message", lang.hitch(this, function (message, callback) {
                this.appendMessage({ who: "System", what: message });
            }));

            socket.on("disconnect", lang.hitch(this, function () {
                this.appendMessage({ who: "disconnect", what: "disconnect" });
            }));

            socket.on("reconnecting", lang.hitch(this, function () {
                this.appendMessage({ who: "System", what: "reconnecting" });
            }));

            socket.on("reconnect", lang.hitch(this, function () {
                this.appendMessage({ who: "System", what: "reconnect" });
            }));

            socket.on("reconnect_failed", lang.hitch(this, function () {
                this.appendMessage({ who: "System", what: (e ? e.type : "reconnect_failed") });
            }));

            socket.on("error", lang.hitch(this, function (e) {
                this.appendMessage({ who: "System", what: (e ? e.type : "unknown error") });
            }));
        },
        handleConnectMessage: function () {
            var socket = this.socket;

            socket.on("heartbeat", lang.hitch(this, function (data) {
                this.appendMessage({ who: "heartbeat", what: data.when });

                this.heartbeat();
            }));

            socket.on("you.are", lang.hitch(this, function (data) {
                this.appendMessage({ who: "you.are", what: data.who });
                this.whoAreThere();
            }));

            socket.on("you.are.no.more", lang.hitch(this, function (data) {
                this.appendMessage({ who: "you.are.no.more", what: data.who });
                this.whoAreThere();
            }));

            socket.on("he.is", lang.hitch(this, function (data) {
                this.appendMessage({ who: "he.is", what: data.who });
                this.whoAreThere();
            }));

            socket.on("he.is.no.more", lang.hitch(this, function (data) {
                this.appendMessage({ who: "he.is.no.more", what: data.who });
                this.whoAreThere();
            }));

            socket.on("there.are", lang.hitch(this, function (data) {
                array.forEach(data.who, lang.hitch(this, function (item, index) {
                    this.appendMessage({ who: "there.are", what: item.who });
                }));

                topic.publish("/resourceList/there.are", data.who);
            }));

            socket.on("someone.said", lang.hitch(this, function (data) {
                this.appendMessage({ who: "someone.said", what: data.what + " by " + data.who });

                topic.publish("/messageList/someone.said", data);

                if (typeof data.what.toDo != "undefined" && data.what.toDo != null) {
                    this.whatToDo(data);
                }
            }));

            socket.on("someone.joined", lang.hitch(this, function (data) {
                this.appendMessage({ who: "someone.joined", what: data.who });
            }));

            socket.on("someone.left", lang.hitch(this, function (data) {
                this.appendMessage({ who: "someone.left", what: data.who });
            }));

            socket.on("someone.beat", lang.hitch(this, function (data) {
                this.appendMessage({ who: "someone.beat", what: data.when + " by " + data.who });

                topic.publish("/resourceList/someone.beat", data);
            }));
        },
        setResourceUrl: function (data) {
            this.resourceUrl = data.url;
            var parsedUrl = app.nwHelper.parseUrl(this.resourceUrl);
            this.socket = io.connect(parsedUrl.schemeName + "://" + parsedUrl.hostName + ":" + (typeof parsedUrl.port == "undefined" ? "80" : parsedUrl.port), { "force new connection": false });

            this.handleMessage();
        },
        iAm: function (data) {
            /*if (typeof data != "undefined" && typeof data.whoAmI != "undefined" && data.whoAmI != null && data.whoAmI != "") {
                if (this.socket != null) {
                    this.socket.emit("resource:i.am", {
                        who: this.who,
                        whoAmI: data.whoAmI,
                        when: new Date().yyyyMMddHHmmss()
                    }, lang.hitch(this, function (result) {
                        if (result.status) {
                            this.logMessage(result);

                            this.who = data.whoAmI;
                        }
                        else {
                            this.logMessage(result);
                        }
                    }));
                }
            }
            else {
                if (this.socket != null) {
                    this.socket.emit("resource:i.am", {
                        who: this.who,
                        whoAmI: this.who,
                        when: new Date().yyyyMMddHHmmss()
                    }, lang.hitch(this, this.logMessage));
                }
            }*/
            this.resourceHelper.handleIAm(data);
        },
        iAmNoMore: function (data) {
            /*if (typeof data != "undefined" && typeof data.whoAmI != "undefined" && data.whoAmI != null && data.whoAmI != "") {
                if (this.socket != null) {
                    this.socket.emit("resource:i.am.no.more", {
                        who: this.who,
                        whoAmI: data.whoAmI,
                        when: new Date().yyyyMMddHHmmss()
                    }, lang.hitch(this, function (result) {
                        if (result.status) {
                            this.logMessage(result);

                            this.who = "anonymous";
                        }
                        else {
                            this.logMessage(result);
                        }
                    }));
                }
            }
            else {
                if (this.socket != null) {
                    this.socket.emit("resource:i.am.no.more", {
                        who: this.who,
                        whoAmI: this.who,
                        when: new Date().yyyyMMddHHmmss()
                    }, lang.hitch(this, function (result) {
                        if (result.status) {
                            this.logMessage(result);

                            this.who = "anonymous";
                        }
                        else {
                            this.logMessage(result);
                        }
                    }));
                }
            }*/
            this.resourceHelper.handleIAmNoMore(data);
        },
        heartbeat: function () {
            /*if (this.socket != null) {
                this.socket.emit("resource:heartbeat", {
                    who: this.who,
                    when: new Date().yyyyMMddHHmmss()
                }, lang.hitch(this, this.logMessage));
            }*/
            this.resourceHelper.handleHeartbeat();
        },
        tellOther: function (data) {
            /*if (this.socket != null) {
                var enhancedData = {
                    who: this.who,
                    what: data.what,
                    when: new Date().yyyyMMddHHmmss()
                };

                this.socket.emit("resource:tell.other", enhancedData, lang.hitch(this, this.logMessage));

                topic.publish("/messageList/someone.said", enhancedData);
            }*/
            var enhancedData = this.resourceHelper.handleTellOther(data);

            if (this.socket != null) {
                topic.publish("/messageList/someone.said", enhancedData);
            }
        },
        tellSomeone: function (data) {
            /*if (this.socket != null) {
                var enhancedData = {
                    who: this.who,
                    whom: data.whom,
                    what: data.what,
                    when: new Date().yyyyMMddHHmmss()
                };

                this.socket.emit("resource:tell.someone", enhancedData, lang.hitch(this, this.logMessage));

                topic.publish("/messageList/someone.said", enhancedData);
            }*/
            var enhancedData = this.resourceHelper.handleTellSomeone(data);

            if (this.socket != null) {
                topic.publish("/messageList/someone.said", enhancedData);
            }
        },
        whoAreThere: function () {
            /*if (this.socket != null) {
                this.socket.emit("resource:who.are.there", {
                    who: this.who,
                    when: new Date().yyyyMMddHHmmss()
                }, lang.hitch(this, this.logMessage));
            }*/
            this.resourceHelper.handleWhoAreThere();
        },
        whatToDo: function (data) {
            switch (data.what.toDo) {
                case "updateYourDetails":
                    this.tellSomeone({
                        whom: data.who,
                        what: {
                            toDo: "updateHisDetails",
                            details: {
                                who: this.who
                            }
                        }
                    });

                    break;

                case "updateHisDetails":
                    topic.publish("/resourceInformation/render.details", data);

                    break;

                case "drawCanvas":
                    topic.publish("/canvas/draw", data);

                    break;

                case "displayPhoto":
                    topic.publish("/photo/display", data);

                    break;
            }
        },
        _handleException: function (ex) {
            var exceptionErrorDialog = new Dialog({
                title: app.bundle.MsgSystemError,
                content: ex.toString(),
                progressable: false
            });

            exceptionErrorDialog.show();
        },
        postCreate: function () {
            this.inherited(arguments);

            this.resourceHelper = new ResourceHelper({
                resourceMonitor: this
            });

            this.subscribers.push(topic.subscribe("/resourceMonitor/set.resource.url", lang.hitch(this, this.setResourceUrl)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/i.am", lang.hitch(this, this.iAm)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/i.am.no.more", lang.hitch(this, this.iAmNoMore)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/heartbeat", lang.hitch(this, this.heartbeat)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/tell.other", lang.hitch(this, this.tellOther)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/tell.someone", lang.hitch(this, this.tellSomeone)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/who.are.there", lang.hitch(this, this.whoAreThere)));
        },
        destroy: function () {
            this.inherited(arguments);

            if (this.who != "anonymous") {
                iAmNoMore({
                    whoAmI: this.who
                });
            }
        }
    });
});
