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

    vListEdit(conf) {
        if (!conf.type) {
            conf.type = 'v-list-edit'
        }
        if (! ('actions' in conf) ){
            conf.actions = [
                'action-insert',
                'action-delete-selected',
                'action-view',
                'action-edit-mode',
                'action-delete',
                'action-save-row',
                'action-view-mode'
            ];
        }
        conf.widgetsConfig = [];
        conf.widgetsEditConfig = [];
        conf.recordActionsConf = [];
        conf.collectionActions = {};
        conf = this.vList(conf);
        return conf;

        /**
         * confParent: 'v-list',
         *             widgetsEdit: {}, // configurazioni widgets in modalità edit
         *             editMode: [],
         *             routeName: 'list',
         *             primaryKey: 'id',
         *             actionsConfig: {},
         *             fieldsConfig: {
         *                 id : {
         *                     type : 'w-input',
         *                     inputType : 'hidden'
         *                 }
         *             },
         *             fieldsConfigEditMode:{
         *                 id : {
         *                     type : 'w-input',
         *                     inputType : 'hidden'
         *                 }
         *             }, // configurazione campi in modalità edit
         *             orderFields: {},
         *             widgetTemplate: 'tpl-list',
         *             actions: [
         *                 'action-insert',
         *                 'action-delete-selected',
         *                 'action-view',
         *                 'action-edit-mode',
         *                 'action-delete',
         *                 'action-save-row',
         *                 'action-view-mode'
         *             ]
         */
    }
}
