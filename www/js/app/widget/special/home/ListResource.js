define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData"
], function (declare, lang, array, topic, RoundRectStoreList, StoredData) {
    return declare("app.widget.special.home.ListResource", [RoundRectStoreList, StoredData], {
        resourceSubscriber: null,
        resourceBeatSubscriber: null,
        appendMessage: function (data) {
            var itemCount = this.data.length;
            var itemId = this.id + "_" + (itemCount + 1);

            var whichDate = new Date(data.when);
            var when = whichDate.getFullYear() + '-' + (whichDate.getMonth() + 1) + '-' + whichDate.getDay() + ' ' + whichDate.getHours() + ':' + whichDate.getMinutes() + ':' + whichDate.getSeconds();

            this.store.put({
                "id": itemId,
                "who": data.who,
                "label": data.who + "<br />" + "<span style='color: blue;'>" + when + "</span>",
                "variableHeight": true
            });

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
            array.forEach(this.store.query({
                who: data.who
            }), lang.hitch(this, function (item, index) {
                item.label = data.who + "<br />" + "<span style='color: blue;'>" + dateLocaleUtils.format(new Date(data.when), {
                    selector: "date",
                    datePattern: "yyyy-MM-dd HH:mm:ss",
                    locale: "en"
                }) + "</span>";
                this.store.put(item);
            }));
        },
        postCreate: function () {
            this.inherited(arguments);

            this.storeLabel = "Resource";
            this.setStore(this.store);

            this.resourceSubscriber = topic.subscribe("/resourceList/there.are", lang.hitch(this, this.thereAre));
            this.resourceBeatSubscriber = topic.subscribe("/resourceList/someone.beat", lang.hitch(this, this.someoneBeat));
            topic.publish("/resourceMonitor/who.are.there");
        },
        destroy: function () {
            this.inherited(arguments);

            if (this.resourceSubscriber != null) {
                this.resourceSubscriber.remove();
                this.resourceSubscriber = null;
            }

            if (this.resourceBeatSubscriber != null) {
                this.resourceBeatSubscriber.remove();
                this.resourceBeatSubscriber = null;
            }
        }
    });
});
