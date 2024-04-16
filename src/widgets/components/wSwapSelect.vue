<script>
import wSwap from './wSwap.vue'
import {useModelWrapper} from "../modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wSwapSelect",
    extends: wSwap,
    setup(props, { emit }) {
        WidgetsWrapperConf.setConf(props.conf);
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

    }
}
</script>

<template>
    <Dropdown class="w-full" :name=iconf.name v-model="iconf.value" :options="iconf.options"
              option-label="label" option-value="id" :placeholder="iconf.placeholder || translate('app.seleziona')"
              @change="swap()" v-bind="extraBind">
        <template #option="slotProps">
            <div
                :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.option.id"
                v-html="slotProps.option.label">
            </div>
        </template>
    </Dropdown>
</template>

<style scoped>

</style>
