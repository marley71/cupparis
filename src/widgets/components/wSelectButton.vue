<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../../core/modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
export default {
    name: "wSelectButton",
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
  <SelectButton :name="iconf.name" v-model="iconf.value" :options="iconf.options"
                option-label="label" option-value="id"
                v-bind="iconf.extraBind" @change="onChange">
    <template #option="slotProps">
      <div
          :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.option.id"
          v-html="slotProps.option.label">
      </div>
    </template>
  </SelectButton>
</template>

<style scoped>

</style>
