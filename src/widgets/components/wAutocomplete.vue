
<template>
    <div class="p-inputgroup">

      <Button icon="fa fa-times" @click="clear"/>
      <AutoComplete class="w-full" :name="iconf.name" v-model="iconf.autocompleteValue" :suggestions="iconf.suggestions"
                    @complete="search" :option-label="getAutocompleteLabel" option-value="id"
                    v-bind="iconf.extraBind" @change="onChange" @item-select="itemSelect"/>
    </div>
</template>
<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wAutocomplete",
    extends: wBase,
    setup(props, { emit }) {
        WidgetsWrapperConf.setConf(props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    methods: {
        clear(event) {
            this.iconf.value = null;
            this.iconf.autocompleteValue = null;
        },
        setRoute(force) {
            let conf = this.iconf;
            let that = this;
            if (!conf.route || force) {
                conf.route = that.createRoute('autocomplete');
                conf.route.setValuesFromObj(conf);
            }
            console.debug('autocompleted mounted',this.iconf.route);
        },
        search(event) {
            let conf = this.iconf;
            let that = this;
            if (conf.search) {
                conf.search.apply(this,[event]);
                return ;
            }
            let field = conf.autocompleteField?conf.autocompleteField:conf.name;
            that.setRoute();
            conf.route.setParams({
                field : field,
                value : event.query,
            });

            console.log('route',conf.route,that);
            that.core().Server.route(conf.route,function (json) {
                console.log('json',json);
                console.debug('conf.suggestions',conf.suggestions)
                conf.suggestions = json.result;
            });
            console.log('search',conf,event);
        },
        getAutocompleteLabel (event) {
            let conf = this.iconf;
            if (conf.search) {
                conf.search.apply(this,[event]);
                return ;
            }
            if (conf.labelFields && conf.labelFields.length > 0) {
                let label = '';
                for (let i in conf.labelFields) {
                    label += event[conf.labelFields[i]] + ' ';
                }
                return label;
            }
            return event.label;
            //console.log(that,'label',event);
        },
        itemSelect(event) {
            let conf = this.iconf;
            if (conf.itemSelect) {
                conf.itemSelect.apply(this,[event]);
                return ;
            }
            this.value = this.iconf.autocompleteValue.id;
        },
    },

}
</script>

<style scoped>

</style>
