import cImport from "./cImport.vue";
import cManage from "./cManage.vue";

export default {
    install (app) {
        app.component('c-import',cImport);
        app.component('c-manage', cManage);
    },
    cImport,cManage
}
