define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojox/mobile/Button",
    "app/util/app"
], function (declare, lang, on, Button, app) {
    return declare("app.widget.BtnGetImage", [Button], {
        postCreate: function () {
            this.inherited(arguments);

            on(this, "click", lang.hitch(this, function (e) {
                if (e != null) {
                    e.preventDefault();
                }

                if (app.navigator != null) {
                    if (typeof app.navigator.camera != "undefined") {
                        app.navigator.camera.getPicture(function (imageData) {
                            document.getElementById("imgPhoto").src = "data:image/jpeg;base64," + imageData;
                        }, function (message) {
                            app.generalHelper.alert("Error getting picture.", "Error Message: " + message);
                        }, {
                            quality: 50,
                            destinationType: Camera.DestinationType.DATA_URL/*FILE_URI*//*NATIVE_URI*/,
                            sourceType: Camera.PictureSourceType./*PHOTOLIBRARY*/CAMERA/*SAVEDPHOTOALBUM*/,
                            encodingType: Camera.EncodingType.JPEG/*PNG*/
                        });
                    }
                }
            }));
        }
    });
});
