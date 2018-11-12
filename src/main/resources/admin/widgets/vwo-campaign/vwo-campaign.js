var portalLib = require('/lib/xp/portal');
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

    var accountAndTokenArePresent = accountAndTokenArePresentInConfig(),
        domainIsValid = !!siteConfig && isValidDomain(siteConfig.domain),
        completeSetup = !!siteConfig && accountAndTokenArePresent && domainIsValid,
        errorMessage = "",
        pathToResourceOnSite = "",
        isPublished = false,
        isModified = false;

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
    else {
        var masterContent = contentLib.get({
            key: contentId,
            branch: 'master'
        });

        var draftContent = contentLib.get({
            key: contentId,
            branch: 'draft'
        });

        if (!!masterContent) {
            isPublished = true;
            isModified = (draftContent.modifiedTime !== masterContent.modifiedTime);
        }

        if (isSite(masterContent || draftContent)) {
            pathToResourceOnSite = "";
        } else {
            var site = contentLib.getSite({
                key: contentId
            });
            if (!!site) {
                pathToResourceOnSite = stripfOffSitePath(site._path, (masterContent || draftContent)._path);
            }
        }
    }

    var siteDomain;

    if (!!siteConfig && !!siteConfig.domain) {
        siteDomain = siteConfig.domain.trim();
        if (siteDomain.lastIndexOf('/') == (siteDomain.length-1)) {
            siteDomain = siteDomain.slice(0, -1);
        }
    }


    var params = {
        vwoCssUrl: portalLib.assetUrl({path: 'css/bundle.css'}),
        vwoJsUrl: portalLib.assetUrl({path: 'js/bundle.js'}),
        completeSetup: completeSetup,
        errorMessage: errorMessage,
        domain: siteDomain,
        contentPath: pathToResourceOnSite,
        uid: uid,
        isSite: pathToResourceOnSite.length == 0,
        isPublished: isPublished,
        isModified: isModified
    };

    return {
        contentType: 'text/html',
        body: mustacheLib.render(view, params)
    };
}

function isSite(content) {
    return (content.type == "portal:site");
}

function stripfOffSitePath(sitePath, contentPath) {
    return contentPath.replace(sitePath, "").trim();
}

function isValidDomain(domain) {
    return !!domain && (domain.startsWith("http://") || domain.startsWith("https://"));
}

function accountAndTokenArePresentInConfig() {
    return !!app.config["vwo.accountId"] && !!app.config["vwo.token"];
}

exports.get = handleGet;
