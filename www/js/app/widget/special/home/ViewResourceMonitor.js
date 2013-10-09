define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic",
    "dojox/mobile/View",
    "app/util/special/mobile/SimpleDialog",
    "app/util/app",
    "app/util/ConnectedResourceHelper",
    "app/util/ResourceHelper",
    "app/widget/_Subscriber"
], function (declare, lang, array, topic, View, Dialog, app, ConnectedResourceHelper, ResourceHelper, _Subscriber) {
    return declare("app.widget.special.home.ViewResourceMonitor", [View, _Subscriber], {
        resourceUrl: null,
        who: "anonymous",
        socket: null,
        connectedResourceHelper: null,
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

                this.connectedResourceHelper.onMessage();

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
        setResourceUrl: function (data) {
            this.resourceUrl = data.url;
            var parsedUrl = app.nwHelper.parseUrl(this.resourceUrl);
            this.socket = io.connect(parsedUrl.schemeName + "://" + parsedUrl.hostName + ":" + (typeof parsedUrl.port == "undefined" ? "80" : parsedUrl.port), { "force new connection": false });

            this.handleMessage();
        },
        iAm: function (data) {
            this.resourceHelper.handleIAm(data);
        },
        iAmNoMore: function (data) {
            this.resourceHelper.handleIAmNoMore(data);
        },
        heartbeat: function () {
            this.resourceHelper.handleHeartbeat();
        },
        tellOther: function (data) {
            var enhancedData = this.resourceHelper.handleTellOther(data);

            if (enhancedData != null) {
                topic.publish("/messageList/someone.said", enhancedData);
            }
        },
        tellSomeone: function (data) {
            var enhancedData = this.resourceHelper.handleTellSomeone(data);

            if (enhancedData != null) {
                topic.publish("/messageList/someone.said", enhancedData);
            }
        },
        whoAreThere: function () {
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

            this.connectedResourceHelper = new ConnectedResourceHelper({
                resourceMonitor: this
            });

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
                this.iAmNoMore({
                    whoAmI: this.who
                });
            }
        }
    });
});
