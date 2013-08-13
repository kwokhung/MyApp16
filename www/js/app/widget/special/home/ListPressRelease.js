define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/string",
    "dojox/mobile/RoundRectStoreList",
    "app/util/StoredData",
    "app/util/app"
], function (declare, lang, array, string, RoundRectStoreList, StoredData, app) {
    return declare("app.widget.special.home.ListPressRelease", [RoundRectStoreList, StoredData], {
        resourceUrl: null,
        getPressRelease: function () {
            app.serviceHelper.requestGetTextServiceNoBlock(
                string.substitute("${resourceUrl}&languageDisplay=${languageDisplay}", {
                    resourceUrl: this.resourceUrl,
                    languageDisplay: app.language
                }),
                null,
                lang.hitch(this, function (response) {
                    array.forEach(this.store.query({}), lang.hitch(this, function (item, index) {
                        this.store.remove(item.id);
                    }));
                    array.forEach(response.content.data, lang.hitch(this, function (item, index) {
                        item.id = this.id + "_" + item.id;
                        item.variableHeight = true;
                        this.store.put(item);
                    }));
                })
            );
        },
        postCreate: function () {
            this.inherited(arguments);

            if (this.resourceUrl != null) {
                this.itemMap = { "headline": "label", "date": "rightText" };
                this.storeLabel = "Press Release";
                this.setStore(this.store);

                this.getPressRelease();
            }
        }
    });
});
