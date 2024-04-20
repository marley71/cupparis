<template>
    <template v-if="layout=='simple'">
        <div class="flex p-buttonset border border-round">
            <!-- :style="'width:'+(Object.keys(actions).length * 30)+ 'px'" -->
            <a-base v-for="(action,key) in actions" :key="key" :ref="key" :conf="getConf(action,key)"></a-base>
        </div>
    </template>
    <template v-else-if="layout=='buttons'">
        <div class="flex">
            <template v-for="(action,key) in getActions()" :key="key">
                <a-base :ref="key" :conf="getConf(action,key)" v-if="inWhitelist(key)"></a-base>
            </template>
        </div>
    </template>
    <template v-else-if="layout=='menubar'">
        <Menubar :model="menubarActions" class="w-full">
            <template v-if="title" #start>
                <span>{{ title }}</span>
            </template>
        </Menubar>
    </template>
    <template v-else>
        <div>
            {{layout}} : Layout non riconosciuto
        </div>
    </template>

</template>

<script>
//import WrapperConf from "./WrapperConf";
import CrudComponent from "../CrudComponent.vue";
import ABase from "./aBase.vue";
//import Server from "../lib/Server";

export default {
    name: "c-action",
    components: {ABase},
    extends: CrudComponent,
    props: {
        //'conf': Object,
        'layout': {
            type: String,
            default: 'buttons'
        },
        'whitelist': Array,
        'blacklist': Array,
        'menubarTitle': String,
    },
    data() {
        let that = this;
        if (!that.conf) {
            console.warn('cAction conf null', that.conf);
        }
        let cf = that.conf || {};
        cf.title = '';
        if (that.layout == 'menubar') {
            cf.menubarActions = that.getMenubarActions();
        }
        return cf;
    },
    methods: {

        getConf(actionConf, actionKey) {
            var that = this;
            actionConf.spacing = that.getSpacing(actionConf, actionKey);

            //console.log("ALAYOUT",that.layout,actionConf);
            return actionConf;
        },
        getSpacing(actionConf, actionKey) {
            var that = this;
            if (actionConf.spacing) {
                return actionConf.spacing;
            }
            switch (that.layout) {
                case 'simple':
                    return '';
                case 'buttons':
                    return (actionKey === that.getLastAction())
                        ? '' : 'mr-2';
                default:
                    return '';
            }
        },
        getActions() {
            var that = this;
            //console.log("GETA", that, that.actions);
            if (that.actions) {
                return that.actions;
            }
            return that;
        },

        getWhitelist() {
            var that = this;
            if (!that.whitelist) {

                var whitelist = that.conf.actions
                    ? Object.keys(that.conf.actions)
                    : Object.keys(that.conf);

                if (that.blacklist) {
                    for (var b in that.blacklist) {
                        var index = whitelist.indexOf(that.blacklist[b]);
                        if (index !== -1) {
                            whitelist.splice(index, 1);
                        }
                    }
                }
                //console.log("WHITELIST:::",whitelist);
                return whitelist;

            }
            //console.log("WHITELIST:::",that.whitelist);
            return that.whitelist;
        },
        inWhitelist(key) {
            var that = this;
            var whitelist = that.getWhitelist();
            //console.log("WHITELISTTTT",whitelist,key,whitelist.includes(key))
            return whitelist.includes(key);
        },
        getLastAction() {
            var that = this;
            var whitelist = that.getWhitelist();
            return (whitelist.length === 0) ? '' : whitelist[whitelist.length - 1];
        },
        getFirstAction() {
            var that = this;
            var whitelist = that.getWhitelist();
            return (whitelist.length === 0) ? '' : whitelist[0];
        },
        instance(key) {
            //console.log('actions ref', key, this.$refs, this.$refs[key])
            return this.$refs[key][0];
        },
        getMenubarActions() {
            let that = this;
            let items = [];
            //console.log('actions',that.conf);
            let actions = that.conf.actions;
            for (let name in actions) {

                items.push({
                    label: that.translate(actions[name].text),
                    icon: actions[name].icon,
                    command: () => {
                        console.log('name', name, actions[name]);
                        actions[name].execute()
                    },
                    disabled: actions[name].disabled,
                    action: name,
                })
            }
            //console.log('menubar', items, that.conf);
            return [{
                label: this.menubarTitle ? this.menubarTitle : this.translate('app.actions'),
                items: items
            }]
        }
    }
}
</script>

<style scoped>

</style>
