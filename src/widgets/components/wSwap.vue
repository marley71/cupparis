<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../../core/modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
import CrudCore from "../../core/CrudCore";
export default {
    name: "wSwap",
    extends: wBase,
    setup(props, { emit }) {
        WidgetsWrapperConf.setConf(props.conf);
        // let wc = new WidgetsWrapperConf();
        // props.conf = wc.loadConf(props.conf);
        // console.debug('PROPS CONF',props.conf);
        // props.conf.extraBind = {};
        // props.conf.label = "";
        // props.conf.rules = "";
        // props.conf.activeIcon = "fa-check";
        // props.conf.routeName = "set";
        // props.conf.title = "swap";
        // props.conf.bgInactive = "#FF0000";
        // props.conf.bgActive = "bg-red-400";
        // props.conf.domainValues = {
        //     "0": CrudCore.translate("app.no"),
        //     "1": CrudCore.translate("app.si"),
        // },
        // props.conf.slot = "";
        // props.conf.toggleActive = false;
        // props.conf.switchClass = "form-switch-success";
        // props.conf.dataSwitched = false;
        // props.conf.isAjax = true;
        // props.conf.json = null;
        // props.conf.currentIndex = 0;

        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    mounted() {
        var that = this;
        console.debug('swap mounted',that.iconf);
        var keys = Object.keys(that.iconf.domainValues);
        that.currentIndex = keys.indexOf(''+that.iconf.value);
        that.toggleActive = that.currentIndex?true:false;
    },
    data() {
        return {
            currentIndex : 0,
            toggleActive : false,
        }
    },
    methods: {
        setRouteValues: function (route) {
            var that = this;
            route.setValues({
                modelName: that.iconf.modelName,
            });
            route.setParams({
                id: that.iconf.modelData.id,
                field: that.iconf.name,
                value: that.iconf.toggleValue?1:0,
            });
            return route;
        },
        _swap: function () {
            var that = this;
            if (that.iconf.isAjax) {
                var r = that.createRoute(that.iconf.routeName);
                that.setRouteValues(r);
                that.waitStart()
                that.core().Server.route(r, function (json) {
                    that.waitEnd();
                    that.iconf.json = json;
                    if (json.error) {
                        that.errorDialog(json.msg);
                        return;
                    }
                    that.iconf.value = that.iconf.toggleValue?1:0;
                    that.onChange();
                })
            } else {
                that.iconf.value = that.iconf.toggleValue?1:0;
                that.onChange();
            }

        },
        swap(event) {
            var that = this;
            that._swap();
        },
        /**
         * sposta l'indice di uno e restituisce il valore successivo
         * @private
         */
        _getNext() {
            var that = this;
            var keys = Object.keys(that.iconf.domainValues);
            var newIndex = (that.currentIndex + 1) % keys.length;
            //console.log('_getNext','value',keys[newIndex], 'index', newIndex);
            that.currentIndex = newIndex;
            return keys[newIndex];
        },
    }
}
</script>

<template>
    <InputSwitch v-model="iconf.toggleValue" @change="swap" :disabled="iconf.extraBind.disabled?true:false"/>
</template>

<style scoped>

</style>
