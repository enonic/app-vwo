var portal = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');

function handleGet(req) {
    var uid = req.url.split('?uid=')[1];
    var view = resolve('vwo-campaign.html');
    var siteConfig = portal.getSiteConfig();
    var completeSetup = siteConfig && !!siteConfig.accountId && !!siteConfig.domain;

    var params = {
        vwoCssUrl: portal.assetUrl({path: 'css/app-vwo.css'}),
        completeSetup: completeSetup,
        domain: siteConfig && !!siteConfig.domain ? siteConfig.domain : undefined,
        uid: uid
    }

    return {
        contentType: 'text/html',
        body: mustacheLib.render(view, params)
    };
}
exports.get = handleGet;
