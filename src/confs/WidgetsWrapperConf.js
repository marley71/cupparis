import CrudCore from "../core/CrudCore.js"
import Server from "../core/Server.js";

export default class WidgetsWrapperConf {
    defaultConf =  {
        name : '',
        value: null,
        placeholder : '',
        extraBind: {},
        type : 'w-input',
        label : '',
        rules:'',
    }

    loadConf(conf) {
        let that = this;
        //console.log('WIDGET CONF',conf);
        let dC = CrudCore.clone(this.defaultConf); //Object.assign({},this.defaultConf);
        conf.type = conf.type || that.defaultConf.type;
        let functionName = CrudCore.camelCase(conf.type);
        //console.log('functionName',functionName)
        if (that[functionName]) {
            conf = that[functionName](conf);
        }
        conf = Object.assign(dC,conf);
        //console.log('WIDGET',conf);
        return conf;
    }

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
    }
    wInput(conf) {
        if ( !('inputType' in conf) ) {
            conf.inputType = 'text';
        }
        return conf;
    }

    wSelect(conf) {
        conf.options = this.mapOptions(conf.domainValues,conf.domainValuesOrder);
        return conf;
    }

    wHasmany(conf) {
        if (!conf.hasmanyType) {
            conf.hasmanyType = 'record';
        }
        if (!conf.hasmanyConf) {
            conf.hasmanyConf = {};
        }
        if (!conf.hasmanyConf.fieldsConfig) {
            conf.hasmanyConf.fieldsConfig = {};
        }
        if (!conf.displayTitle && conf.displayTitle !== false) {
            conf.displayTitle = false;
        }
        conf.hasmanyConf.defaultWidgetType = 'w-input';
        return conf;
    }
    wSelectButton(conf) {
        conf.options = this.mapOptions(conf.domainValues,conf.domainValuesOrder);
        return conf;
    }

    wText(conf) {
        conf.textClass = conf.textClass || '';
        return conf;
    }

    wBelongsto(conf) {
        conf.labelFields = conf.labelFields || ['label'];
        conf.separator =  conf.separator || ' ';
        return conf;
    }

    wAutocomplete(conf) {
        conf.route = null;
        conf.suggestions = [];
        //console.log('referredData',conf.referredData);
        let __initialValue = function () {
            //console.log('extra bind ',conf.extraBind['option-label'],conf);
            if (conf.extraBind['option-label']) {
                if (conf.extraBind['option-label'] instanceof  Function) {
                    return conf.extraBind['option-label'](conf.referredData);
                }
                return conf.referredData[conf.extraBind['option-label']];
            }
            return conf.referredData['label'];
        }
        if (conf.referredData) {
            // let label = 'label'
            // conf.autocompleteValue  = conf.referredData[label]; //conf.referredData;
            conf.autocompleteValue = __initialValue();
            conf.suggestions = [conf.referredData];
        }

        conf.search = conf.search || function (event) {
            let that = this;

            if (!conf.route) {
                conf.route = that.createRoute('autocomplete');
                conf.route.setValuesFromObj(that);
            }
            let field = conf.autocompleteField?conf.autocompleteField:conf.name;
            conf.route.setParams({
                field : field,
                value : event.query,
            });

            console.log('route',that.route,that);
            that.Server.route(that.route,function (json) {
                console.log('json',json);
                that.suggestions = json.result;
            });
            console.log('search',conf,event);
        }

        conf.getAutocompleteLabel = conf.getAutocompleteLabel || function(event) {
            let that = this;

            if (that.labelFields && that.labelFields.length > 0) {
                let label = '';
                for (let i in that.labelFields) {
                    label += event[that.labelFields[i]] + ' ';
                }
                return label;
            }
            return event.label;
            //console.log(that,'label',event);
        }

        return conf;
    }

    wCheckbox(conf) {
        if (!conf.direction) {
            conf.direction = 'row';
        }

        return conf;
    }

    wRadio(conf) {
        if (!conf.direction) {
            conf.direction = 'row';
        }
        return conf;
    }
    wDatePicker(conf) {
        console.log("DATEEEE",conf.value);
        if (conf.value) {
            conf.dateValue = new Date(conf.value);
            console.log("DATEEEE",conf.dateValue);
        }
        return conf;
    }
    wDateText(conf) {
        // if (!conf.displayFormat)
        //     conf.displayFormat = 'DD/MM/YYYY';
        // conf.dateFormat = 'yyyy-mm-dd';
        // conf.formattedValue = null;
        // conf.invalidDateString ='app.data-non-valida';
        return Object.assign({
            displayFormat : 'DD/MM/YYYY',
            dateFormat : 'yyyy-mm-dd',
            formattedValue : null,
            invalidDateString : 'app.data-non-valida'
        },conf);
        //return conf;
    }
    wMultiSelect(conf) {
        let value = conf.value || [];
        if (!Array.isArray(value))
            value = [value];
        let selectedValue = value.length > 0 ? [] : null;
        let dV = conf.domainValues || {};
        let dVO = conf.domainValuesOrder || Object.keys(dV);
        let options = [];
        for (var i in dVO) {
            options.push({
                code : ""+dVO[i],
                name : dV[dVO[i]],
            })
        }
        if (value) {
            for (let i in value) {
                value[i] = ""+value[i];
            }
        }
        for (let i in value) {
            selectedValue.push(
                {
                    code : value[i],
                    name : dV[value[i]],
                }
            )
        }
        conf.selectedValue = value;
        conf.defaultValue = [];
        conf.options = options;
        conf.filter = false;
        return conf;
    }
    wSwap(conf) {
        conf = Object.assign({
            activeIcon: 'fa-check',
            routeName: 'set',
            title: 'swap',
            bgInactive: '#FF0000',
            bgActive: 'bg-red-400',
            domainValues: {
                0: 'app.no',
                1: 'app.si'
            },
            slot: '',
            toggleActive: false,
            switchClass: 'form-switch-success',
            dataSwitched: false,
            isAjax:true,  // se e' un controllo che deve fare la chiamata di update altrimenti e' un controllo normale in una form
            json : null, // ultimo json caricato dalla chiamata ajax,
            currentIndex : 0,  // indice corrente delle chiavi di domainValues
        },conf);
        conf.change = conf.change || function() {};
        //console.log('SWAP',conf);
        return conf;
    }

    wSwapSelect(conf) {
        conf = Object.assign({
            activeIcon: 'fa-check',
            routeName: 'set',
            title: 'swap-select',
            bgInactive: '#FF0000',
            bgActive: 'bg-red-400',
            domainValues: {
                "-1": 'app.seleziona',
            },
            slot: '',
            toggleActive: false,
            isAjax:true,  // se e' un controllo che deve fare la chiamata di update altrimenti e' un controllo normale in una form
            json : null, // ultimo json caricato dalla chiamata ajax,
            currentIndex : 0,  // indice corrente delle chiavi di domainValues
            reload: false,
        },conf);
        conf.change = conf.change || function() {};
        conf.options = this.mapOptions(conf.domainValues,conf.domainValuesOrder);
        console.log('SWAP-SELECT',conf);
        return conf;
    }

    wStatus(conf) {
        if (!("domainValues" in conf)) {
            conf.domainValues = {
                0: 'app.no',
                1: 'app.si'
            };
        }
        if (! ("value" in conf) ){
            conf.value = Object.keys(conf.domainValues)[0];
        }
        conf.currentValue = conf.domainValues[conf.value];
        return conf;
    }

    wTexthtml(conf) {
        if (!("toolbar" in conf)) {
            conf.toolbar = null;
        }
        return conf;
    }

    wUpload(conf) {
        conf.files = null;
        if (!conf.uploadFile) {
            conf.uploadFile = function(event) {
                this.files = event.files;
                console.log('uploadevent',event,this);
            }
            conf.getValue = function () {
                return this.value;
            }
            conf.getFileValue = function () {
                return this.files;
            }
        }
        return conf;
    }
    wUploadAjax(conf) {
        conf = this.wUpload(conf);
        conf.routeName = 'uploadfile';
        conf.error = false;
        conf.errorMessage = '';
        conf.fileInfo = null;
        if (!conf.setRouteValues) {
            conf.setRouteValues =  function (route) {
                route.setValues({
                    modelName: this.modelName
                })
                return route;
            }
        }
        if (!conf.onSuccess) {
            conf.onSuccess = function () {
                console.log('onSuccess',this.value);
            }
        }
        if (!conf.onError) {
            conf.onError = function () {
                console.log('onError',this.value);
            }
        }

        conf.uploadFile = function(event) {
            this.files = event.files;
            this.sendAjax();
        }
        conf.sendAjax =  function () {
            var that = this;
            var fDesc = that.getFileValue();
            if (!fDesc || !fDesc[0])
                throw 'descrittore file upload non valido';
            fDesc = fDesc[0];
            // var fileName = fDesc.filename;
            var route = that.createRoute(that.routeName);
            that.setRouteValues(route);
            that.error = false;
            that.complete = false;

            var realUrl = Server.getUrl(route.getUrl());
            console.log('realurl', route.getUrl())
            var fdata = new FormData();
            //data.append('file',jQuery(that.$el).find('[c-image-file]').prop('files')[0]);
            fdata.append('file', fDesc)
            console.log('ajaxFields', that.ajaxFields)
            for (var k in that.ajaxFields)
                fdata.append(k, that.ajaxFields[k])
            Server.post(realUrl,fdata,function(data) {
                that.json = data;
                if (!data.error) {
                    console.log("Success: Files sent!", data);
                    if (data.error) {
                        // var msg = null;
                        // try {
                        //     var tmp = JSON.parse(data.msg);
                        //     msg = "";
                        //     for (k in tmp) {
                        //         msg += tmp[k] + '\n';
                        //     }
                        // } catch (e) {
                        //     msg = data.msg;
                        // }
                        that.error = true;
                        that.errorMessage = Server.getErrorMessage(data.msg);
                        //self._showError(dialog,msg);
                        window.jQuery(that.$el).find('[crud-button="ok"]').addClass("disabled");
                        that.value =  JSON.stringify({});
                        that.fileInfo = null;
                        return;
                    }
                    that.$emit('success', that);
                    that.complete = true;

                    console.log('done, data.result', data.result);

                    //that.lastUpload = Object.assign({},data.result);
                    that.fileInfo = Object.assign({},data.result);
                    // TODO sfruttare meglio l'oggetto upload primeface
                    that.value = JSON.stringify(data.result); //.replace(/\\"/g, '"');
                    //that.$refs.preview.setValue(data.result);
                    that.onSuccess();
                } else {
                    console.log("An error occurred, the files couldn't be sent!");
                    that.fileInfo = null;
                    that.error = true;
                    that.errorMessage = Server.getErrorMessage(data.msg);
                    that.value = JSON.stringify({});
                    that.onError();
                }

            });
        };
        if (conf.value && (conf.value instanceof Object)) {
            conf.fileInfo = conf.value;
            conf.value = JSON.stringify(conf.value);
        }
        return conf;
    }
    wPreview(conf) {
        if (!conf.height) {
            conf.height = '30';
        }
        console.debug('wPreview',conf);
        return conf;
    }
}
