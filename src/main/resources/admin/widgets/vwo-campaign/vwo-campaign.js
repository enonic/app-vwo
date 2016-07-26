var portal = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var contentLib = require('/lib/xp/content');

function handleGet(req) {
    var uid = req.url.split('?uid=')[1];
    var view = resolve('vwo-campaign.html');
    var contentId = req.params.contentId;

    var siteConfig = contentLib.getSiteConfig({ // get nearest site config
        key: contentId,
        applicationKey: app.name
    });

    var completeSetup = !!siteConfig && !!siteConfig.accountId && !!siteConfig.domain;

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
