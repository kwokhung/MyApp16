define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic"
], function (declare, lang, topic) {
    return declare("app.widget._ShowHideSubscriber", null, {
        showTopicId: null,
        hideTopicId: null,
        showTopicSubscriber: null,
        hideTopicSubscriber: null,
        postCreate: function () {
            this.inherited(arguments);

            if (this.showTopicId != null) {
                this.showTopicSubscriber = topic.subscribe(this.showTopicId, lang.hitch(this, this.show));
            }

            if (this.hideTopicId != null) {
                this.hideTopicSubscriber = topic.subscribe(this.hideTopicId, lang.hitch(this, this.hide));
            }
        },
        destroy: function () {
            this.inherited(arguments);

            if (this.showTopicSubscriber != null) {
                this.showTopicSubscriber.remove();
                this.showTopicSubscriber = null;
            }

            if (this.hideTopicSubscriber != null) {
                this.hideTopicSubscriber.remove();
                this.hideTopicSubscriber = null;
            }
        }
    });
});
