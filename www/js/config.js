var dojoConfig = {
    selectorEngine: "lite",
    isDebug: true,
    parseOnLoad: false,
    async: true,
    hashPollFrequency: 100,
    packages: [{
        "name": "app",
        "location": "../app"
    }],
    locale: (location.search.match(/locale=([\w\-]+)/) ? RegExp.$1 : "en"),
    extraLocale: [
        "en",
        "zh",
        "zh-cn"
    ],
    dojoBlankHtmlUrl: "js/dojo/resources/blank.html"
};