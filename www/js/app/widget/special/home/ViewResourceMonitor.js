define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic",
    "dojox/mobile/View",
    "app/widget/_Subscriber"
], function (declare, lang, array, topic, View, _Subscriber) {
    return declare("app.widget.special.home.ViewResourceMonitor", [View, _Subscriber], {
        resourceUrl: null,
        who: "Resource Monitor",
        socket: null,
        appendMessage: function (data) {
            topic.publish("/resourceMonitorMessageList/resourceMonitor.said", data);
        },
        logMessage: function (data) {
            this.appendMessage({ who: "System", what: data.message });
        },
        handleMessage: function () {
            var socket = this.socket;

            socket.on("connecting", lang.hitch(this, function () {
                this.appendMessage({ who: "System", what: "connecting" });
            }));

            socket.on("connect", lang.hitch(this, function () {
                this.appendMessage({ who: "System", what: "connect" });

                socket.on("heartbeat", lang.hitch(this, function (data) {
                    this.appendMessage({ who: "heartbeat", what: data.when });

                    socket.emit("heartbeat", {
                        who: this.who,
                        when: new Date().getTime()
                    }, lang.hitch(this, this.logMessage));
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

                this.iAm();
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
        whatToDo: function (data) {
            switch (data.what.toDo) {
                case "draw":
                    topic.publish("/canvas/draw", data);

                    break;

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
            }
        },
        postCreate: function () {
            this.inherited(arguments);

            this.subscribers.push(topic.subscribe("/resourceMonitor/set.resource.url", lang.hitch(this, this.setResourceUrl)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/i.am", lang.hitch(this, this.iAm)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/i.am.no.more", lang.hitch(this, this.iAmNoMore)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/tell.other", lang.hitch(this, this.tellOther)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/tell.someone", lang.hitch(this, this.tellSomeone)));
            this.subscribers.push(topic.subscribe("/resourceMonitor/who.are.there", lang.hitch(this, this.whoAreThere)));
        }
    });
});
