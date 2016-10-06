var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var contentLib = require('/lib/xp/content');

function handleGet(req) {
    var uid = req.url.split('?uid=')[1];
    var view = resolve('vwo-campaign.html');
    var contentId = req.params.contentId;

    var content = contentLib.get({
        key: contentId
    });

    var siteConfig = contentLib.getSiteConfig({ // get nearest site config
        key: contentId,
        applicationKey: app.name
    });

    var pathToResourceOnSite;

    if(isSite(content)) {
        pathToResourceOnSite = "";
    } else {
        var site = contentLib.getSite({
            key: contentId
        });
        pathToResourceOnSite = stripfOffSitePath(site._path, content._path);
    }

    var completeSetup = !!siteConfig && !!siteConfig.tokenId && !!siteConfig.domain;

    var params = {
        vwoCssUrl: portalLib.assetUrl({path: 'css/app-vwo.css'}),
        vwoJsUrl: portalLib.assetUrl({path: 'js/vwoHandler.js'}),
        jqueryMinJs: portalLib.assetUrl({path: 'js/jquery-2.0.3.min.js'}),
        completeSetup: completeSetup,
        domain: !!siteConfig && !!siteConfig.domain ? siteConfig.domain : undefined,
        accountId: !!siteConfig && !!siteConfig.accountId ? siteConfig.accountId : "current",
        tokenId: !!siteConfig && !!siteConfig.tokenId ? siteConfig.tokenId : undefined,
        contentPath: pathToResourceOnSite,
        uid: uid
    }

    return {
        contentType: 'text/html',
        body: mustacheLib.render(view, params)
    };
}

function isSite(content) {
    if (content.type == "portal:site") {
        return true;
    }

    return false;
}

function stripfOffSitePath(sitePath, contentPath) {
    return contentPath.replace(sitePath, "");
}

exports.get = handleGet;
