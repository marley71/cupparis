<script>
import { useModelWrapper } from './core/modelWrapper'
import CrudCore from "./core/CrudCore";
//import WidgetsWrapperConf from "./confs/WidgetsWrapperConf";
import Route from './core/Route';
import routeConfs from "./confs/routes";
import Server from "./core/Server";
import CrudVars from "./confs/CrudVars";

export default {
    name : "CrudComponent",
    props : {
        conf : {
            type : Object,
            default() {
                return {}
            }
        }
    },
    setup(props, { emit }) {
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    // mounted() {
    //     let that = this;
    //     if (that.iconf.ready) {
    //         setTimeout(function () { // per permettere l'esistenza del domhtml
    //             that.iconf.ready.apply(this);
    //         },20);
    //     }
    // },
    methods : {
        /**
         * ritorna la traduzione della chiave passata presente nel vettore $lang altrimenti ritorna al chiave stessa
         * @param key
         * @param plural
         * @param params
         * @returns {*}
         */
        translate : function (key,context,plural,params) {
            var langKey = context ? context + '.' + key : key
            return CrudCore.translate(langKey, plural, params)
        },

        translateUc : function (key,context,plural,params) {
            var langKey = context ? context + '.' + key : key
            return CrudCore.upperCaseFirst(CrudCore.translate(langKey, plural, params))
        },
        // setConf(config) {
        //     let that = this;
        //     let defaultConf = WidgetsWrapperConf.setConf(config);
        //     let mergedConf = Object.assign(defaultConf,config);
        //     console.debug('config',config);
        //     setTimeout(function () {
        //         for (let k in mergedConf) {
        //             that.iconf[k] = mergedConf[k];
        //         }
        //         console.debug('setConf',that.iconf);
        //     },10)
        // },
        // --- eventi
        // change(event) {
        //     console.debug('change',event)
        //     if (this.conf.change && (this.conf.change instanceof Function) ) {
        //         this.conf.change.apply(this,event);
        //     }
        // },
        getValue() {
            return this.iconf.value;
        },
        setValue(val) {
            this.iconf.value = val;
        },
        createRoute : function(routeName) {
            if (!routeConfs[routeName]) {
                throw "routeName " + routeName + ' non trovata!'
            }
            let routeConf =  JSON.parse(JSON.stringify(routeConfs[routeName]))  //Object.assign({},routeConfs[routeName]);
            console.log('routeName',routeName,routeConf);
            if (!routeConf)
                throw "Impossibile trovare la route " + routeName;
            return new Route(routeConf);
        },
        core() {
            return {
                Server : Server
            };
        },
        waitStart(msg) {
            CrudCore.waitStart(msg);
        },
        waitEnd() {
            console.log('waitEnd');
            CrudCore.waitEnd()
        },
        alertError(msg,cTime) {
            CrudCore.alertError(msg,cTime);
        },
        alertInfo(msg,cTime) {
            CrudCore.alertInfo(msg,cTime);
        },
        alertWarning(msg,cTime) {
            CrudCore.alertWarning(msg,cTime);
        },
        alertSuccess(msg,cTime) {
            CrudCore.alertSuccess(msg,cTime);
        },
        messageDialog(msg,props,callbacks) {
            CrudCore.messageDialog(msg,props,callbacks);
        },
        errorDialog(msg,props,callbacks) {
            CrudCore.errorDialog(msg,props,callbacks);
        },
        warningDialog(msg,props,callbacks) {
            CrudCore.warningDialog(msg,props,callbacks);
        },

        confirmDialog(msg,props,callbacks) {
            CrudCore.confirmDialog(msg,props,callbacks);
        },
        customDialog(msg,props,callbacks) {
            CrudCore.customDialog(msg,props,callbacks);
        },

        getDefaultViewConf(modelName,type) {
            let mn = 'Model' + CrudCore.upperCaseFirst(CrudCore.camelCase(modelName));
            let mc = CrudVars.modelConfs[mn] || {};
            console.log('ModelConfs key',mn,mc);
            if (mc[type]) {
                return CrudCore.clone(mc[type]); // TODO mettere il clone
            }
            let dt = CrudVars.viewTypeToViewConf[type];
            console.log('ModelConfs.'+modelName+'.'+dt,mc[dt])
            if (mc[dt]) {
                return CrudCore.clone(mc[dt]);
            }
            return CrudVars.viewDefaultConfs[type] || {
                modelName : modelName,
                type : type,
            };
        },

        // componentDialog(compName,componentConf,title,dialogConf) {
        //     const div = document.createElement('div');
        //     document.body.appendChild(div);
        //     let  comp = defineAsyncComponent(() => import('./dialogs/dCustom.vue'))
        //     dialogConf = dialogConf || {
        //         title : title,
        //         display : true,
        //         callbacks : {},
        //     };
        //     let cc = {
        //         componentName : compName,
        //         componentConf : componentConf,
        //     };
        //     let d = createApp(comp,{
        //         confComponent : cc,
        //         conf : dialogConf
        //     });
        //     CrudCore.setupApp(d);
        //     d.mount(div);
        //     return d;
        // },
    }
}
</script>



