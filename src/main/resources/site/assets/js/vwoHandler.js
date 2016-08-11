var api = function () {

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

        var campaignShortcutTemplate = '<div class="vwo-campaign" id="vwo-campaign-${id}">' +
                                           '<div class="vwo-campaign-info">' +
                                               '<div class="vwo-campaign-logo campaign-logo-${type}"></div>' +
                                               '<div class="vwo-campaign-title">' +
                                                   '<span class="vwo-campaign-name">${name}</span>' +
                                                   '<span class="vwo-campaign-url">${url}</span>' +
                                               '</div>' +
                                               '<div class="vwo-campaign-status ${status}">' +
                                                    '<i class="icon icon-status-${status}" title="${title-status}"></i>' +
                                                '</div>' +
                                           '</div>' +
                                       '</div>',

            campaignDetailsShortcutTemplate = '<dl class="vwo-campaign-details" onclick="event.stopPropagation()" id="vwo-campaign-details-${id}">' +
                                                  '<dd class="label">Number of goals: </dd>' +
                                                  '<dt class="value">${goals}</dt>' +
                                                  '<dd class="label">Number of variations: </dd>' +
                                                  '<dt class="value">${variations}</dt>' +
                                                  '<dd class="label">% traffic: </dd>' +
                                                  '<dt class="value">${traffic}</dt>' +
                                                  '<dd class="label">Visitors: </dd>' +
                                                  '<dt class="value">${visitors}</dt>' +
                                                    '<button class="open-campaign-in-vwo-btn" onclick="api.vwo.openCampaignPage(${id})"><p>Open in VWO</p></button>' +
                                              '</dl>';
        return {
            makeCampaignShortcut: function (campaignInfo) {
                return campaignShortcutTemplate.
                        replace(/\$\{id\}/g, campaignInfo.id).
                        replace("${name}", campaignInfo.name).
                        replace("${type}", campaignInfo.type).
                        replace("${url}", campaignInfo.primaryUrl).
                        replace("${title-status}", campaignInfo.status.replace("_", " ")).
                        replace(/\$\{status\}/g, campaignInfo.status.toLowerCase());
            },
            makeCampaignDetailsShortcut: function (campaignDetails) {
                return campaignDetailsShortcutTemplate.
                    replace(/\$\{id\}/g, campaignDetails.id).
                    replace("${goals}", campaignDetails.goals.length).
                    replace("${variations}", campaignDetails.variations.length).
                    replace("${traffic}", campaignDetails.percentTraffic);
            }
        };
    }();

    var vwoService = function () {
        return {
            listCampaigns: function (listCampaignsCallback) {

                var callback = function (data) {
                    listCampaignsCallback(JSON.parse(data).campaigns);
                };

                var params = {
                    accountId: vwoConfig.accountId,
                    tokenId: vwoConfig.tokenId
                }
                ajax.post("/admin/rest/vwo/listCampaigns", params, callback);
                return this;
            },

            getCampaignDetails: function (campaignId, getCampaignDetailsCallback) {
                var callback = function (data) {
                    getCampaignDetailsCallback(JSON.parse(data).campaign);
                };

                var params = {
                    accountId: vwoConfig.accountId,
                    tokenId: vwoConfig.tokenId,
                    campaignId: campaignId
                }
                ajax.post("/admin/rest/vwo/getCampaignDetails", params, callback);
                return this;
            }
        };
    }();

    var vwo = function () {
        "use strict";

        var campaignDetailsStore = new Object();

        var toggleCampaignDetails = function(campaignId) {
            if(campaignDetailsStore.hasOwnProperty(campaignId)) {
                // just toggle
                var detailsEl = document.getElementById("vwo-campaign-details-" + campaignId);
                detailsEl.classList.toggle("hidden");
            } else {
                // get details, render and save
                vwo.getCampaignDetailsAndRender(campaignId);
            }
        }

        var bindToggleOnCampaignClick = function(campaigns) {
            for(var i = 0; i < campaigns.length; i++) {
                let campaignId = campaigns[i].id,
                    campaignElem = document.getElementById('vwo-campaign-' + campaignId);
                campaignElem.addEventListener("click", function () {
                    toggleCampaignDetails(campaignId);
                }, false);
            }
        }

        return {
            getCampaignsAndShow: function () {
                vwo.showMask();
                var callback = function (campaigns) {
                    var campaignShortcuts = "";
                    console.log(campaigns);
                    for(var i = 0; i < campaigns.length; i++) {
                        campaignShortcuts += templateHelper.makeCampaignShortcut(campaigns[i]);
                    }
                    if(campaigns.length > 0) {
                        document.getElementById("campaigns-list").innerHTML = campaignShortcuts;
                    }

                    vwo.hideMask();

                    bindToggleOnCampaignClick(campaigns);
                };

                vwoService.listCampaigns(callback);

                return this;
            },

            getCampaignDetailsAndRender: function (campaignId) {
                vwo.showMask();

                var callback = function (campaignDetails) {
                    console.log(campaignDetails);

                    var campaignDetailsHtml = templateHelper.makeCampaignDetailsShortcut(campaignDetails),
                        campaignElem = document.getElementById('vwo-campaign-' + campaignId);

                    campaignElem.insertAdjacentHTML('beforeend', campaignDetailsHtml);
                    var padding = 10,
                        detailsHeight = document.getElementById("vwo-campaign-details-" + campaignDetails.id).clientHeight - padding + "px";

                    campaignDetailsStore[campaignId] = detailsHeight;
                    vwo.hideMask();
                };

                vwoService.getCampaignDetails(campaignId, callback);

                return this;
            },

            showMask: function() {
                var detailsEl = document.getElementById("vwo-widget-loadmask");
                if(detailsEl != null) {
                    detailsEl.style.display = 'block';
                }
                return this;
            },

            hideMask: function() {
                var detailsEl = document.getElementById("vwo-widget-loadmask");
                detailsEl.style.display = 'none';
                return this;
            },

            openCampaignPage: function(campaignId) {
                window.open("http://app.vwo.com/#/campaign/" + campaignId + "/summary", "_blank");
            }
        };
    }();

    return {
        vwo: vwo
    }
}();

(function () {
    api.vwo.getCampaignsAndShow();
}());