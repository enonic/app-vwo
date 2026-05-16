const portalLib = require('/lib/xp/portal');
const mustacheLib = require('/lib/mustache');
const staticLib = require('/lib/enonic/static');
const helper = require('/helper/helper');
const router = require('/lib/router')();

const STATIC_BASE_PATH = '/_static';

router.get('', function (req) {
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

    const baseAssetUrl = req.contextPath + STATIC_BASE_PATH;
    const errorMessage = helper.validate(contentId);

    if (errorMessage) {
        return {
            contentType: 'text/html',
            body: mustacheLib.render(resolve('vwo-error.html'), {
                vwoCssUrl: baseAssetUrl + '/css/bundle.css',
                widgetId: app.name,
                errorMessage
            })
        };
    }

    const contentProperties = helper.getContentProperties(contentId);

    const params = {
        vwoCssUrl: baseAssetUrl + '/css/bundle.css',
        vwoJsUrl: baseAssetUrl + '/js/bundle.js',
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
});

router.get(STATIC_BASE_PATH + '/{path:.*}', function (req) {
    return staticLib.requestHandler(req, {
        index: false,
        root: '/assets',
        relativePath: staticLib.mappedRelativePath(STATIC_BASE_PATH)
    });
});

exports.all = function (req) {
    return router.dispatch(req);
};
