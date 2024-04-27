<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../../core/modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wSelect",
    extends: wBase,
    setup(props, { emit }) {
        WidgetsWrapperConf.setConf(props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>

<template>
    <Dropdown class="w-full" :name="iconf.name" v-model="iconf.value" :options="iconf.options"
              option-label="label" option-value="id" :placeholder="iconf.placeholder || translate('app.seleziona')"
              v-bind="iconf.extraBind" @change="onChange">
        <template #option="slotProps">
            <div
                :class="'select-button-option select-button-option-'+iconf.name+ ' select-button-option-'+iconf.name+'-'+slotProps.option.id"
                v-html="slotProps.option.label">
            </div>
        </template>
    </Dropdown>
</template>

<style scoped>

</style>
