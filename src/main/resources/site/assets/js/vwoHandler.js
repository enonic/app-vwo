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
                xhr.setRequestHeader('token', vwoConfig.tokenId);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        callback(xhr.responseText)
                    }
                };
                if (method == 'POST') {
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
                var query = [];
                for (var key in data) {
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                }
                ajax.send(url, callback, 'POST', query.join('&'), async)
            }
        };
    }();

    var vwo = function () {
        "use strict";

        return {
            listCampaigns: function () {
                var callback = function(data) {
                    console.log(data);
                };
                /*$.ajax({
                    url: "https://app.vwo.com/api/v2/accounts/" + vwoConfig.accountId + "/campaigns",
                    type: "GET",
                    crossDomain: true,
                    headers: {
                        'token': vwoConfig.tokenId
                    },
                    success: function (response) {
                        console.log(response);
                    },
                    error: function (xhr, status) {
                        console.log(xhr.responseText);
                    }
                });*/

                ajax.get("https://app.vwo.com/api/v2/accounts/" + vwoConfig.accountId + "/campaigns", {}, callback);
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