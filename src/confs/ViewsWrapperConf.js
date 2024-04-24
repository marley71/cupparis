import CrudCore from "../core/CrudCore.js"
import Server from "../core/Server.js";
import viewConfs from "./views";

export default {
    setConf(conf) {
        if (!conf.type)
            throw "confurazione non trovata per la view definire il type della vista";
        var commonConf = null;
        if (['v-edit','v-view','v-insert','v-record','v-search'].indexOf(conf.type) >= 0) {
            commonConf = CrudCore.clone(viewConfs.recordView);
        } else if (['v-list','v-list-edit','v-list-hasmany'].indexOf(conf.type) >= 0) {
            commonConf = CrudCore.clone(viewConfs.listView);
        } else {
            commonConf = CrudCore.clone(viewConfs.defaultView);
        }
        let functionName = CrudCore.camelCase(conf.type);
        if (this[functionName]) {
            this[functionName](conf);
        }
        for (let k in commonConf) {
            if (!(k in conf)) {
                conf[k] = commonConf[k]
            }
        }
    },

    // loadConf(conf) {
    //     let that = this;
    //     //console.log('VIEW CONF',conf);
    //     console.log('View.WrapperConf type',conf.type);
    //     if (!conf.type)
    //         throw "confurazione non trovata per la view definire il type della vista";
    //     var defConf = null;
    //     if (['v-edit','v-view','v-insert','v-record','v-search'].indexOf(conf.type) >= 0) {
    //         defConf = CrudCore.clone(viewConfs.recordView);
    //     } else if (['v-list','v-list-edit','v-list-hasmany'].indexOf(conf.type) >= 0) {
    //         defConf = CrudCore.clone(viewConfs.listView);
    //     } else {
    //         defConf = CrudCore.clone(viewConfs.defaultView);
    //     }
    //     let wName = CrudCore.camelCase(conf.type || viewConfs.defaultView.type);
    //     console.log('wname',that[wName])
    //     if (that[wName]) {
    //         conf = that[wName](conf);
    //     }
    //     conf = Object.assign(defConf,conf);
    //     return conf;
    // },

    mapOptions(domainValues,domainValuesOrder) {
        let options = [];
        if (domainValuesOrder) {
            for (let i in domainValuesOrder) {
                let opt = {
                    id : domainValuesOrder[i],
                    label : domainValues[domainValuesOrder[i]],
                }
                options.push(opt);
            }
        } else {
            for (let k in domainValues) {
                let opt = {
                    id : k,
                    label : domainValues[k],
                }
                options.push(opt);
            }
        }
        //console.log('options',options);
        return options;
    },

    vList(conf) {
        console.log('wList conf',conf);
        //conf.selectionMode = 'multiple';
        conf.selected = null;
        if (! ('routeName' in conf) ){
            conf.routeName = 'list';
        }
        if (!conf.fields && conf.value) {
            console.log('keys',Object.keys(conf.value[0]))
            conf.fields = Object.keys(conf.value[0]);
        }
        if (! ('actions' in conf) ){
            conf.actions = ['action-view','action-edit','action-delete','action-delete-selected','action-insert'];
        }
        if (! ('primaryKey' in conf) ){
            conf.primaryKey = 'id';
        }
        conf.recordActionsConf = [];
        conf.collectionActions = {};
        conf.widgetsConfig = [];
        conf.selectedRow = null;
        conf.menuModel = [];
    },

    vRecord(conf) {
        if (!conf.layout) {
            conf.layout = viewConfs.recordLayouts.record
        }
        if (!conf.fields && conf.value) {
            conf.fields = Object.keys(conf.value);
        }
        conf.widgetsConfig = {};
        conf.recordActionsConf = {};
    },

    vView(conf) {
        let defaultWidgetType = conf.defaultWidgetType;
        this.vRecord(conf);
        if (! ('routeName' in conf) ){
            conf.routeName = 'view';
        }
        if (!('actions' in conf) ){
            conf.actions = [];
        }
        if (!defaultWidgetType)
            conf.defaultWidgetType = 'w-text';
        conf.widgetsConfig = {};
        conf.recordActionsConf = {};

        //console.log('vViewConf',conf);
    },


    vEdit(conf) {
        let defaultWidgetType = conf.defaultWidgetType;
        this.vRecord(conf);
        if (! ('routeName' in conf) ){
            conf.routeName = 'edit';
        }
        if (!defaultWidgetType)
            conf.defaultWidgetType = 'w-input';
        if (!('actions' in conf) ){
            conf.actions = ['action-save','action-back'];
        }
    },

    wSwap(conf) {
        let dconf = {
            activeIcon: 'fa-check',
            routeName: 'set',
            title: 'swap',
            bgInactive: '#FF0000',
            bgActive: 'bg-red-400',
            domainValues: {
                0: CrudCore.translate('app.no'),
                1: CrudCore.translate('app.si')
            },
            slot: '',
            toggleActive: false,
            switchClass: 'form-switch-success',
            dataSwitched: false,
            isAjax:true,  // se e' un controllo che deve fare la chiamata di update altrimenti e' un controllo normale in una form
            json : null, // ultimo json caricato dalla chiamata ajax,
            currentIndex : 0,  // indice corrente delle chiavi di domainValues
        }
        for (let k in dconf) {
            conf[k] = conf[k] || dconf[k];
        }
    },

    wSwapSelect(conf) {
        let dconf = {
            activeIcon: 'fa-check',
            routeName: 'set',
            title: 'swap-select',
            bgInactive: '#FF0000',
            bgActive: 'bg-red-400',
            domainValues: {
                "-1": 'app.seleziona',
            },
            slot: '',
            placeholder : '',
            toggleActive: false,
            isAjax:true,  // se e' un controllo che deve fare la chiamata di update altrimenti e' un controllo normale in una form
            json : null, // ultimo json caricato dalla chiamata ajax,
            currentIndex : 0,  // indice corrente delle chiavi di domainValues
            reload: false,
            extraBind : {},
        };
        for (let k in dconf) {
            conf[k] = conf[k] || dconf[k];
        }
        conf.options = this.mapOptions(conf.domainValues,conf.domainValuesOrder);
    },

    wStatus(conf) {
        if (!conf.statusType) {
            conf.statusType = 'text';
        }
        if (!("domainValues" in conf)) {
            conf.domainValues = {
                0: CrudCore.translate('app.no'),
                1: CrudCore.translate('app.si')
            };
        }
        if (! ("value" in conf) ){
            conf.value = Object.keys(conf.domainValues)[0];
        }
        conf.currentValue = conf.domainValues[conf.value];
        // in caso di action diamo la possibilita' di customizzare il contento dello stato che eseguira' l'azione
        if (!("domainValuesHtml" in conf)) {
            conf.domainValuesHtml = {};
            for (let k in conf.domainValues) {
                if (conf.statusType == 'action') {
                    conf.domainValuesHtml[k] = k;
                } else {
                    conf.domainValuesHtml[k] = conf.domainValues[k];
                }

            }
        }
    },

    // wStatus(conf) {
    //     conf.statusType = 'text';
    //     conf.domainValues = {
    //         0: CrudCore.translate('app.no'),
    //         1: CrudCore.translate('app.si')
    //     }
    //     conf.value = Object.keys(conf.domainValues)[0];
    //     conf.currentValue = conf.domainValues[conf.value];
    //
    //     // in caso di action diamo la possibilita' di customizzare il contento dello stato che eseguira' l'azione
    //     conf.domainValuesHtml = {};
    //     for (let k in conf.domainValues) {
    //         if (conf.statusType == 'action') {
    //             conf.domainValuesHtml[k] = k;
    //         } else {
    //             conf.domainValuesHtml[k] = conf.domainValues[k];
    //         }
    //
    //     }
    // },

    wTexthtml(conf) {
        if (!("toolbar" in conf)) {
            conf.toolbar = null;
        }
        return conf;
    },

    wUpload(conf) {
        conf.files = null;
        // if (!conf.uploadFile) {
        //     conf.uploadFile = function(event) {
        //         this.files = event.files;
        //         console.log('uploadevent',event,this);
        //     }
        //     conf.getValue = function () {
        //         return this.value;
        //     }
        //     conf.getFileValue = function () {
        //         return this.files;
        //     }
        // }
        //return conf;
    },
    wUploadAjax(conf) {
        conf = this.wUpload(conf);
        conf.routeName = 'uploadfile';
        conf.error = false;
        conf.errorMessage = '';
        conf.fileInfo = null;
        // if (!conf.setRouteValues) {
        //     conf.setRouteValues =  function (route) {
        //         route.setValues({
        //             modelName: this.modelName
        //         })
        //         return route;
        //     }
        // }
        // if (!conf.onSuccess) {
        //     conf.onSuccess = function () {
        //         console.log('onSuccess',this.value);
        //     }
        // }
        // if (!conf.onError) {
        //     conf.onError = function () {
        //         console.log('onError',this.value);
        //     }
        // }

        // conf.uploadFile = function(event) {
        //     this.files = event.files;
        //     this.sendAjax();
        // }
        // conf.sendAjax =  function () {
        //     var that = this;
        //     var fDesc = that.getFileValue();
        //     if (!fDesc || !fDesc[0])
        //         throw 'descrittore file upload non valido';
        //     fDesc = fDesc[0];
        //     // var fileName = fDesc.filename;
        //     var route = that.createRoute(that.routeName);
        //     that.setRouteValues(route);
        //     that.error = false;
        //     that.complete = false;
        //
        //     var realUrl = Server.getUrl(route.getUrl());
        //     console.log('realurl', route.getUrl())
        //     var fdata = new FormData();
        //     //data.append('file',jQuery(that.$el).find('[c-image-file]').prop('files')[0]);
        //     fdata.append('file', fDesc)
        //     console.log('ajaxFields', that.ajaxFields)
        //     for (var k in that.ajaxFields)
        //         fdata.append(k, that.ajaxFields[k])
        //     Server.post(realUrl,fdata,function(data) {
        //         that.json = data;
        //         if (!data.error) {
        //             console.log("Success: Files sent!", data);
        //             if (data.error) {
        //                 // var msg = null;
        //                 // try {
        //                 //     var tmp = JSON.parse(data.msg);
        //                 //     msg = "";
        //                 //     for (k in tmp) {
        //                 //         msg += tmp[k] + '\n';
        //                 //     }
        //                 // } catch (e) {
        //                 //     msg = data.msg;
        //                 // }
        //                 that.error = true;
        //                 that.errorMessage = Server.getErrorMessage(data.msg);
        //                 //self._showError(dialog,msg);
        //                 window.jQuery(that.$el).find('[crud-button="ok"]').addClass("disabled");
        //                 that.value =  JSON.stringify({});
        //                 that.fileInfo = null;
        //                 return;
        //             }
        //             that.$emit('success', that);
        //             that.complete = true;
        //
        //             console.log('done, data.result', data.result);
        //
        //             //that.lastUpload = Object.assign({},data.result);
        //             that.fileInfo = Object.assign({},data.result);
        //             // TODO sfruttare meglio l'oggetto upload primeface
        //             that.value = JSON.stringify(data.result); //.replace(/\\"/g, '"');
        //             //that.$refs.preview.setValue(data.result);
        //             that.onSuccess();
        //         } else {
        //             console.log("An error occurred, the files couldn't be sent!");
        //             that.fileInfo = null;
        //             that.error = true;
        //             that.errorMessage = Server.getErrorMessage(data.msg);
        //             that.value = JSON.stringify({});
        //             that.onError();
        //         }
        //
        //     });
        // };
        if (conf.value && (conf.value instanceof Object)) {
            conf.fileInfo = conf.value;
            conf.value = JSON.stringify(conf.value);
        }
    },
    wPreview(conf) {
        if (!conf.height) {
            conf.height = '30';
        }
        console.debug('wPreview',conf);
        return conf;
    }
}
