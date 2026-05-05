const portalLib = require('/lib/xp/portal');
const mustacheLib = require('/lib/mustache');
const helper = require('/helper/helper');

function handleGet(req) {
    let contentId = req.params.contentId;

    if (!contentId && portalLib.getContent()) {
        contentId = portalLib.getContent()._id;
    }

    if (!contentId) {
        return {
            contentType: 'text/html',
            body: '<widget class="error">No content selected</widget>'
        };
    }

    const errorMessage = helper.validate(contentId);

    if (errorMessage) {
        return {
            contentType: 'text/html',
            body: mustacheLib.render(resolve('vwo-error.html'), {
                vwoCssUrl: portalLib.assetUrl({path: 'css/bundle.css'}),
                widgetId: app.name,
                errorMessage
            })
        };
    }

    const contentProperties = helper.getContentProperties(contentId);

    const params = {
        vwoCssUrl: portalLib.assetUrl({path: 'css/bundle.css'}),
        vwoJsUrl: portalLib.assetUrl({path: 'js/bundle.js'}),
        configServiceUrl: portalLib.serviceUrl({
            service: 'config',
            params: {
                contentId: contentId
            }
        }),
        widgetId: app.name,
        isSite: contentProperties.path.length == 0,
        isPublished: contentProperties.published
    };

    const view = resolve('vwo-campaign.html');

    return {
        contentType: 'text/html',
        body: mustacheLib.render(view, params)
    };
}

exports.get = handleGet;
