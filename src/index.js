import cWidget from "./widgets/cWidget.vue"
import cView from './views/cView.vue'
import routeConfs from "./confs/routes";
import routerConf from "./confs/router";
import actions from "./confs/actions";
import views from "./confs/views";
import CrudVars from "./confs/CrudVars";
import CrudCore from "./core/CrudCore";
import Server from './core/Server';
export default {
    cWidget,
    cView,
    conf : {
        routes : routeConfs,
        actions : actions,
        views : views,
        router :routerConf
    },
    CrudVars,
    CrudCore,
    Server
}
