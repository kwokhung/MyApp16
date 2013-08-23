define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/topic"
], function (declare, lang, on, topic) {
    return declare("app.widget._Publishable", null, {
        topicId: null,
        postCreate: function () {
            this.inherited(arguments);

            if (this.topicId != null) {
                on(this, "click", lang.hitch(this, function (e) {
                    if (e != null) {
                        e.preventDefault();
                    }

                    topic.publish(this.topicId);
                }));
            }
        }
    });
});
