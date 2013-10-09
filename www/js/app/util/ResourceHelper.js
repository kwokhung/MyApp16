define([
    "dojo/_base/declare",
    "dojo/_base/lang"
], function (declare, lang) {
    return declare("app.util.ResourceHelper", null, {
        resourceMonitor: null,
        constructor: function (kwArgs) {
            lang.mixin(this, kwArgs);
        },
        handleIAm: function (data) {
            if (this.resourceMonitor.socket == null) {
                return null;
            }
            else {
                var enhancedData = null;

                if (typeof data != "undefined" && typeof data.whoAmI != "undefined" && data.whoAmI != null && data.whoAmI != "") {
                    enhancedData = {
                        who: this.resourceMonitor.who,
                        whoAmI: data.whoAmI,
                        when: new Date().yyyyMMddHHmmss()
                    };

                    this.resourceMonitor.socket.emit("resource:i.am", enhancedData, lang.hitch(this.resourceMonitor, function (result) {
                        if (result.status) {
                            this.logMessage(result);

                            this.who = data.whoAmI;
                        }
                        else {
                            this.logMessage(result);
                        }
                    }));
                }
                else {
                    enhancedData = {
                        who: this.resourceMonitor.who,
                        whoAmI: this.resourceMonitor.who,
                        when: new Date().yyyyMMddHHmmss()
                    };

                    this.resourceMonitor.socket.emit("resource:i.am", enhancedData, lang.hitch(this.resourceMonitor, this.resourceMonitor.logMessage));
                }

                return enhancedData;
            }
        },
        handleIAmNoMore: function (data) {
            if (this.resourceMonitor.socket == null) {
                return null;
            }
            else {
                var enhancedData = null;

                if (typeof data != "undefined" && typeof data.whoAmI != "undefined" && data.whoAmI != null && data.whoAmI != "") {
                    enhancedData = {
                        who: this.resourceMonitor.who,
                        whoAmI: data.whoAmI,
                        when: new Date().yyyyMMddHHmmss()
                    };

                    this.resourceMonitor.socket.emit("resource:i.am.no.more", enhancedData, lang.hitch(this.resourceMonitor, function (result) {
                        if (result.status) {
                            this.logMessage(result);

                            this.who = "anonymous";
                        }
                        else {
                            this.logMessage(result);
                        }
                    }));
                }
                else {
                    enhancedData = {
                        who: this.resourceMonitor.who,
                        whoAmI: this.resourceMonitor.who,
                        when: new Date().yyyyMMddHHmmss()
                    };

                    this.resourceMonitor.socket.emit("resource:i.am.no.more", enhancedData, lang.hitch(this.resourceMonitor, function (result) {
                        if (result.status) {
                            this.logMessage(result);

                            this.who = "anonymous";
                        }
                        else {
                            this.logMessage(result);
                        }
                    }));
                }

                return enhancedData;
            }
        },
        handleHeartbeat: function () {
            if (this.resourceMonitor.socket == null) {
                return null;
            }
            else {
                var enhancedData = {
                    who: this.resourceMonitor.who,
                    when: new Date().yyyyMMddHHmmss()
                };

                this.resourceMonitor.socket.emit("resource:heartbeat", enhancedData, lang.hitch(this.resourceMonitor, this.resourceMonitor.logMessage));

                return enhancedData;
            }
        },
        handleTellOther: function (data) {
            if (this.resourceMonitor.socket == null) {
                return null;
            }
            else {
                var enhancedData = {
                    who: this.resourceMonitor.who,
                    what: data.what,
                    when: new Date().yyyyMMddHHmmss()
                };

                this.resourceMonitor.socket.emit("resource:tell.other", enhancedData, lang.hitch(this.resourceMonitor, this.resourceMonitor.logMessage));

                return enhancedData;
            }
        },
        handleTellSomeone: function (data) {
            if (this.resourceMonitor.socket == null) {
                return null;
            }
            else {
                var enhancedData = {
                    who: this.resourceMonitor.who,
                    whom: data.whom,
                    what: data.what,
                    when: new Date().yyyyMMddHHmmss()
                };

                this.resourceMonitor.socket.emit("resource:tell.someone", enhancedData, lang.hitch(this.resourceMonitor, this.resourceMonitor.logMessage));

                return enhancedData;
            }
        },
        handleWhoAreThere: function () {
            if (this.resourceMonitor.socket == null) {
                return null;
            }
            else {
                var enhancedData = {
                    who: this.resourceMonitor.who,
                    when: new Date().yyyyMMddHHmmss()
                };

                this.resourceMonitor.socket.emit("resource:who.are.there", enhancedData, lang.hitch(this.resourceMonitor, this.resourceMonitor.logMessage));

                return enhancedData;
            }
        }
    });
});
