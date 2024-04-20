//import CrudCore from "@/cupparis/lib/CrudCore";

//import CrudCore from "../core/CrudCore";
export default class WrapperConf {
    defaultConf() {
        return {
            name : '',
            modelData:{},
            extraBind: {},
            controlType : 'button',
            href : '',
            icon : null,
            target : null,
            text : '',
            css : '',
            enabled : true,
        }
    }

    loadConf(conf) {
        let that = this;
        //let na = CrudCore.clone(conf);
        //DA LOOP IN COMPILAZIONE
        //conf = _.cloneDeep(conf)
        conf = Object.assign(that.defaultConf(),conf);

        // for (let key in conf.actions) {

        //     // console.log('key',key,conf.actions[key]);
        //     // let na = Object.assign(CrudCore.clone(that.defaultConf),CrudCore.clone(conf.actions[key]));
        //     // console.log('key1',key,na);

        //     let na = CrudCore.clone(conf.actions[key]);
        //     conf.actions[key] = Object.assign(that.defaultConf(),na);
        // }
        //console.debug('actions ------ ',conf);
        return conf;
    }
}
