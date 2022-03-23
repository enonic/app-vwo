const contentLib = require('/lib/xp/content');
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

    return {
        status: 200,
        contentType: 'application/json',
        body: {
            domain,
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
