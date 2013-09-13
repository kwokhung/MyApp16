define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic",
    "app/widget/_Subscriber"
], function (declare, lang, on, topic, _Subscriber) {
    return declare("app.widget._Valuable", [_Subscriber], {
        setValueTopicId: null,
        setValue: function (data) {
            this.set("value", data.newValue);
        },
        postCreate: function () {
            this.inherited(arguments);

            if (this.setValueTopicId != null) {
                this.subscribers.push(topic.subscribe(this.setValueTopicId, lang.hitch(this, this.setValue)));
            }
        }
    });
});