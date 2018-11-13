var contentLib = require('/lib/xp/content');

function handleGet(req) {

    var contentId = req.params.contentId;

    if (!contentId) {

        return {
            status: 500,
            contentType: 'application/json',
            body: {
                status: 500,
                error: 'Missing parameter contentId'
            }
        }
    }

    return {
        contentType: 'application/json',
        body: getItems(contentId)
    }
}

function getItems(contentId) {

    var site = contentLib.getSite({
        key: contentId
    });

    var siteConfig = contentLib.getSiteConfig({ // get nearest site config
        key: contentId,
        applicationKey: app.name
    });

    var siteDomain = '';
    if (!!siteConfig && !!siteConfig.domain) {
        siteDomain = siteConfig.domain.trim();
        if (siteDomain.lastIndexOf('/') == (siteDomain.length-1)) {
            siteDomain = siteDomain.slice(0, -1);
        }
    }

    var items =
        contentLib.query({
            query: "_path LIKE '/content" + site._path + "/*'",
            start: 0,
            count: -1,
            sort: '_path ASC',
            branch: 'master'
        }).hits.map(function(content) {
            return {
                path: siteDomain + content._path.replace(site._path, ''),
                displayName: content.displayName
            };
        });

    if (contentLib.get({ key: site._id, branch: 'master' })) {
        items.splice(0, 0, {
            path: siteDomain + '/',
            displayName: site.displayName
        });
    }

    return items;
}

exports.get = handleGet;
