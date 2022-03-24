const portalLib = require('/lib/xp/portal');
const helper = require('/helper/helper');

function handleGet(req) {
    let contentId = req.params.contentId;

    if (!contentId) {
        return {
            status: 500,
            response: 'No content selected'
        };
    }

    const contentProperties = helper.getContentProperties(contentId);

    return {
        status: 200,
        contentType: 'application/json',
        body: {
            domain: helper.getDomainFromConfig(contentId),
            contentPath: contentProperties.path,
            isPublished: contentProperties.published,
            isModified: contentProperties.modified,
            contentServiceUrl: portalLib.serviceUrl({
                service: 'contentTree',
                params: {
                    contentId
                }
            })
        }
    };
}

exports.get = handleGet;
