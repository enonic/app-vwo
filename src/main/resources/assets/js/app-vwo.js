import "../css/app-vwo.less";
import $ from 'jquery';

let vwoConfig = {};
const vwo = function () {

    const ajax = function () {
        return {
            getRequest: function () {
                return new XMLHttpRequest();
            },
            send: function (url, callback, errorCallback, method, data) {
                const xhr = ajax.getRequest();
                xhr.open(method, url);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if(xhr.status === 200) {
                            callback(xhr.responseText);
                        } else {
                            if (errorCallback) {
                                errorCallback(xhr.responseText);
                            }
                            if (xhr.responseText) {/*
                                if (api.notify.NotifyManager) {
                                    api.notify.NotifyManager.get().showError(xhr.responseText);
                                } else {
                                    console.log(xhr.responseText);
                                }*/
                                console.log(xhr.responseText);
                            }
                        }
                    }
                };
                if (method == 'POST') {
                    xhr.setRequestHeader('Content-type', 'application/json');
                }
                data ? xhr.send(data) : xhr.send();
            },
            get: function (url, data, callback, errorCallback) {
                const query = [];
                for (const key in data) {
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                }
                ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, errorCallback, 'GET')
            },
            post: function (url, data, callback, errorCallback) {
                ajax.send(url, callback, errorCallback, 'POST', JSON.stringify(data))
            }
        };
    }();

    const templateHelper = function () {

        const campaignShortcutTemplate = '<div class="vwo-campaign" id="vwo-campaign-${id}">' +
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
                                                      '<div class="btn start-btn ${start-btn-disabled}" id="start-btn-${id}" title="${start-btn-tooltip}"><i class="icon"></i><span class="label">Start</span></div>' +
                                                      '<div class="btn pause-btn ${pause-btn-disabled}" id="pause-btn-${id}" title="Pause"><i class="icon"></i><span class="label">Pause</span></div>' +
                                                      '<div class="btn archive-btn ${archive-btn-disabled}" id="archive-btn-${id}" title="Archive"><i class="icon"></i><span class="label">Archive</span></div>' +
                                                      '<div class="btn unarchive-btn ${unarchive-btn-disabled}" id="unarchive-btn-${id}" title="Restore"><i class="icon"></i><span class="label">Restore</span></div>' +
                                                      '<div class="btn delete-btn ${delete-btn-disabled}" id="delete-btn-${id}" title="Delete"><i class="icon"></i><span class="label">Delete</span></div>' +
                                                      '<div id="vwo-content-modified-message" class="${content-modified}">This item has been modified</div>' +
                                                  '</div>' +
                                                  '<table>' +
                                                      '<tr class="value"><td>${goals}</td><td>${variations}</td></tr>' +
                                                      '<tr class="label"><td>Goals</td><td>Variations</td></tr>' +
                                                      '<tr class="value"><td>${visitors}</td><td>${traffic}%</td></tr>' +
                                                      '<tr class="label"><td>Visitors</td><td>Traffic</td></tr>' +
                                                  '</table>' +
                                                  '${variation-screenshots}' +
                                                  '<button class="open-campaign-in-vwo-btn"><p>Open in VWO</p></button>' +
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

            newCampaignContentCombobox = function() {
                return  '<select id="wizard-campaign-goal-url-selector" class="wizard-campaign-goal-url-selector">' +
                            contentItemsJson.map(function(contentItem) {
                                return '<option value="' + contentItem.path + '">' + contentItem.displayName;
                            }).join('') +
                        '</select>';
            },

            newCampaignWizardGoalsSection = function() {
                return '<div>' +
                    '<fieldset class="wizard-campaign-goal">' +
                        '<input type="hidden" name="name" value="Default goal">' +
                        'Goal: <select id="wizard-campaign-goal-type" class="campaign-wizard-goal-type" name="goal-type">' +
                                    '<option value="clickLink" checked>track clicks on link</option>' +
                                    '<option value="visitPage">track page visits on</option>' +
                                    //'<option value="engagement">track engagement</option>' +
                                    '<option value="formSubmit">track form submits to</option>' +
                                    // '<option value="clickElement">tracks clicks on element(s)</option>' +
                                    '<option value="revenue">track revenue on</option>' +
                                    '<option value="custom-conversion">track custom conversion on</option>' +
                                '</select>' +
                        '<div class="wizard-campaign-goal-urls">' +
                            '<label>Target URL:</label>' +
                            '<fieldset class="wizard-campaign-goal-url">' +
                                newCampaignContentCombobox() +
                            '</fieldset>' +
                        '</div>' +
                    '</fieldset>' +
                '</div>';
            },

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
                    '<button type="button" class="create-new-campaign-in-vwo-btn" disabled><p>Create</p></button>' +
                    '<button type="button" class="cancel-open-new-campaign-btn"><p>Cancel</p></button>' +
                '</div>';

            const generateVariationScreenshots = function(campaignDetails) {
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
                const status = campaignDetails.status.toLowerCase();
                return campaignDetailsShortcutTemplate.
                    replace(/\$\{id\}/g, campaignDetails.id).
                    replace("${goals}", !!campaignDetails.goals ? campaignDetails.goals.length : "N/A").
                    replace("${variations}", !!campaignDetails.variations ? campaignDetails.variations.length : "N/A").
                    replace("${traffic}", campaignDetails.percentTraffic).
                    replace("${visitors}", !!campaignDetails.thresholds ? campaignDetails.thresholds.visitors : "N/A").
                    replace("${start-btn-tooltip}", (vwoConfig.isPublished || vwoConfig.isModified) ? 'Start' : 'This item is not published').
                    replace("${start-btn-disabled}", ((vwoConfig.isPublished || vwoConfig.isModified) ? '' : 'readonly') + ' ${start-btn-disabled}').
                    replace("${start-btn-disabled}", status == 'running' || status == 'stopped' || status == 'trashed' ? 'disabled' : "").
                    replace("${pause-btn-disabled}", status == 'not_started' || status == 'paused' || status == 'stopped' || status == 'trashed' ? 'disabled' : "").
                    replace("${archive-btn-disabled}", status == 'stopped' || status == 'trashed' ? 'disabled' : "").
                    replace("${delete-btn-disabled}", status == 'trashed' ? 'disabled' : "").
                    replace("${unarchive-btn-disabled}", status != 'stopped' ? 'disabled' : "").
                    replace("${content-modified}", vwoConfig.isModified ? 'visible' : '').
                    replace("${variation-screenshots}", generateVariationScreenshots(campaignDetails));
            },
            makeCampaignStatusIconShortcut: function (id, status) {
                return campaignStatusIconTemplate.
                    replace(/\$\{id\}/g, id).
                    replace("${title-status}", status.replace("_", " ")).
                    replace(/\$\{status\}/g, status.toLowerCase());
            },
            makeNewCampaignWizardFormTemplate: function (campaignType) {
                let result = '<form class="vwo-campaign-wizard-form">';
                result += newCampaignWizardCommonSection.replace(/\$\{campaignType\}/g, campaignType);

                switch (campaignType) {
                case "ab":
                case "conversion":
                    result += newCampaignWizardGoalsSection();
                    break;
                case "heatmap":
                    break;
                case "multivariate":
                    result += newCampaignWizardSectionsSection +
                              newCampaignWizardGoalsSection();
                    break;
                case "split":
                    result += newCampaignWizardVariationsSection +
                              newCampaignWizardGoalsSection();
                    break;
                }
                let path = vwoConfig.domain;

                if (!!vwoConfig.contentPath && vwoConfig.contentPath.length > 0) {
                    if (path.endsWith("/")) {
                        path = path.slice(0, -1);
                    }

                    path += vwoConfig.contentPath;
                }

                return result.replace(/\$\{content-path\}/g, path) + newCampaignWizardButtonRow + '</form>';
            }
        };
    }();

    let contentItemsJson = [];

    const vwoService = function () {
        return {
            fetchContentItems: function() {
                return new Promise(function(resolve, reject) {

                    if (vwoConfig.isPublished || vwoConfig.isModified) {
                        resolve();
                    }

                    const callbackFn = function (data) {
                        contentItemsJson = JSON.parse(data) || [];
                        resolve();
                    };

                    const errorCallback = function () {
                        contentItemsJson = [];
                        reject();
                    };

                    ajax.get(vwoConfig.contentServiceUrl, {}, callbackFn, errorCallback);
                });
            },
            listCampaigns: function (listCampaignsCallback, errorCallback) {

                const callback = function (data) {
                    if (!data) {
                        errorCallback();
                        return;
                    }
                    listCampaignsCallback(JSON.parse(data).campaigns);
                };

                const params = {}
                ajax.post("/admin/rest/vwo/listCampaigns", params, callback, errorCallback);
                return this;
            },

            getCampaignDetails: function (campaignId, getCampaignDetailsCallback, errorCallback) {
                const callback = function (data) {
                    if(data != null && data.length > 0) {
                        getCampaignDetailsCallback(JSON.parse(data).campaign);
                    } else {
                        errorCallback();
                    }
                };

                const params = {
                    campaignId: campaignId
                }
                ajax.post("/admin/rest/vwo/getCampaignDetails", params, callback, errorCallback);
                return this;
            },

            updateCampaignStatus: function (campaignId, status, updateCampaignStatusCallback, errorCallback) {
                const callback = function (data) {
                    if(data != null && data.length > 0) {
                        updateCampaignStatusCallback(JSON.parse(data).result, (status == "TRASHED") ? status : null);

                        if (status == "TRASHED" && $("#campaigns-list-content").html() == '') {
                            $("#campaigns-list").addClass("empty");
                        }
                    } else {
                        errorCallback();
                    }
                };

                const params = {
                    campaignId: campaignId,
                    status: status
                };
                ajax.post("/admin/rest/vwo/updateCampaignStatus", params, callback, errorCallback);
                return this;
            },

            createNewCampaign: function (newCampaignParamsObject, createCampaignCallback, errorCallback) {
                const callback = function (data) {
                    if(data != null && data.length > 0) {
                        createCampaignCallback(JSON.parse(data).result);
                    } else {
                        errorCallback();
                    }
                };

                const params = {
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

    const vwoCampaignManager = function () {

        const bindToggleOnCampaignClick = function(campaigns) {
            for(let i = 0; i < campaigns.length; i++) {
                let campaignId = campaigns[i].id,
                    campaignElem = document.getElementById('vwo-campaign-' + campaignId);
                campaignElem.addEventListener("click", function () {
                    vwoCampaignDetailsManager.toggleCampaignDetails(campaignId);
                }, false);
            }
        }

        return {
            getCampaignsAndShow: function (getCampaignsCallback, getCampaignsErrorCallback) {
                const onSuccessCallback = function (allCampaigns) {
                    // Remove this if we need to show all campaigns, including deleted
                    let campaigns = [];
                    if(allCampaigns) {
                        campaigns = allCampaigns.filter(function (campaign) {
                            return !campaign.deleted && (!vwoConfig.contentPath.length || campaign.primaryUrl == vwoConfig.domain + vwoConfig.contentPath);
                        });
                    }
                    if(campaigns.length > 0) {
                        $("#campaigns-list").removeClass("empty");
                        let campaignShortcuts = "";
                        for (let i = 0; i < campaigns.length; i++) {
                            campaignShortcuts += templateHelper.makeCampaignShortcut(campaigns[i]);
                        }
                        if (campaigns.length > 0) {
                            $("#campaigns-list-content").html(campaignShortcuts);
                        }

                        bindToggleOnCampaignClick(campaigns);
                    } else if ($("#campaigns-list-content").html() == '') {
                        $("#campaigns-list").addClass("empty");
                    }
                    if(getCampaignsCallback) {
                        getCampaignsCallback();
                    }
                    vwo.hideMask();
                };
                let errorCallback = vwoService.defaultServiceErrorCallback;
                if(getCampaignsErrorCallback) {
                    errorCallback = function () {
                        vwoService.defaultServiceErrorCallback();
                        getCampaignsErrorCallback();
                    }
                }

                vwoService.listCampaigns(onSuccessCallback, errorCallback);

                return this;
            }
        };
    }();

    const vwoNewCampaignWizardManager = function () {

        const collectWizardDataForNewCampaign = function() {
            const form = $("#vwo-campaign-wizard-" + vwoNewCampaignWizardManager.getSelectedCampaignType() + " form");

            const newCampaignParams = {},
                primaryUrl = ensureUrlHasProtocol($(form).find(".wizard-campaign-primary-url").val());

            // set basic params
            newCampaignParams["name"] = $(form).find(".wizard-campaign-name").val();
            newCampaignParams["type"] = $(form).find(".wizard-campaign-type").val(); // type
            newCampaignParams["primaryUrl"] = primaryUrl; // primary url

            // set urls json field to be included in the campaign
            const campaignUrl = {};
            campaignUrl.type = "url";
            campaignUrl.value = primaryUrl; // we use primary url
            newCampaignParams["urls"] = [campaignUrl];

            // set variations (for split campaign)
            const variations = [];
            $(form).find(".wizard-campaign-variation").each(function () {
                const variation = {};
                const variationUrls = [];
                $(this).find(".wizard-campaign-variation-url").each(function () {
                    const variationUrl = {};
                    variationUrl.type = "url";
                    variationUrl.value = ensureUrlHasProtocol($(this).find("input[name='value']").val());
                    variationUrls.push(variationUrl);
                });
                variation.urls = variationUrls;
                variations.push(variation);
            });
            newCampaignParams["variations"] = variations;

            // set goals
            const campaignGoals = [];
            $(form).find(".wizard-campaign-goal").each(function () {
                const campaignGoal = {};
                campaignGoal.name = $(this).find("input[name='name']").val();
                campaignGoal.type = $(this).find("select[name='goal-type']").val();

                const urls = [];
                $( this ).find("#wizard-campaign-goal-url-selector").each(function( ) {
                    const url = {};
                    url.type = "url";
                    url.value = ensureUrlHasProtocol($(this).val());
                    urls.push(url);
                });

                campaignGoal["urls"] = urls;
                campaignGoals.push(campaignGoal);
            });
            newCampaignParams["goals"] = campaignGoals;

            // set sections (for multivariate campaign)
            const sections = [];
            $(form).find(".wizard-campaign-section").each(function () {
                const section = {};
                section.name = $(this).find("input[name='name']").val();
                section.cssSelector = $(this).find("input[name='cssSelector']").val();
                sections.push(section);
            });
            newCampaignParams["sections"] = sections;

            return newCampaignParams;
        }

        const ensureUrlHasProtocol = function (url) {
            if (!url) {
                return url;
            }
            return url.startsWith("http") ? url : "http://" + url;
        }

        const getWizardTemplateForSelectedCampaign = function (campaignType) {
            return templateHelper.makeNewCampaignWizardFormTemplate(campaignType);
        }

        const createWizardFormAndAppend = function (campaignType) {
            $("#vwo-campaign-wizard-" + campaignType).append(getWizardTemplateForSelectedCampaign(campaignType));

            $(".create-new-campaign-in-vwo-btn").click(() => vwo.createNewCampaignFromOurWizard());
            $(".cancel-open-new-campaign-btn").click(() => vwo.toggleNewCampaignList());

            const form = $("#vwo-campaign-wizard-" + vwoNewCampaignWizardManager.getSelectedCampaignType() + " form");

            $(form).find("input").each(function () {
                $(this).on("input propertychange", function () {
                    validateForm(form);
                });
            });
        }

        const validateForm = function (form) {
            let formValid = true;
            $(form).find("input").each(function (index) {
                const value = $(this).val();
                if(value == null || (value !== null && value.trim().length == 0)){
                    formValid = false;
                }
            });
            $(form).find(".create-new-campaign-in-vwo-btn").attr("disabled", function(){ return !formValid});
        }

        const cleanWizardForm = function (campaignType) {
            $("#vwo-campaign-wizard-" + campaignType + " form").remove();
            createWizardFormAndAppend(campaignType);
        }

        return {
            collectWizardDataAndSendNewCampaignRequest: function () {

                vwo.showMask();
                const successCallback = function (result) {
                    vwo.hideMask();
                    const selectedCampaignType = vwoNewCampaignWizardManager.getSelectedCampaignType();
                    window.open("http://app.vwo.com/#/test/" + selectedCampaignType + "/" + result.id + "/editor", "_blank");

                    const campaignName = $("#vwo-campaign-wizard-" + vwoNewCampaignWizardManager.getSelectedCampaignType() + " form .wizard-campaign-name").val();
/*
                    if (api.notify.NotifyManager) {
                        api.notify.NotifyManager.get().showSuccess('Successfully created campaign "' + campaignName + '".');
                    }
*/
                    cleanWizardForm(selectedCampaignType);

                    vwo.toggleNewCampaignList();

                    setTimeout(function () { // delay before refreshing campaigns view to void 429 response - too many requests
                        vwoCampaignManager.getCampaignsAndShow();
                    }, 2000);
                };

                vwoService.createNewCampaign(collectWizardDataForNewCampaign(), successCallback, vwoService.defaultServiceErrorCallback);

                return this;
            },

            getSelectedCampaignType: function () {
                const elems = document.getElementsByName('campaignType');
                if (!!elems) {
                    for (let j = 0; j < elems.length; j++) {
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

    const vwoCampaignDetailsManager = function () {

        const campaignDetailsStore = new Object();

        const getCampaignDetailsAndRender = function (campaignId) {
            vwo.showMask();

            const getCampaignDetailsCallback = function (campaignDetails) {
                const campaignDetailsHtml = templateHelper.makeCampaignDetailsShortcut(campaignDetails),
                    campaignElem = document.getElementById('vwo-campaign-' + campaignId);

                $('.open-campaign-in-vwo-btn').click(() => vwo.openCampaignPage(campaignDetails.id));

                campaignElem.insertAdjacentHTML('beforeend', campaignDetailsHtml);

                campaignDetailsStore[campaignId] = 1;
                handleUpdateButtonsClick(campaignId);
                vwo.hideMask();
            };

            vwoService.getCampaignDetails(campaignId, getCampaignDetailsCallback, vwoService.defaultServiceErrorCallback);
        };

        const handleUpdateButtonsClick = function(campaignId) {
            addClickListenerToButton(getStartBtn(campaignId), campaignId, "RUNNING");
            addClickListenerToButton(getPauseBtn(campaignId), campaignId, "PAUSED");
            addClickListenerToButton(getArchiveBtn(campaignId), campaignId, "STOPPED");
            addClickListenerToButton(getUnarchiveBtn(campaignId), campaignId, "PAUSED");
            addClickListenerToButton(getDeleteBtn(campaignId), campaignId, "TRASHED");
        };

        const addClickListenerToButton = function(btnElement, campaignId, newStatus) {
            const updateCampaignStatusCallback = function (updateResult, newStatus) {
                const status = newStatus || updateResult.status;
                vwo.hideMask();
                const ids = updateResult.ids; // ids of campaigns that got updated, we expect only one to come
                for(let i = 0; i < ids.length; i++) {
                    updateCampaignStatusView(ids[i], status);
                    if (status !== 'TRASHED') {
                        updateStatusButtons(ids[i], status.toLowerCase());
                    }
                }
            };

            btnElement.addEventListener("click", function (e) {
                if (btnElement.classList.contains('readonly')) {
                    e.stopPropagation();
                    return false;
                }
                vwo.showMask();
                vwoService.updateCampaignStatus(campaignId, newStatus, updateCampaignStatusCallback, vwoService.defaultServiceErrorCallback);
            }, false);
        };

        const getStartBtn = function (campaignId) {
                return document.getElementById('start-btn-' + campaignId);
            },
            getPauseBtn = function (campaignId) {
                return document.getElementById('pause-btn-' + campaignId);
            },
            getArchiveBtn = function (campaignId) {
                return document.getElementById('archive-btn-' + campaignId);
            },
            getUnarchiveBtn = function (campaignId) {
                return document.getElementById('unarchive-btn-' + campaignId);
            },
            getDeleteBtn = function (campaignId) {
                return document.getElementById('delete-btn-' + campaignId);
            };

        const updateStatusButtons = function (campaignId, status) {
            getStartBtn(campaignId).classList.toggle("disabled", status === "running" || status === "stopped" || status === "trashed");
            getPauseBtn(campaignId).classList.toggle("disabled", status === "paused" || status === "stopped" || status === "trashed");
            getArchiveBtn(campaignId).classList.toggle("disabled", status === "stopped" || status === "trashed");
            getDeleteBtn(campaignId).classList.toggle("disabled", status === "trashed");
            getUnarchiveBtn(campaignId).classList.toggle("disabled", status !== "stopped" && status !== "trashed");
        };

        const updateCampaignStatusView = function(id, status) {
            let elem;
            if (status.toLowerCase() == "trashed") {
                elem = document.getElementById("vwo-campaign-" + id);
                elem.parentNode.removeChild(elem);
                
                return;
            }

            elem = document.getElementById("vwo-campaign-status-" + id);
            elem.parentNode.removeChild(elem);

            const infoElem = document.getElementById("vwo-campaign-info-" + id);
            infoElem.insertAdjacentHTML('beforeend', templateHelper.makeCampaignStatusIconShortcut(id, status));
        };

        const toggleCampaignDetail = function(campaignId) {
            document.getElementById("vwo-campaign-" + campaignId).classList.toggle("expanded");
            const detailsEl = document.getElementById("vwo-campaign-details-" + campaignId);
            detailsEl.classList.toggle("hidden");
        };


        return {
            toggleCampaignDetails: function(campaignId) {
                const expandedCampaingsNodeList = document.querySelectorAll(".vwo-campaign.expanded");
                for(let i = 0; i < expandedCampaingsNodeList.length; i++) {
                    let id = expandedCampaingsNodeList[i].id.replace("vwo-campaign-", "");
                    if (id !== campaignId.toString()) {
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

        fetchConfig: function(configServiceUrl) {
            return new Promise(function(resolve, reject) {
                ajax.get(configServiceUrl, {}, (config) => resolve(JSON.parse(config)), () => reject());
            });
        },

        fetchContentItems: function() {
            return vwoService.fetchContentItems();
        },

        addEventListeners: function() {
            $("#vwo-new-campaign-btn, #close-new-campaign-section-btn").each(function() {
                $(this).click(() => vwo.toggleNewCampaignList());
            });
            $("[name='campaignType']").each(function() {
                $(this).click(() => vwo.toggleCampaignWizard());
            });
            $(".vwo-new-campaign-logo").each(function(index) {
                $(this).click(() => vwo.toggleCampaignWizard(index));
            });
            $(".vwo-new-campaign-name").each(function(index) {
                $(this).click(() => vwo.toggleCampaignWizard(index));
            });
        },

        startWithCampaigns: function() {
            vwo.addEventListeners();
            const
                onSuccessCallback = function () {
                    $(".vwo-campaigns-block").addClass("visible");
                },
                errorCallback = function () {
                    $(".vwo-campaigns-block-error").addClass("visible");
                }

            vwoCampaignManager.getCampaignsAndShow(onSuccessCallback, errorCallback);
        },

        showMask: function() {
            const detailsEl = document.getElementById("vwo-widget-loadmask");
            if(detailsEl != null) {
                detailsEl.style.display = 'block';
            }
            return this;
        },

        hideMask: function() {
            const detailsEl = document.getElementById("vwo-widget-loadmask");
            if(detailsEl != null) {
                detailsEl.style.display = 'none';
            }
            return this;
        },

        openCampaignPage: function(campaignId) {
            window.open("https://app.vwo.com/#/campaign/" + campaignId + "/summary", "_blank");
        },

        toggleCampaignWizard: function (index) {
            const elems = document.getElementsByName('campaignType');
            if(!!elems) {
                $("#close-new-campaign-section-btn").removeClass("visible");
                if (!isNaN(index)) {
                    elems[index].checked = true;
                }
                for (let j = 0; j < elems.length; j++) {
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
            $("#close-new-campaign-section-btn").toggleClass("visible", vwoNewCampaignWizardManager.getSelectedCampaignType() == null);
            $("#campaigns-list").toggleClass("expanded");
        },

        createNewCampaignFromOurWizard: function() {
            vwoNewCampaignWizardManager.collectWizardDataAndSendNewCampaignRequest();
        }
    }
}();

(() => {
    //window.vwo = vwo;
    const configServiceUrl = document.currentScript.getAttribute('data-config-service-url');
    if (!configServiceUrl) {
        throw 'Unable to fetch widget config';
    }

    vwo.showMask();

    vwo.fetchConfig(configServiceUrl).then(function(config) {
        vwoConfig = config;
        vwo.fetchContentItems().then(function() {
            vwo.startWithCampaigns(config);
        });
    });

})();
