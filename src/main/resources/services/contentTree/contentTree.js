var contentLib = require('/lib/xp/content');

function handleGet(req) {

    var contentId = req.params.contentId;

    if (!contentId) {

        return {
            status: 404,
            contentType: 'application/json',
            body: {
                status: 404,
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

    return contentLib.query({
        query: "_path LIKE '/content" + site._path + "/*'",
        start: 0,
        count: -1,
        sort: '_path ASC',
        branch: 'master'
    }).hits.map(function(content) {
        log.info(content._path);
        return {
            path: content._path.replace(site._path, ''),
            displayName: content.displayName
        };
    });
}

exports.get = handleGet;
