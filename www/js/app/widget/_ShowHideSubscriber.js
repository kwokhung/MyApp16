define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/topic"
], function (declare, lang, array, topic) {
    return declare("app.widget._ShowHideSubscriber", null, {
        showTopicId: null,
        hideTopicId: null,
        subscribers: [],
        postCreate: function () {
            this.inherited(arguments);

            if (this.showTopicId != null) {
                this.subscribers.push(topic.subscribe(this.showTopicId, lang.hitch(this, this.show)));
            }

            if (this.hideTopicId != null) {
                this.subscribers.push(topic.subscribe(this.hideTopicId, lang.hitch(this, this.hide)));
            }
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
