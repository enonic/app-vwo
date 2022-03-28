const contentLib = require('/lib/xp/content');
const contextLib = require('/lib/xp/context');

exports.getDomainFromConfig = function (contentId) {
    let domain = '';

    const siteConfig = contentLib.getSiteConfig({ // get nearest site config
        key: contentId,
        applicationKey: app.name
    });

    if (!!siteConfig && !!siteConfig.domain) {
        domain = siteConfig.domain.trim();
        if (domain.lastIndexOf('/') == (domain.length - 1)) {
            domain = domain.slice(0, -1);
        }
    }

    return domain;
}

exports.validate = function (contentId) {
    const siteConfig = contentLib.getSiteConfig({ // get nearest site config
        key: contentId,
        applicationKey: app.name
    });

    const isSiteContent = !!contentLib.getSite({key: contentId});

    const accountAndTokenArePresent = accountAndTokenArePresentInConfig(),
        domainIsValid = !!siteConfig && isValidDomain(siteConfig.domain),
        completeSetup = !!siteConfig && accountAndTokenArePresent && domainIsValid;

    if (completeSetup) {
        return '';
    }

    if (!isSiteContent) {
        return 'Content is not a site.';
    }

    if (!siteConfig) {
        return 'VWO app not added to the site';
    }

    if (!accountAndTokenArePresent) {
        return 'Token or accountId not found in the VWO config';
    }

    if (!siteConfig.domain) {
        return 'Domain name not found in the VWO config';
    }

    if (!domainIsValid) {
        return 'Domain name in the VWO config should start with http:// or https:// (' + siteConfig.domain + ')';
    }

    return '';
}

exports.getContentProperties = function(contentId) {
    const props = {
        published: false,
        modified: false,
        path: ''
    };

    contextLib.run({branch: 'master'}, function () {
        const masterContent = contentLib.get({
            key: contentId
        });

        contextLib.run({branch: 'draft'}, function () {
            const draftContent = contentLib.get({
                key: contentId
            });

            if (masterContent) {
                props.published = true;
                props.modified = (draftContent.modifiedTime !== masterContent.modifiedTime);
            }

            if (!isSite(masterContent || draftContent)) {
                const site = contentLib.getSite({
                    key: contentId
                });
                if (!!site) {
                    props.path = stripfOffSitePath(site._path, (masterContent || draftContent)._path);
                }
            }
        });
    });

    return props;
}

function isSite(content) {
    return content.type == "portal:site";
}

function stripfOffSitePath (sitePath, contentPath) {
    return contentPath.replace(sitePath, "").trim();
}

function isValidDomain (domain) {
    return !!domain && (domain.startsWith("http://") || domain.startsWith("https://"));
}

function accountAndTokenArePresentInConfig () {
    return !!app.config["vwo.accountId"] && !!app.config["vwo.token"];
}
