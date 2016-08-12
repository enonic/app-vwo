(function () {

    var ajax = function () {
        return {
            getRequest: function () {
                return new XMLHttpRequest();
            },
            send: function (url, callback, method, data, async) {
                if (async === undefined) {
                    async = true;
                }
                var xhr = ajax.getRequest();
                xhr.open(method, url, async);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        callback(xhr.responseText)
                    }
                };
                if (method == 'POST') {
                    xhr.setRequestHeader('Content-type', 'application/json');
                }
                xhr.send(data)
            },
            get: function (url, data, callback, async) {
                var query = [];
                for (var key in data) {
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                }
                ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
            },
            post: function (url, data, callback, async) {
                ajax.send(url, callback, 'POST', JSON.stringify(data), async)
            }
        };
    }();

    var templateHelper = function () {

        var campaignShortcutTemplate = '<div class="vwo-campaign">' +
                                           '<div class="vwo-campaign-info">' +
                                               '<div class="vwo-campaign-logo"></div>' +
                                               '<div class="vwo-campaign-title-info">' +
                                                   '<span class="vwo-campaign-name">${name}</span>' +
                                                   '<span class="vwo-campaign-url">${url}</span>' +
                                               '</div>' +
                                               '<div class="vwo-campaign-status ${status}">' +
                                                    '<i class="icon icon-status-${status}" title="${title-status}"></i>' +
                                                '</div>' +
                                           '</div>' +
                                       '</div>';

        return {
            makeCampaignShortcut: function (campaignInfo) {
                return campaignShortcutTemplate.replace("${name}", campaignInfo.name).
                        replace("${url}", campaignInfo.primaryUrl).
                        replace("${title-status}", campaignInfo.status.replace("_", " ")).
                        replace(/\$\{status\}/g, campaignInfo.status.toLowerCase());
            }
        };
    }();

    var vwo = function () {
        "use strict";

        return {
            listCampaigns: function () {
                var callback = function (data) {
                    var campaigns = JSON.parse(data).campaigns,
                        campaignShortcuts = "";
                    console.log(campaigns);
                    for(var i = 0; i < campaigns.length; i++) {
                        campaignShortcuts += templateHelper.makeCampaignShortcut(campaigns[i]);
                    }
                    if(campaigns.length > 0) {
                        document.getElementById("campaigns-list").innerHTML = campaignShortcuts;
                    }
                };

                var params = {
                    accountId: vwoConfig.accountId,
                    tokenId: vwoConfig.tokenId
                }
                ajax.post("/admin/rest/vwo/listCampaigns", params, callback);
                return this;
            }
        };
    }();

    testListCampaigns();

    function testListCampaigns() {
        vwo.listCampaigns();
    }
}());

function getSelectedCampaignType() {
    var radios = document.getElementsByName('campaignType'), campaignType = "ab";

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            campaignType = radios[i].value;
            break;
        }
    }

    return campaignType;
}

function openCampaignPage() {
    window.open("http://app.vwo.com/#/create/web/" + getSelectedCampaignType(), "_blank");
}