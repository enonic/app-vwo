var vwo = function () {

    var ajax = function () {
        return {
            getRequest: function () {
                return new XMLHttpRequest();
            },
            send: function (url, callback, errorCallback, method, data, async) {
                if (async === undefined) {
                    async = true;
                }
                var xhr = ajax.getRequest();
                xhr.open(method, url, async);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if(xhr.status === 200) {
                            callback(xhr.responseText);
                        } else {
                            if (errorCallback) {
                                errorCallback(xhr.responseText);
                            }
                            if (xhr.responseText) {
                                if (api.notify.NotifyManager) {
                                    api.notify.NotifyManager.get().showError(xhr.responseText);
                                } else {
                                    console.log(xhr.responseText);
                                }
                            }
                        }
                    }
                };
                if (method == 'POST') {
                    xhr.setRequestHeader('Content-type', 'application/json');
                }
                xhr.send(data)
            },
            get: function (url, data, callback, errorCallback, async) {
                var query = [];
                for (var key in data) {
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                }
                ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, errorCallback, 'GET', null, async)
            },
            post: function (url, data, callback, errorCallback, async) {
                ajax.send(url, callback, errorCallback, 'POST', JSON.stringify(data), async)
            }
        };
    }();

    var templateHelper = function () {

        var campaignShortcutTemplate = '<div class="vwo-campaign" id="vwo-campaign-${id}">' +
                                           '<div class="vwo-campaign-info" id="vwo-campaign-info-${id}">' +
                                               '<div class="vwo-campaign-logo campaign-logo-${type}"></div>' +
                                               '<div class="vwo-campaign-title">' +
                                                   '<span class="vwo-campaign-name" title="${name}">${name}</span>' +
                                                   '<span class="vwo-campaign-url" title="${url}">${url}</span>' +
                                               '</div>' +
                                               '<div class="vwo-campaign-status ${status}" id="vwo-campaign-status-${id}">' +
                                                    '<i class="icon icon-status-${status}" title="${title-status}"></i>' +
                                                '</div>' +
                                           '</div>' +
                                       '</div>',

            campaignDetailsShortcutTemplate = '<div class="vwo-campaign-details" onclick="event.stopPropagation()" id="vwo-campaign-details-${id}">' +
                                                  '<div class="update-campaign-buttons-row">' +
                                                      '<div class="btn start-btn ${start-btn-disabled}" id="start-btn-${id}"><i class="icon" title="Start"></i><span class="label">Start</span></div>' +
                                                      '<div class="btn pause-btn ${pause-btn-disabled}" id="pause-btn-${id}"><i class="icon" title="Pause"></i><span class="label">Pause</span></div>' +
                                                      '<div class="btn archive-btn ${archive-btn-disabled}" id="archive-btn-${id}"><i class="icon" title="Archive"></i><span class="label">Archive</span></div>' +
                                                      '<div class="btn delete-btn ${delete-btn-disabled}" id="delete-btn-${id}"><i class="icon" title="Delete"></i><span class="label">Delete</span></div>' +
                                                  '</div>' +
                                                  '<table>' +
                                                      '<tr class="value">' +
                                                      '<td>${goals}</td><td>${variations}</td>' +
                                                      '</tr>' +
                                                      '<tr class="label">' +
                                                      '<td>Goals</td><td>Variations</td>' +
                                                      '</tr>' +
                                                      '<tr class="value">' +
                                                      '<td>${visitors}</td><td>${traffic}%</td>' +
                                                      '</tr>' +
                                                      '<tr class="label">' +
                                                      '<td>Visitors</td><td>Traffic</td>' +
                                                      '</tr>' +
                                                  '</table>' +
                                                  '<button class="open-campaign-in-vwo-btn" onclick="vwo.openCampaignPage(${id})"><p>Open in VWO</p></button>' +
                                              '</div>',

            campaignStatusIconTemplate = '<div class="vwo-campaign-status ${status}" id="vwo-campaign-status-${id}">' +
                                            '<i class="icon icon-status-${status}" title="${title-status}"></i>' +
                                         '</div>';
        return {
            makeCampaignShortcut: function (campaignInfo) {
                return campaignShortcutTemplate.
                        replace(/\$\{id\}/g, campaignInfo.id).
                        replace(/\$\{name\}/g, campaignInfo.name).
                        replace("${type}", campaignInfo.type).
                        replace(/\$\{url\}/g, campaignInfo.primaryUrl).
                        replace("${title-status}", campaignInfo.status.replace("_", " ")).
                        replace(/\$\{status\}/g, campaignInfo.status.toLowerCase());
            },
            makeCampaignDetailsShortcut: function (campaignDetails) {
                var status = campaignDetails.status.toLowerCase();
                return campaignDetailsShortcutTemplate.
                    replace(/\$\{id\}/g, campaignDetails.id).
                    replace("${goals}", campaignDetails.goals.length).
                    replace("${variations}", campaignDetails.variations.length).
                    replace("${traffic}", campaignDetails.percentTraffic).
                    replace("${visitors}", campaignDetails.thresholds.visitors).
                    replace("${start-btn-disabled}", status == 'running' ? 'disabled' : "").
                    replace("${pause-btn-disabled}", status == 'paused' ? 'disabled' : "").
                    replace("${archive-btn-disabled}", status == 'trashed' ? 'disabled' : "").
                    replace("${delete-btn-disabled}", status == 'stopped' ? 'disabled' : "");
            },
            makeCampaignStatusIconShortcut: function (id, status) {
                return campaignStatusIconTemplate.
                    replace(/\$\{id\}/g, id).
                    replace("${title-status}", status.replace("_", " ")).
                    replace(/\$\{status\}/g, status.toLowerCase());
            }
        };
    }();

    var vwoService = function () {
        return {
            listCampaigns: function (listCampaignsCallback, errorCallback) {

                var callback = function (data) {
                    if(data != null && data.length > 0) {
                        listCampaignsCallback(JSON.parse(data).campaigns);
                    } else {
                        errorCallback();
                    }
                };

                var params = {
                    accountId: vwoConfig.accountId,
                    tokenId: vwoConfig.tokenId
                }
                ajax.post("/admin/rest/vwo/listCampaigns", params, callback, errorCallback);
                return this;
            },

            getCampaignDetails: function (campaignId, getCampaignDetailsCallback, errorCallback) {
                var callback = function (data) {
                    if(data != null && data.length > 0) {
                        getCampaignDetailsCallback(JSON.parse(data).campaign);
                    } else {
                        errorCallback();
                    }
                };

                var params = {
                    accountId: vwoConfig.accountId,
                    tokenId: vwoConfig.tokenId,
                    campaignId: campaignId
                }
                ajax.post("/admin/rest/vwo/getCampaignDetails", params, callback, errorCallback);
                return this;
            },

            updateCampaignStatus: function (campaignId, status, updateCampaignStatusCallback, errorCallback) {
                var callback = function (data) {
                    if(data != null && data.length > 0) {
                        updateCampaignStatusCallback(JSON.parse(data).result);
                    } else {
                        errorCallback();
                    }
                };

                var params = {
                    accountId: vwoConfig.accountId,
                    tokenId: vwoConfig.tokenId,
                    campaignId: campaignId,
                    status: status
                }
                ajax.post("/admin/rest/vwo/updateCampaignStatus", params, callback, errorCallback);
                return this;
            },

            defaultServiceErrorCallback: function() {
                vwo.hideMask();
            }
        };
    }();

    var vwoCampaignManager = function () {

        var bindToggleOnCampaignClick = function(campaigns) {
            for(var i = 0; i < campaigns.length; i++) {
                let campaignId = campaigns[i].id,
                    campaignElem = document.getElementById('vwo-campaign-' + campaignId);
                campaignElem.addEventListener("click", function () {
                    vwoCampaignDetailsManager.toggleCampaignDetails(campaignId);
                }, false);
            }
        }

        return {
            getCampaignsAndShow: function () {
                vwo.showMask();
                var callback = function (campaigns) {
                    var campaignShortcuts = "";
                    for(var i = 0; i < campaigns.length; i++) {
                        campaignShortcuts += templateHelper.makeCampaignShortcut(campaigns[i]);
                    }
                    if(campaigns.length > 0) {
                        document.getElementById("campaigns-list").innerHTML = campaignShortcuts;
                    }

                    vwo.hideMask();

                    bindToggleOnCampaignClick(campaigns);
                };

                vwoService.listCampaigns(callback, vwoService.defaultServiceErrorCallback);

                return this;
            }
        };
    }();

    var vwoCampaignDetailsManager = function () {

        var campaignDetailsStore = new Object();

        var getCampaignDetailsAndRender = function (campaignId) {
            vwo.showMask();

            var getCampaignDetailsCallback = function (campaignDetails) {
                var campaignDetailsHtml = templateHelper.makeCampaignDetailsShortcut(campaignDetails),
                    campaignElem = document.getElementById('vwo-campaign-' + campaignId);

                campaignElem.insertAdjacentHTML('beforeend', campaignDetailsHtml);

                campaignDetailsStore[campaignId] = 1;
                handleUpdateButtonsClick(campaignId);
                vwo.hideMask();
            };

            vwoService.getCampaignDetails(campaignId, getCampaignDetailsCallback, vwoService.defaultServiceErrorCallback);
        }

        var handleUpdateButtonsClick = function(campaignId) {
            addClickListenerToButton(getStartBtn(campaignId), campaignId, "RUNNING");
            addClickListenerToButton(getPauseBtn(campaignId), campaignId, "PAUSED");
            addClickListenerToButton(getArchiveBtn(campaignId), campaignId, "STOPPED");
            addClickListenerToButton(getDeleteBtn(campaignId), campaignId, "TRASHED");
        }

        var addClickListenerToButton = function(btnElement, campaignId, newStatus) {

            var updateCampaignStatusCallback = function (updateResult) {
                vwo.hideMask();
                var ids = updateResult.ids; // ids of campaigns that got updated, we expect only one to come
                for(let i = 0; i < ids.length; i++) {
                    updateCampaignStatusView(ids[i], updateResult.status)
                    updateStatusButtons(ids[i], updateResult.status.toLowerCase());
                }
            };

            btnElement.addEventListener("click", function () {
                vwo.showMask();
                vwoService.updateCampaignStatus(campaignId, newStatus, updateCampaignStatusCallback, vwoService.defaultServiceErrorCallback);
            }, false);
        }

        var getStartBtn = function (campaignId) {
                return document.getElementById('start-btn-' + campaignId);
            },
            getPauseBtn = function (campaignId) {
                return document.getElementById('pause-btn-' + campaignId);
            },
            getArchiveBtn = function (campaignId) {
                return document.getElementById('archive-btn-' + campaignId);
            },
            getDeleteBtn = function (campaignId) {
                return document.getElementById('delete-btn-' + campaignId);
            }

        var updateStatusButtons = function (campaignId, status) {
            getStartBtn(campaignId).classList.toggle("disabled", status === "running");
            getPauseBtn(campaignId).classList.toggle("disabled", status === "paused" || status === "stopped" || status === "trashed");
            getArchiveBtn(campaignId).classList.toggle("disabled", status === "stopped" || status === "trashed");
            getDeleteBtn(campaignId).classList.toggle("disabled", status === "stopped" || status === "trashed");
        }

        var updateCampaignStatusView = function(id, status) {
            var elem = document.getElementById("vwo-campaign-status-" + id);
            elem.parentNode.removeChild(elem);

            var infoElem = document.getElementById("vwo-campaign-info-" + id);
            infoElem.insertAdjacentHTML('beforeend', templateHelper.makeCampaignStatusIconShortcut(id, status));
        }

        var toggleCampaignDetail = function(campaignId) {
            document.getElementById("vwo-campaign-" + campaignId).classList.toggle("expanded");
            var detailsEl = document.getElementById("vwo-campaign-details-" + campaignId);
            detailsEl.classList.toggle("hidden");
        }


        return {
            toggleCampaignDetails: function(campaignId) {
                var expandedCampaingsNodeList = document.querySelectorAll(".vwo-campaign.expanded");
                for(let i = 0; i < expandedCampaingsNodeList.length; i++) {
                    let id = expandedCampaingsNodeList[i].id.replace("vwo-campaign-", "");
                    if (id !== expandedCampaingsNodeList[i].toString()) {
                        toggleCampaignDetail(id);
                    }
                }
                if (campaignDetailsStore.hasOwnProperty(campaignId)) { // already fetched & rendered
                    // just toggle
                    toggleCampaignDetail(campaignId);
                } else {
                    // get details, render and save
                    getCampaignDetailsAndRender(campaignId);
                    document.getElementById("vwo-campaign-" + campaignId).classList.add("expanded");
                }
            }
        }
    }();
    
    return {
        startWithCampaigns: function() {
            vwoCampaignManager.getCampaignsAndShow();
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
            if(detailsEl != null) {
                detailsEl.style.display = 'none';
            }
            return this;
        },

        openCampaignPage: function(campaignId) {
            window.open("http://app.vwo.com/#/campaign/" + campaignId + "/summary", "_blank");
        },

        toggleCampaignDesc: function() {
            var elems = document.getElementsByName('campaignType');
            if(!!elems) {
                for (var j = 0; j < elems.length; j++) {
                    if (elems[j].checked) {
                        document.getElementById("vwo-campaign-desc-" + elems[j].value).classList.add("expanded");
                    }
                    else {
                        document.getElementById("vwo-campaign-desc-" + elems[j].value).classList.remove("expanded");
                    }
                }
                document.getElementById("open-new-campaign-in-vwo-btn").removeAttribute("disabled");
            }
        },

        toggleNewCampaignList: function() {
            document.getElementById("vwo-new-campaign-btn").classList.toggle("expanded");
            document.getElementById("new-campaign-selection-list").classList.toggle("expanded");
        },

        openNewCampaignWizard: function() {
            var elems = document.getElementsByName('campaignType');
            if(!!elems) {
                for (var j = 0; j < elems.length; j++) {
                    if (elems[j].checked) {
                        window.open("http://app.vwo.com/#/test/create/web/" + elems[j].value, "_blank");
                        break;
                    }
                }
            }

        }
    }
}();

(function () {
    vwo.startWithCampaigns();
}());