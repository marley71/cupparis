<script>
import CrudComponent from "../../CrudComponent.vue";
import Server from "../../core/Server";
import ViewsWrapperConf from "../../confs/ViewsWrapperConf";

export default {
    name: "vBase",
    extends: CrudComponent,
    // props: ['conf'],
    emits : ['loaded'],
    created() {
        let that = this;
        // var __call = function (lk) {
        //     that[lk] = function () {
        //         var localk = new String(lk);
        //         return that.__methods[localk].apply(that, arguments);
        //     }
        // }
        // for (let k in that.__methods) {
        //     __call(k);
        // }
        that.Server = Server;
    },
    mounted() {
        this.createViewRoute();
    },
    data() {
        // let that = this;
        // let dt = {
        //     __methods:{}
        // };
        // let wc = new WrapperConf(that);
        // let ext = wc.loadConf(that.conf);
        // for (let k in ext) {
        //     if (!(ext[k] instanceof Function) ) {
        //         dt[k] = ext[k];
        //     } else {
        //         dt.__methods[k] = ext[k];
        //     }
        // }
        // if (!dt.langContext && dt.langContext !== null) {
        //     dt.langContext = dt.modelName ? dt.modelName : ''
        //     dt.langContext += '.fields';
        // }
        // // normalizzo i type dei fieldsConfig in quanto si accettano anche stringhe che rappresentano il type 'w-hidden'
        // for (let key in dt.fieldsConfig) {
        //     //console.debug('--- key',key,dt.fieldsConfig[key])
        //     if (dt.fieldsConfig[key] && ( (dt.fieldsConfig[key] instanceof String) || (typeof dt.fieldsConfig[key] === 'string')) ) {
        //
        //         dt.fieldsConfig[key] = {
        //             type : dt.fieldsConfig[key]
        //         }
        //     }
        // }
        //
        // //console.log('view Props',dt);
        let dt = {
            loaded : true
        }
        return dt;
    },
    watch : {
        loaded() {
            if (this.loaded) {
                //console.log('LOADEDDDDDD',this.type)
                this.$emit('loaded',this.loaded);
            }
        }
    },
    methods : {

        draw() {
            this.setActions();
            this.loaded = true;
        },

        setActions() {

        },
        load() {
            let that = this;
            that.setRouteValues();
            that.beforeLoadData();
            that.loadData(function (json) {
                that.json = json;
                that.fillData(json);
                that.afterLoadData(json);
                that.setWidgetsConfig();
                that.draw();
            });
        },

        reload() {
            let that = this;
            that.loaded = false;
            that.load();
        },

        createViewRoute() {
            let that = this;
            if (!that.iconf.routeName)
                return ;
            if (!that.iconf.route) {
                that.iconf.route = that.createRoute(that.iconf.routeName);
            }
        },

        setRouteValues() {
            let that = this;
            console.debug('routeName',that.iconf.routeName)
            if (!that.iconf.routeName)
                return ;
            // if (!that.route) {
            //     that.route = that.createRoute(that.routeName);
            // }
            that.iconf.route.setValuesFromObj(that.iconf);
        },
        beforeLoadData() {

        },

        loadData(callback) {
            let that = this;
            if (!that.iconf.route) {
                callback({});
                return;
            }
            //console.log('fetchData',route.getConf());
            Server.route(that.iconf.route, function (json) {
                if (json.error) {
                    //that.errorDialog(json.msg).show();
                    that.alertError(json.msg,3000);
                    that.iconf.errorMsg = json.msg;
                    return
                }
                //that.afterLoadData(json);
                callback(json);
            })
        },
        afterLoadData() {

        },

        /**
         * riempe la view con i dati che arrivano dalla chiamata ajax della route
         * attraverso il protocollo definito nella route
         * @param route
         * @param json
         */
        fillData: function (json) {
            var that = this;
            if (that.iconf.route) {
                var protocol = that.createProtocol(that.iconf.route.getProtocol());
                console.log('fillData',json);
                protocol.jsonToData(json);
                var prop = Object.getOwnPropertyNames(protocol);
                for (var i in prop) {
                    that[prop[i]] = protocol[prop[i]];
                }
            }
            that.json = json;
        },

        setParams(params) {
            console.log('route set params',params);
            this.iconf.route.setParams(params);
            this.reload();
        },
        getParams() {
            return this.iconf.route.getParams();
        },

        getFieldName(field) {
            return field;
        },

        setFieldLabel(key,conf) {
            let that = this;
            if (!('label' in conf)) {
                conf.label = key;
                // se c'e' un langContext, applico la regola
                if (that.langContext) {
                    conf.label = that.translate(key + '.label', that.langContext);
                }
            } else {
                conf.label = that.translate(conf.label);
            }
            return conf;
        },
        getType() {
            return this.type.replace('v-','');
        },
        instance() {
            return this;
        },
        getVisibleFields() {
            var that = this;
            var visible = [];
            for (let i in that.iconf.fields) {
                if (!that.isHiddenField(that.iconf.fields[i]))
                    visible.push(that.iconf.fields[i]);
            }
            //console.log('VISIBLE FIELDS',visible);
            return visible;
        },
        getWidgetLayout(field,prop) {
            var that = this;
            var layout = that.iconf.widgetsConfig[field].layout;
            //console.debug(field,prop,"PROPLAYOUT",layout,'view layout',that.layout);
            if (!layout) {
                layout = that.iconf.layout;
            } else {
                layout = layout || {};
                for (var p in that.iconf.layout) {
                    if (!layout[p]) {
                        layout[p] = that.iconf.layout[p];
                    }
                }
            }
            //console.debug(field,"PROPLAYOUT",layout,prop);
            if (!prop) {
                return layout;
            }
            return layout[prop];
        },
        isHiddenField: function (key) {
            //console.debug('idHiddenField key',key);
            let type = this.iconf.defaultWidgetType;
            if (this.iconf.fieldsConfig[key] && this.iconf.fieldsConfig[key].type) {
                type = this.iconf.fieldsConfig[key].type
            }
            //console.log('idHiddenField',type);
            if (type == 'w-hidden' ||
                (type == 'w-input' &&
                    this.iconf.fieldsConfig[key] &&
                    this.iconf.fieldsConfig[key].inputType === 'hidden')
            ) {
                return true;
            }
            return false;
        },
        getHiddenFields() {
            var that = this;
            var hidden = [];
            for (let i in that.iconf.fields) {
                if (that.isHiddenField(that.iconf.fields[i]))
                    hidden.push(that.iconf.fields[i]);
            }
            //console.log('HIDDEN FIELDS',hidden);
            return hidden;
        },
        block() {
            this.blocked = true;
        },
        unblock() {
            this.blocked = false;
        },
        isBlocked() {
            return this.blocked;
        }
    }
}
</script>

<style scoped>

</style>
