var portal = require('/lib/xp/portal');

exports.responseFilter = function (req, res) {
    var siteConfig = portal.getSiteConfig();
    var enableTracking = siteConfig['enableTracking'] || false;

    if (!enableTracking || req.mode !== 'live') {
        return res;
    }

    var snippet = '<!-- Start Visual Website Optimizer Asynchronous Code -->';
    snippet += '<script type=\'text/javascript\'>';
    snippet += 'var _vwo_code=(function(){';
    snippet += 'var account_id=' + app.config["vwo.accountId"] + ',';
    snippet += 'settings_tolerance=2000,';
    snippet += 'library_tolerance=2500,';
    snippet += 'use_existing_jquery=false,';
    snippet += 'f=false,d=document;return{use_existing_jquery:function(){return use_existing_jquery;},';
    snippet += 'library_tolerance:function(){return library_tolerance;},finish:function(){if(!f){f=true;';
    snippet += 'var a=d.getElementById(\'_vis_opt_path_hides\');if(a)a.parentNode.removeChild(a);}},';
    snippet += 'finished:function(){return f;},load:function(a){var b=d.createElement(\'script\');b.src=a;b.type=\'text/javascript\';';
    snippet += 'b.innerText;b.onerror=function(){_vwo_code.finish();};d.getElementsByTagName(\'head\')[0].appendChild(b);},';
    snippet += 'init:function(){settings_timer=setTimeout(\'_vwo_code.finish()\',settings_tolerance);var a=d.createElement(\'style\'),';
    snippet += 'b=\'body{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}\',h=d.getElementsByTagName(\'head\')[0];';
    snippet += 'a.setAttribute(\'id\',\'_vis_opt_path_hides\');a.setAttribute(\'type\',\'text/css\');if(a.styleSheet)a.styleSheet.cssText=b;';
    snippet += 'else a.appendChild(d.createTextNode(b));h.appendChild(a);this.load(\'//dev.visualwebsiteoptimizer.com/j.php?a=\'+account_id + \'';
    snippet += '&u=\'+encodeURIComponent(d.URL)+\'&r=\'+Math.random());return settings_timer;}};}());_vwo_settings_timer=_vwo_code.init();';
    snippet += '</script>';
    snippet += '<!-- End Visual Website Optimizer Asynchronous Code -->';

    var headEnd = res.pageContributions.headEnd;
    if(!headEnd) {
        res.pageContributions.headEnd = [];
    }
    else if(typeof(headEnd) == 'string') {
        res.pageContributions.headEnd = [headEnd];
    }

    res.pageContributions.headEnd.push(snippet);
    return res;
};
