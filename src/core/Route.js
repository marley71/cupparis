/**
 * Classe per la gestione delle route verso il server.
 *
 */

import CrudCore from "./CrudCore";

var defaultConf =  {
    method : 'get',       // metodo della richiesta http, GET o POST
    url : '',             // url della route, puo' contenere variabili racchiusi tra {} che vengono valorizzati prima dell'utilizzo
    params : {},          //  parametri da inviare alla route
    commonParams : {},    //  parametri statici da aggiungere sempre alla chiamata
    values : {},          //  vettore associativo per sostituire i parametri per la costruzione dell'url racchiusi da {}
    protocol : null,      // tipo di protocollo da usare
    resultType : null,    // tipo di risultato, 'record' o 'list'
}
export default class Route {


    routeConf = {}

    constructor(conf) {
        let c = Object.assign({},conf || {});
        this.routeConf = Object.assign({}, defaultConf);
        for (var k in c) {
            this.routeConf[k] = c[k];
        }
    }

    _isFormData() {
        return (this.routeConf.params instanceof FormData);
    }

    /**
     * ritorna il metodo utilizzato per la richiesta al server, get o post
     * @return string
     */
    getMethod() {
        return this.routeConf.method;
    }

    setMethod(m) {
        this.routeConf.method = m;
    }

    /**
     * ritorna il metodo utilizzato per la richiesta al server, get o post
     * @return string
     */
    getProtocol() {
        return this.routeConf.protocol;
    }
    /**
     * ritorna url esatto valorizzando le variabili parametriche tra {} presenti nella
     * stringa url.
     * @param values: valori attuali per valorizzare le variabili se non viene passato prende
     * i valori presenti in this.values
     * @returns string url con variabili valorizzate
     */
    getUrl(values) {
        // var that = this;
        var finalUrl = this.routeConf.url;
        var v = values?values:this.routeConf.values;

        for (let key in v) {
            let find = '{'+key+'}';
            let re = new RegExp(find, 'g');
            finalUrl = finalUrl.replace(re,v[key]);
        }
        for (let key in v) {
            let find = '{'+key+'\\?'+'}';
            //console.log(finalUrl,' find' + find)
            let re = new RegExp(find, 'g');
            finalUrl = finalUrl.replace(re,v[key]);
        }
        // tolgo eventuali parametri opzionali
        let re = new RegExp('/{\\w+'+'\\?'+'}', 'g');
        finalUrl = finalUrl.replace(re,'');
        return finalUrl;
    }

    setUrl(url) {
        this.routeConf.url = url;
    }

    /**
     * ritorna tutti parametri passati in get o post in base al tipo di metodo della route
     * mergiando i parametri presenti in params e commonParams
     * @returns {*}
     */
    getParams() {
        // var that = this;
        if (this._isFormData()) {
            for (var k in this.routeConf.commonParams) {
                this.routeConf.params.set(k,this.routeConf.commonParams[k]);
            }
            return this.routeConf.params;
        }
        let params = CrudCore.clone(this.routeConf.params);
        return Object.assign(params,this.routeConf.commonParams);
    }

    getParamsKeys() {
        if (this._isFormData()) {
            return this.routeConf.params.keys();
            // var _keys = [];
            // for (var pair in this.routeConf.params.entries()) {
            //     _keys.push(pair[0])
            // }
            // return _keys;
        }
        return Object.keys(this.routeConf.params);
    }

    mergeParams(params) {
        if (params instanceof FormData) {
            for (var pair of params.entries()) {
                this.setParam(pair[0],pair[1])
            }
        } else {
            for (var k in params) {
                this.setParam(k,params[k]);
            }
        }
    }
    getParam(key) {
        if (this._isFormData())
            return this.routeConf.params.get(key);
        return this.routeConf.params[key];
    }

    getCommonParam(key) {
        return this.routeConf.commonParams[key];
    }

    /**
     * setta  parametri passati in get o post in base al tipo di metodo della route
     * @params : vettore associativo di parametri da passare o un FormData
     * @returns void
     */
    setParams(params) {
        if (params instanceof FormData) {
            this.routeConf.params = params;
        } else {
            this.routeConf.params = {};
            for (var k in params) {
                this.routeConf.params[k] = params[k];
            }
        }
    }

    setParam(key,value) {
        //console.log('Route.setParam',this._isFormData(),key,value);
        if (this._isFormData()) {
            this.routeConf.params.set(key,value);
        } else {
            this.routeConf.params[key] = value;
        }

    }

    setCommonParam(key,value) {
        this.routeConf.commonParams[key] = value;
    }

    getValues() {
        return this.routeConf.values;
    }

    setValues(values) {
        for (var k in values) {
            this.routeConf.values[k] = values[k];
        }
    }

    setValuesFromObj(obj) {
        let keys = this.getKeys();
        for (let k in keys) {
            this.routeConf.values[ keys[k] ] = obj[ keys[k] ];
        }
        console.log('this.routeConf',keys,this.routeConf);
    }
    /**
     * ritorna le key dei parametri che devono essere valorizzati per ritornare l'url esatto
     * per esempio se url e' fatto come /pippo/{param1}/{param2} ritorna ['param1','param2']
     * return array
     */
    getKeys() {
        var that = this;
        var r = /\{\w+\}+/g;
        var keys = [];
        var tmp = false;
        console.log('url',that.routeConf.url)
        do {
            tmp = r.exec(that.routeConf.url);
            if (tmp) {
                var removeBrackets = tmp[0].substr(1);
                removeBrackets = removeBrackets.substr(0,removeBrackets.length-1);
                keys.push(removeBrackets);
            }
        } while(tmp)
        return keys;
    }

    getConf() {
        return this.routeConf;
    }

}
