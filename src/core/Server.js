/**
 * Created by pier on 20/12/17.
 */

//import jQuery from 'jquery';
import CrudVars from "../confs/CrudVars.js";
import axios from 'axios';

const Server = {};


/**
 * ritorna l'url reale nel dominio in cui si lavora
 * in caso di subdomain aggiunge il subdomain all'url passato
 * @param url, url a cui aggiungere il prefisso subdomain
 * @returns {*}
 *
 * **/
Server.getUrl = function (url) {
    return Server.subdomain ? Server.subdomain + url : url;
};

Server.getHearders = function () {
    var headers = {};

    var hasBasic = import.meta.env.VITE_HTTP_BASIC_AUTH;
    var auth = '';
    if (hasBasic) {
        auth = "Basic " + btoa(import.meta.env.VITE_HTTP_BASIC_AUTH) + ', ';
    }
    var bearer = '';
    if (import.meta.env.VITE_TOKEN && !import.meta.env.PROD) {

        bearer = 'Bearer ' + import.meta.env.VITE_TOKEN;
        auth += bearer;

        headers = {
            'Authorization': auth,
            'AuthBT': bearer,
            'Accept': 'application/json'
        }
        return headers;
    }
    if (!import.meta.env.VITE_TOKEN && !import.meta.env.PROD) {
        bearer = 'Bearer ' +  window.localStorage.getItem('token');
        auth += bearer;
        headers = {
            'Authorization': auth,
            'AuthBT': bearer,
            'Accept': 'application/json'
        }
        return headers;
    }
    if (CrudVars.useApi) {

        let selector = document.querySelector('meta[name="bearer-token"]');
        bearer = 'Bearer ' + (selector ? selector.content : '');
        auth += bearer;
        headers = {
            'Authorization': auth,
            'AuthBT': bearer,
            // jQuery('meta[name="bearer-token"]').attr('content')
            'Accept': 'application/json'
        }
    } else {
        let selector = document.querySelector('meta[name="csrf-token"]');
        headers = {
            'X-CSRF-TOKEN': (selector ? selector.content : '') //jQuery('meta[name="csrf-token"]').attr('content')
        }
    }
    //console.log('HEADERS',headers);
    return headers;
}

Server.post = function (url, params, callback) {
    var realUrl = Server.getUrl(url);
    var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    var processData = true;
    if (params instanceof FormData) {
        contentType = false;
        processData = false;
    }
    console.log('serverPost', (params instanceof FormData), contentType, processData);
    axios.post(realUrl, params, {
        headers: Server.getHearders()
    }).then((response) => {
        callback(response.data);
    }).catch((error) => {
        callback({error: 1, msg: error})
    })
};

Server.get = function (url, params, callback) {
    var realUrl = Server.getUrl(url);
    var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    var processData = true;
    var _data = {};
    if (params instanceof FormData) {
        contentType = false;
        processData = true;
        console.log('is FormData')
        for (var key of params.keys()) {
            var values = params.getAll(key);
            console.log('key', key, 'values', values);
            if (!(key in _data)) {
                if (values.length == 1) {
                    _data[key] = values[0];
                } else {
                    _data[key] = [];
                    for (var vi in values) {
                        _data[key].push(values[vi]);
                    }
                }
            }

        }
    } else {
        _data = params;
    }
    console.log('Server.get _data', _data, contentType, processData, realUrl, Server.getHearders());

    axios.get(realUrl, {
        headers: Server.getHearders(),
        params: _data,
    }).then((response) => {
        callback(response.data);
    }).catch((error) => {
        callback({error: 1, msg: error});
    })
    console.log('serverGet', (params instanceof FormData), contentType, processData, params, realUrl);
    // window.jQuery.ajax({
    //     url: realUrl,
    //     headers: Server.getHearders(),
    //     type: 'GET',
    //     data: _data,
    //     contentType: contentType,
    //     processData: processData,
    // }).done(function(json) {
    //     callback(json);
    // }).fail(function (data, error, msg) {
    //     callback({error:1,msg:msg});
    // });
};

Server.route = function (route, callback) {
    var __cb = callback ? callback : function (json) {
        console.debug(route.className, json)
    };
    var realUrl = route.getUrl();
    var params = route.getParams();
    console.debug('route params', params);
    Server[route.getMethod()](realUrl, params, function (json) {
        __cb(json);
    })
};

Server.postJson = function (url, params, callback) {
    var realUrl = Server.getUrl(url);
    var contentType = 'application/json; charset=UTF-8';
    console.log('serverPost', (params instanceof FormData), contentType);
    window.jQuery.ajax({
        url: realUrl,
        headers: Server.getHearders(),
        type: 'POST',
        data: JSON.stringify(params),
        contentType: contentType,
        processData: false,
    }).done(function (json) {
        callback(json);
    }).fail(function (data, error, msg) {
        callback({error: 1, msg: msg});
    });
};

Server.getErrorMessage = function (message) {
    var msg = null;
    try {
        var tmp = JSON.parse(message);
        msg = "";
        for (k in tmp) {
            msg += tmp[k] + '\n';
        }
    } catch (e) {
        if (Array.isArray(message)) {
            msg = message.join('<br>');
        } else {
            msg = message;
        }
    }
    return msg;
}
Server.subdomain = null;

export default Server
