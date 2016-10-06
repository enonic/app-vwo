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
                                                      '<tr class="value"><td>${goals}</td><td>${variations}</td></tr>' +
                                                      '<tr class="label"><td>Goals</td><td>Variations</td></tr>' +
                                                      '<tr class="value"><td>${visitors}</td><td>${traffic}%</td></tr>' +
                                                      '<tr class="label"><td>Visitors</td><td>Traffic</td></tr>' +
                                                  '</table>' +
                                                  '${variation-screenshots}' +
                                                  '<button class="open-campaign-in-vwo-btn" onclick="vwo.openCampaignPage(${id})"><p>Open in VWO</p></button>' +
                                              '</div>',

            campaignStatusIconTemplate = '<div class="vwo-campaign-status ${status}" id="vwo-campaign-status-${id}">' +
                                            '<i class="icon icon-status-${status}" title="${title-status}"></i>' +
                                         '</div>',

            newCampaignWizardCommonSection = '<div class="hidden">' +
                                                 '<label for="newCampaignType">Campaign type:</label>' +
                                                 '<input class="wizard-campaign-type" type="text" value="${campaignType}" name="newCampaignType" disabled><br>' +
                                             '</div>' +
                                             '<div>' +
                                                 '<label for="campaignName">Campaign name:</label>' +
                                                 '<input class="wizard-campaign-name" type="text" name="campaignName"><br>' +
                                             '</div>' +
                                             '<div>' +
                                                 '<label for="primaryUrl">Default campaign URL:</label>' +
                                                 '<input class="wizard-campaign-primary-url" type="text" name="primaryUrl" value="${content-path}"><br>' +
                                             '</div>',

            newCampaignWizardGoalsSection =
                '<div>' +
                    '<fieldset class="wizard-campaign-goal">' +
                        '<legend>Goal</legend>' +
                        'Name: <input type="text" name="name"><br>' +
                        'Type: <select id="wizard-campaign-goal-type" class="campaign-wizard-goal-type" name="goal-type">' +
                                    '<option value="visitPage" checked>tracks page visits on</option>' +
                                    '<option value="engagement">tracks engagement</option>' +
                                    '<option value="formSubmit">tracks form submits to</option>' +
                                    '<option value="clickLink">tracks clicks on link</option>' +
                                    // '<option value="clickElement">tracks clicks on element(s)</option>' +
                                    '<option value="revenue">tracks revenue on</option>' +
                                    '<option value="custom-conversion">tracks custom conversion on</option>' +
                                '</select>' +
                        '<div class="wizard-campaign-goal-urls">' +
                            '<label>URL:</label>' +
                            '<fieldset class="wizard-campaign-goal-url">' +
                                '<input type="text" name="type" value="url" class="hidden">' +
                                '<input type="text" name="value" value="${content-path}"><br>' +
                            '</fieldset>' +
                        '</div>' +
                    '</fieldset>' +
                '</div>',

            newCampaignWizardVariationsSection =
                '<div>' +
                    '<fieldset class="wizard-campaign-variations">' +
                        '<legend>Initial Variations</legend>' +
                        '<fieldset class="wizard-campaign-variation">' +
                            '<div class="wizard-campaign-variation-urls">' +
                                '<label>URL 1:</label>' +
                                '<fieldset class="wizard-campaign-variation-url">' +
                                    '<input type="text" name="type" value="url" class="hidden">' +
                                    '<input type="text" name="value" value="${content-path}"><br>' +
                                '</fieldset>' +
                            '</div>' +
                        '</fieldset>' +
                        '<fieldset class="wizard-campaign-variation">' +
                            '<div class="wizard-campaign-variation-urls">' +
                            '<label>URL 2:</label>' +
                            '<fieldset class="wizard-campaign-variation-url">' +
                                '<input type="text" name="type" value="url" class="hidden">' +
                                '<input type="text" name="value" value="${content-path}"><br>' +
                            '</fieldset>' +
                            '</div>' +
                        '</fieldset>' +
                    '</fieldset>' +
                '</div>',

            newCampaignWizardSectionsSection =
                '<div>' +
                    '<fieldset class="wizard-campaign-section">' +
                        '<legend>Initial section</legend>' +
                        'Name: <input type="text" name="name"><br>' +
                        'CSS Selector: <input type="text" name="cssSelector"><br>' +
                    '</fieldset>' +
                '</div>',

            newCampaignWizardButtonRow =
                '<div class="button-row">' +
                    '<button type="button" class="create-new-campaign-in-vwo-btn" onclick="vwo.createNewCampaignFromOurWizard()" disabled><p>Create</p></button>' +
                    '<button type="button" class="cancel-open-new-campaign-btn" onclick="vwo.toggleNewCampaignList()"><p>Cancel</p></button>' +
                '</div>';

            var generateVariationScreenshots = function(campaignDetails) {
                if (!campaignDetails.variations) {
                    return "";
                }

                if(campaignDetails.variations.length <= 1) {
                    return "";
                }

                return '<div class="variation-screenshots"><img src="' + campaignDetails.variations[0].screenshot + '"></div>';
            }

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
                    replace("${goals}", !!campaignDetails.goals ? campaignDetails.goals.length : "N/A").
                    replace("${variations}", !!campaignDetails.variations ? campaignDetails.variations.length : "N/A").
                    replace("${traffic}", campaignDetails.percentTraffic).
                    replace("${visitors}", !!campaignDetails.thresholds ? campaignDetails.thresholds.visitors : "N/A").
                    replace("${start-btn-disabled}", status == 'running' ? 'disabled' : "").
                    replace("${pause-btn-disabled}", status == 'paused' ? 'disabled' : "").
                    replace("${archive-btn-disabled}", status == 'trashed' ? 'disabled' : "").
                    replace("${delete-btn-disabled}", status == 'stopped' ? 'disabled' : "").
                    replace("${variation-screenshots}", generateVariationScreenshots(campaignDetails));
            },
            makeCampaignStatusIconShortcut: function (id, status) {
                return campaignStatusIconTemplate.
                    replace(/\$\{id\}/g, id).
                    replace("${title-status}", status.replace("_", " ")).
                    replace(/\$\{status\}/g, status.toLowerCase());
            },
            makeNewCampaignWizardFormTemplate: function (campaignType) {
                var result = '<form class="vwo-campaign-wizard-form">';
                result += newCampaignWizardCommonSection.replace(/\$\{campaignType\}/g, campaignType);

                switch (campaignType) {
                case "ab":
                case "conversion":
                    result += newCampaignWizardGoalsSection;
                    break;
                case "heatmap":
                    break;
                case "multivariate":
                    result += newCampaignWizardSectionsSection +
                              newCampaignWizardGoalsSection;
                    break;
                case "split":
                    result += newCampaignWizardVariationsSection +
                              newCampaignWizardGoalsSection;
                    break;
                }

                var path = vwoConfig.domain;

                if (!!contentPath && contentPath.length > 0) {
                    if (path.endsWith("/")) {
                        path = path.substring(0, path.length - 1);
                    }

                    path += contentPath;
                }

                return result.replace(/\$\{content-path\}/g, path) + newCampaignWizardButtonRow + '</form>';
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

            createNewCampaign: function (newCampaignParamsObject, createCampaignCallback, errorCallback) {
                var callback = function (data) {
                    if(data != null && data.length > 0) {
                        createCampaignCallback(JSON.parse(data).result);
                    } else {
                        errorCallback();
                    }
                };

                var params = {
                    accountId: vwoConfig.accountId,
                    tokenId: vwoConfig.tokenId,
                    newCampaignParams: JSON.stringify(newCampaignParamsObject)
                }
                ajax.post("/admin/rest/vwo/createNewCampaign", params, callback, errorCallback);
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
                    if(campaigns) {
                        $("#campaigns-list").removeClass("empty");
                        var campaignShortcuts = "";
                        for (var i = 0; i < campaigns.length; i++) {
                            campaignShortcuts += templateHelper.makeCampaignShortcut(campaigns[i]);
                        }
                        if (campaigns.length > 0) {
                            document.getElementById("campaigns-list").innerHTML = campaignShortcuts;
                        }

                        bindToggleOnCampaignClick(campaigns);
                    } else {
                        $("#campaigns-list").addClass("empty");
                    }
                    vwo.hideMask();
                };

                vwoService.listCampaigns(callback, vwoService.defaultServiceErrorCallback);

                return this;
            }
        };
    }();

    var vwoNewCampaignWizardManager = function () {

        var collectWizardDataForNewCampaign = function() {
            var form = $("#vwo-campaign-wizard-" + vwoNewCampaignWizardManager.getSelectedCampaignType() + " form");

            var newCampaignParams = {},
                primaryUrl = ensureUrlHasProtocol($(form).find(".wizard-campaign-primary-url").val());

            // set basic params
            newCampaignParams["name"] = $(form).find(".wizard-campaign-name").val();
            newCampaignParams["type"] = $(form).find(".wizard-campaign-type").val(); // type
            newCampaignParams["primaryUrl"] = primaryUrl; // primary url

            // set urls json field to be included in the campaign
            var campaignUrl = {};
            campaignUrl.type = "url";
            campaignUrl.value = primaryUrl; // we use primary url
            newCampaignParams["urls"] = [campaignUrl];

            // set variations (for split campaign)
            var variations = [];
            $(form).find(".wizard-campaign-variation").each(function (index) {
                var variation = {};
                var variationUrls = [];
                $(this).find(".wizard-campaign-variation-url").each(function (index) {
                    var variationUrl = {};
                    variationUrl.type = "url";
                    variationUrl.value = ensureUrlHasProtocol($(this).find("input[name='value']").val());
                    variationUrls.push(variationUrl);
                });
                variation.urls = variationUrls;
                variations.push(variation);
            });
            newCampaignParams["variations"] = variations;

            // set goals
            var campaignGoals = [];
            $(form).find(".wizard-campaign-goal").each(function (index) {
                var campaignGoal = {};
                campaignGoal.name = $( this ).find("input[name='name']").val();
                campaignGoal.type = $(this).find("select[name='goal-type']").val();

                var urls = [];
                $( this ).find(".wizard-campaign-goal-url").each(function( index ) {
                    var url = {};
                    url.type = "url";
                    url.value = ensureUrlHasProtocol($(this).find("input[name='value']").val());
                    urls.push(url);
                });

                campaignGoal["urls"] = urls;
                campaignGoals.push(campaignGoal);
            });
            newCampaignParams["goals"] = campaignGoals;

            // set sections (for multivariate campaign)
            var sections = [];
            $(form).find(".wizard-campaign-section").each(function (index) {
                var section = {};
                section.name = $(this).find("input[name='name']").val();
                section.cssSelector = $(this).find("input[name='cssSelector']").val();
                sections.push(section);
            });
            newCampaignParams["sections"] = sections;

            return newCampaignParams;
        }

        var ensureUrlHasProtocol = function (url) {
            if (!url) {
                return url;
            }
            return url.startsWith("http") ? url : "http://" + url;
        }

        var getWizardTemplateForSelectedCampaign = function (campaignType) {
            return templateHelper.makeNewCampaignWizardFormTemplate(campaignType);
        }

        var createWizardFormAndAppend = function (campaignType) {
            $("#vwo-campaign-wizard-" + campaignType).append(getWizardTemplateForSelectedCampaign(campaignType));

            var form = $("#vwo-campaign-wizard-" + vwoNewCampaignWizardManager.getSelectedCampaignType() + " form");

            $(form).find("input").each(function (index) {
                $(this).on("input propertychange", function () {
                    validateForm(form);
                });
            });
        }

        var validateForm = function (form) {
            var formValid = true;
            $(form).find("input").each(function (index) {
                var value = $(this).val();
                if(value == null || (value !== null && value.trim().length == 0)){
                    formValid = false;
                }
            });
            $(form).find(".create-new-campaign-in-vwo-btn").attr("disabled", function(){ return !formValid});
        }

        var cleanWizardForm = function (campaignType) {
            $("#vwo-campaign-wizard-" + campaignType + " form").remove();
            createWizardFormAndAppend(campaignType);
        }

        return {
            collectWizardDataAndSendNewCampaignRequest: function () {

                vwo.showMask();
                var callback = function (result) {
                    vwo.hideMask();
                    var selectedCampaignType = vwoNewCampaignWizardManager.getSelectedCampaignType();
                    window.open("http://app.vwo.com/#/test/" + selectedCampaignType + "/" + result.id + "/editor", "_blank");

                    var campaignName = $("#vwo-campaign-wizard-" + vwoNewCampaignWizardManager.getSelectedCampaignType() + " form .wizard-campaign-name").val();
                    if (api.notify.NotifyManager) {
                        api.notify.NotifyManager.get().showSuccess("Successfully created " + campaignName + " campaign.");
                    }

                    cleanWizardForm(selectedCampaignType);

                    setTimeout(function () { // delay before refreshing campaigns view to void 429 response - too many requests
                        vwoCampaignManager.getCampaignsAndShow();
                    }, 2000);
                };

                vwoService.createNewCampaign(collectWizardDataForNewCampaign(), callback, vwoService.defaultServiceErrorCallback);

                return this;
            },

            getSelectedCampaignType: function () {
                var elems = document.getElementsByName('campaignType');
                if (!!elems) {
                    for (var j = 0; j < elems.length; j++) {
                        if (elems[j].checked) {
                            return elems[j].value;
                        }
                    }
                }
                return null;
            },

            appendWizardForm: function (campaignType) {
                if ($("#vwo-campaign-wizard-" + campaignType + " form").length == 0) {
                    createWizardFormAndAppend(campaignType);
                } else {
                    cleanWizardForm(campaignType);
                }
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

        toggleCampaignWizard: function () {
            var elems = document.getElementsByName('campaignType');
            if(!!elems) {
                for (var j = 0; j < elems.length; j++) {
                    if (elems[j].checked) {
                        vwoNewCampaignWizardManager.appendWizardForm(elems[j].value);
                        $("#vwo-campaign-wizard-" + elems[j].value).addClass("expanded");
                        $("#vwo-campaign-wizard-" + elems[j].value).find(".wizard-campaign-name").focus();
                    }
                    else {
                        $("#vwo-campaign-wizard-" + elems[j].value).removeClass("expanded");
                    }
                }
            }
        },

        toggleNewCampaignList: function() {
            $("#vwo-new-campaign-btn").toggleClass("expanded");
            $("#new-campaign-selection-list").toggleClass("expanded");
            if($("#new-campaign-selection-list").hasClass("expanded") && vwoNewCampaignWizardManager.getSelectedCampaignType() == null) {
                $('input[name=campaignType]').first().prop("checked", true).change();
            }
        },

        createNewCampaignFromOurWizard: function() {
            vwoNewCampaignWizardManager.collectWizardDataAndSendNewCampaignRequest();
        }
    }
}();

(function () {
    vwo.startWithCampaigns();
}());