const contentLib = require('/lib/xp/content');
const helper = require("../../helper/helper");

function handleGet(req) {
    const contentId = req.params.contentId;

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
    const site = contentLib.getSite({
        key: contentId
    });

    const siteDomain = helper.getDomainFromConfig(contentId);

    const items =
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
