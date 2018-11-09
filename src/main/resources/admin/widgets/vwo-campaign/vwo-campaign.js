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

    if (isSite(content)) {
        pathToResourceOnSite = "";
    } else {
        var site = contentLib.getSite({
            key: contentId
        });
        if (!!site) {
            pathToResourceOnSite = stripfOffSitePath(site._path, content._path);
        }
    }

    var accountAndTokenArePresent = accountAndTokenArePresentInConfig(),
        domainIsValid = !!siteConfig && isValidDomain(siteConfig.domain),
        completeSetup = !!siteConfig && accountAndTokenArePresent && domainIsValid,
        errorMessage = "";

    if (!completeSetup) {
        if (!siteConfig) {
            errorMessage += "VWO app not added to the site";
        } else if (!accountAndTokenArePresent) {
            errorMessage = "Token or accountId not found in the VWO config";
        } else if (!siteConfig.domain) {
            errorMessage = "Domain name not found in the VWO config";
        } else if (!domainIsValid) {
            errorMessage = "Domain name in the VWO config should start with http:// or https:// (" + siteConfig.domain + ")";
        }
    }

    var params = {
        vwoCssUrl: portalLib.assetUrl({path: 'css/bundle.css'}),
        vwoJsUrl: portalLib.assetUrl({path: 'js/bundle.js'}),
        completeSetup: completeSetup,
        errorMessage: errorMessage,
        domain: !!siteConfig && !!siteConfig.domain ? siteConfig.domain : undefined,
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

function isValidDomain(domain) {
    return !!domain && (domain.startsWith("http://") || domain.startsWith("https://"));
}

function accountAndTokenArePresentInConfig() {
    return !!app.config["vwo.accountId"] && !!app.config["vwo.token"];
}

exports.get = handleGet;
