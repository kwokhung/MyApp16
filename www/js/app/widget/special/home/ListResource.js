define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/on",
    "dojo/topic",
    "dijit/registry",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData",
    "app/widget/_Subscriber"
], function (declare, lang, array, on, topic, registry, RoundRectStoreList, StoredData, _Subscriber) {
    return declare("app.widget.special.home.ListResource", [RoundRectStoreList, StoredData, _Subscriber], {
        appendMessage: function (data) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            var date = new Date(data.when);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hh = date.getHours();
            var mm = date.getMinutes();
            var ss = date.getSeconds();

            var when = "" + year + "-" +
            (month < 10 ? "0" + month : month) + "-" +
            (day < 10 ? "0" + day : day) + " " +
            (hh < 10 ? "0" + hh : hh) + ":" +
            (mm < 10 ? "0" + mm : mm) + ":" +
            (ss < 10 ? "0" + ss : ss);

            this.store.put({
                "id": itemId,
                "who": data.who,
                "label": "<span style='color: blue;'>" + data.who + "</span><br />" + when,
                "moveTo": "#viewResourceInformation",
                "variableHeight": true
            });

            on(registry.byId(itemId), "click", lang.hitch(this, function (e) {
                if (e != null) {
                    e.preventDefault();
                }

                topic.publish("/resourceInformation/show.details", data);
            }));

            this.getParent().scrollIntoView(registry.byId(itemId).domNode);
        },
        thereAre: function (who) {
            array.forEach(this.store.query({}), lang.hitch(this, function (item, index) {
                this.store.remove(item.id);
            }));
            array.forEach(who, lang.hitch(this, function (item, index) {
                this.appendMessage(item);
            }));
        },
        someoneBeat: function (data) {
            var date = new Date(data.when);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hh = date.getHours();
            var mm = date.getMinutes();
            var ss = date.getSeconds();

            var when = "" + year + "-" +
            (month < 10 ? "0" + month : month) + "-" +
            (day < 10 ? "0" + day : day) + " " +
            (hh < 10 ? "0" + hh : hh) + ":" +
            (mm < 10 ? "0" + mm : mm) + ":" +
            (ss < 10 ? "0" + ss : ss);

            array.forEach(this.store.query({
                who: data.who
            }), lang.hitch(this, function (item, index) {
                item.label = "<span style='color: blue;'>" + data.who + "</span><br />" + when;
                this.store.put(item);
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

            this.storeLabel = "Resource";
            this.setStore(this.store);

            this.subscribers.push(topic.subscribe("/resourceList/there.are", lang.hitch(this, this.thereAre)));
            this.subscribers.push(topic.subscribe("/resourceList/someone.beat", lang.hitch(this, this.someoneBeat)));
            this.subscribers.push(topic.subscribe("/resourceList/goto.top", lang.hitch(this, this.gotoTop)));
            this.subscribers.push(topic.subscribe("/resourceList/goto.bottom", lang.hitch(this, this.gotoBottom)));

            topic.publish("/resourceMonitor/who.are.there");
        }
    });
});
