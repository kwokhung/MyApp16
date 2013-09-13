define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "app/widget/_Subscriber"
], function (declare, lang, on, topic, _Subscriber) {
    return declare("app.widget._Slidable", [_Subscriber], {
        topicId: null,
        postCreate: function () {
            this.inherited(arguments);

            if (this.topicId != null) {
                on(this, "change", lang.hitch(this, function (newValue) {
                    topic.publish(this.topicId, { newValue: newValue });
                }));
            }
        }
    });
});
