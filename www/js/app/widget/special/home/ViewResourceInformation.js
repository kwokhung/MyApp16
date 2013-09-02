define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/topic",
    "dojox/mobile/View"
], function (declare, lang, topic, View) {
    return declare("app.widget.special.home.ViewResourceInformation", [View], {
        resourceSubscriber: null,
        showDetails: function (data) {
            var enhancedData = {
                whom: data.who,
                what: {
                    toDo: "updateYourDetails"
                }
            };

            topic.publish("/resourceMonitor/tell.someone", enhancedData);
        },
        postCreate: function () {
            this.inherited(arguments);

            this.resourceSubscriber = topic.subscribe("/resourceInformation/show.details", lang.hitch(this, this.showDetails));
        },
        destroy: function () {
            this.inherited(arguments);

            if (this.resourceSubscriber != null) {
                this.resourceSubscriber.remove();
                this.resourceSubscriber = null;
            }
        }
    });
});
