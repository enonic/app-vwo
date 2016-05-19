var portal = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');

function handleGet(req) {
    var uid = req.url.split('?uid=')[1];
    var view = resolve('vwo-campaign.html');
    var siteConfig = portal.getSiteConfig();
    var content = portal.getContent();
    var site = portal.getSite();
    var pageId = "";

    if (content.type.indexOf(":site") == -1 && !!site) {
        pageId = content._path.replace(site._path, "");
    }

    var params = {
        vwoCssUrl: portal.assetUrl({path: 'css/app-vwo.css'}),
        accountId: siteConfig && siteConfig.accountId ? siteConfig.accountId : "",
        uid: uid,
        pageId: pageId
    }

    return {
        contentType: 'text/html',
        body: mustacheLib.render(view, params)
    };
}
exports.get = handleGet;
