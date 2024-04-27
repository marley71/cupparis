import vList from "../views/components/vList.vue";
import vListEdit from "../views/components/vListEdit.vue";
import vRecord from "../views/components/vRecord.vue";
import vInsert from '../views/components/vInsert.vue';
import vEdit from '../views/components/vEdit.vue';
import vView from '../views/components/vView.vue';
import cManage from "../app/cManage.vue";
import cImport from "../app/cImport.vue";
import CrudVars from "../confs/CrudVars";
import CrudCore from "../core/CrudCore";

function _getModelConf(obj,key) {
    let conf = obj;
    let keys = key.split('.');
    for(let i in keys) {
        conf = conf[keys[i]];
    }
    return CrudCore.clone(conf);
}

function _getModelConfInsert(obj,key) {
    let conf = obj;
    let keys = key.split('.');
    for(let i in keys) {
        conf = conf[keys[i]];
    }
    console.log('Insert conf',conf,obj,keys.length)
    if (!conf) {
        conf = obj[keys[keys.length-2]];
        conf = CrudCore.clone(conf.edit);
        conf.type = 'v-insert';
        return conf;
    }
    return CrudCore.clone(conf);
}

function _getManageConf(key,route) {
    if (!CrudVars.modelConfs[key]) {
        console.log(key,'route ',route,CrudVars.modelConfs);
        //document.location.href = '/#404'
        throw 'Not found'
        //return ;
        //document.location.href='/#' + btoa('notfound') // per sollevvare l'eccezione di pagina non trovata
        //throw 'Not found'
    }
    return  CrudCore.clone(CrudVars.modelConfs[key]);
}
var routerConf = null;
try {
    routerConf =  [
        // {
        //     path: '/',
        //     name: 'default',
        //     component: cPage,
        //     props: {cPath: ''}
        // },
        {
            path: '/list/:cConf',
            name: 'v-list',
            component: vList,
            props: route => ({ conf: _getModelConf(CrudVars.modelConfs,route.params.cConf) })
        },
        {
            path: '/list-edit/:cConf',
            name: 'v-list-edit',
            component: vListEdit,
            props: route => ({ conf: _getModelConf(CrudVars.modelConfs,route.params.cConf) })
        },
        {
            path: '/insert/:cConf',
            name: 'v-insert',
            component: vInsert,
            props: route => ({ conf: _getModelConfInsert(CrudVars.modelConfs,route.params.cConf) })
        },
        {
            path: '/record/:cConf',
            name: 'v-record',
            component: vRecord,
            props: route => ({ conf: _getModelConfInsert(CrudVars.modelConfs,route.params.cConf) })
        },
        {
            path: '/edit/:cConf/:cPk',
            name: 'v-edit',
            component: vEdit,
            props: route => ({ conf: Object.assign(_getModelConf(CrudVars.modelConfs,route.params.cConf),{pk:route.params.cPk} )})
        },
        {
            path: '/view/:cConf/:cPk',
            name: 'v-view',
            component: vView,
            props: route => ({ conf: Object.assign(_getModelConf(CrudVars.modelConfs,route.params.cConf),{pk:route.params.pk} )})
        },
        // {
        //     path: '/page/:cPath',
        //     name: 'c-page',
        //     component: cPage,
        //     props: true
        // },
        {
            path: '/manage/:cConf/:context*',
            name: 'c-manage',
            component: cManage,
            // redirect: to => {
            //     console.log('to',to,CrudVars.modelConfs);
            //     return {
            //         path: '/manage/:cConf',
            //         conf : _getManageConf(to.params.cConf,to)
            //     }
            // },
            props: route => ({ conf: _getManageConf(route.params.cConf,route) })
        },
        {
            path: '/import/:cConf',
            name: 'c-import',
            component: cImport,
            props: route => ({ conf: CrudVars.modelConfs[route.params.cConf] })
        },
        // {
        //     path: '/calendar/:cConf',
        //     name: 'c-calendar',
        //     component: cCalendar,
        //     props: true
        // }
    ];


} catch (e) {
    alert('route non trovata');
    //document.location.href='/'
}

export default routerConf;
