<script setup>
import { useModelWrapper } from './modelWrapper'
import {defineEmits, ref, onMounted, watch} from 'vue'
import WidgetsWrapperConf from "../confs/WidgetsWrapperConf";
import CrudCore from "../core/CrudCore";

const emit = defineEmits(['message','draft'])


const props = defineProps({
  //modelValue: String,
  //draft: Boolean,
  conf : {
    type : Object,
    default() {
      return {
        type : 'w-input',
        name : 'name',
        value : '200',
        errors : [],
      }
    }
  }
})
const _conf = useModelWrapper(props, emit, 'conf');

watch(props.conf,async (newvalue,oldvalue) => {
  // console.debug('woathc props',newvalue);
  // let w = new WrapperConf();
  // _conf.value = w.loadConf(_conf.value);

})

onMounted(() => {
  setConf(_conf.value);
  // let w = new WrapperConf();
  // let defaultConf = w.loadConf({type:_conf.type});
  // let mergedConf = Object.assign(defaultConf,_conf.type);
  // for (let k in mergedConf) {
  //   _conf.value[k] = mergedConf[k];
  // }
  //_conf.value.value = 10;
  // setTimeout(function () {
  //   _conf.value = w.loadConf(_conf.value);
  //   console.debug('_conf.value',_conf.value)
  // },10)
  //_conf.value = w.loadConf(_conf.value);

})
function change(event) {
  console.debug('cWidget',_conf.value.type, event);
}
//const message =  useModelWrapper(props, emit, 'modelValue');
//const isDraft = useModelWrapper(props, emit, 'draft');


// ---- metodi esterni
function setConf(config) {
  let w = new WidgetsWrapperConf();
  let defaultConf = w.loadConf(config);
  let mergedConf = Object.assign(defaultConf,config);
  console.debug('config',config);
  setTimeout(function () {
    for (let k in mergedConf) {
      _conf.value[k] = mergedConf[k];
    }
    console.debug('setConf',_conf.value);
  },10)

}

defineExpose({setConf})

</script>
<template>
<!--    <div>-->
<!--        <label>-->
<!--            <input type="text" v-model="message" >-->
<!--        </label>-->
<!--        <label>-->
<!--            <input type="checkbox" v-model="isDraft"> Draft-->
<!--        </label>-->
<!--    </div>-->
    <div>
        <template v-if="_conf.type==='w-hidden'">
            <input type="hidden" :name="_conf.name" v-model="_conf.value" v-bind="_conf.extraBind" @change="change"/>
        </template>
        <template v-else-if="_conf.type==='w-input'">
            <input type="hidden" :name="_conf.name" v-model="_conf.value" v-bind="_conf.extraBind" @change="change"/>
            <Password v-if="_conf.inputType == 'password'" :inputProps="{'name':_conf.name}" :name="_conf.name" v-model="_conf.value" toggleMask v-bind="_conf.extraBind"
                      @change="change" :class="_conf.errors && _conf.errors.length?'p-invalid':''"
                      :promptLabel="CrudCore.translate('app.scegli-password')" :weakLabel="CrudCore.translate('app.password-semplice')"
                      :mediumLabel="CrudCore.translate('app.password-media')" :strongLabel="CrudCore.translate('app.password-complessa')" />
            <InputText v-else class="w-full" :name="_conf.name" :type="_conf.inputType" v-model="_conf.value" v-bind="_conf.extraBind"
                       @change="change" :class="_conf.errors && _conf.errors.length?'p-invalid':''"></InputText>
        </template>
        <template v-else-if="_conf.type=='w-select'">
            <div>
                <input type="hidden" :name="_conf.name" :value="_conf.value">
                <Dropdown class="w-full" :name="_conf.name" v-model="_conf.value" :options="_conf.options"
                          option-label="label" option-value="id" :placeholder="_conf.placeholder || CrudCore.translate('app.seleziona')"
                          v-bind="_conf.extraBind" @change="change">
                    <template #option="slotProps">
                        <div
                            :class="'select-button-option select-button-option-'+_conf.name+ ' select-button-option-'+_conf.name+'-'+slotProps.option.id"
                            v-html="slotProps.option.label">
                        </div>
                    </template>
                </Dropdown>
            </div>
        </template>
        <template v-else-if="_conf.type=='w-select-button'">
          <input type="hidden" :name="_conf.name" v-model="_conf.value">
          <SelectButton :name="_conf.name" v-model="_conf.value" :options="_conf.options"
                        option-label="label" option-value="id"
                        v-bind="_conf.extraBind" @change="change">
            <template #option="slotProps">
              <div
                  :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.option.id"
                  v-html="slotProps.option.label">
              </div>
            </template>
          </SelectButton>
        </template>
        <template v-else-if="_conf.type=='w-autocomplete'">
          <div>
            <input type="hidden" :name="_conf.name" v-model="_conf.value">
            <div class="p-inputgroup">

              <Button icon="fa fa-times" @click="change($event,'clear')"/>
              <AutoComplete class="w-full" :name="_conf.name" v-model="_conf.autocompleteValue" :suggestions="_conf.suggestions"
                            @complete="_conf.search" :option-label="_conf.getAutocompleteLabel" option-value="id"
                            v-bind="_conf.extraBind" @change="change" @item-select="_conf.itemSelect"/>
            </div>
          </div>
        </template>
        <template v-else-if="_conf.type=='w-checkbox'">
            <div class="w-full flex" :class="_conf.direction=='row'?'flex-row':'flex-column'">
                <div class="field-checkbox mr-2" v-for="(label,key) in _conf.domainValues" :key="key">
                    <Checkbox :name="_conf.name" v-model="_conf.value" :value="key" v-bind="_conf.extraBind" @change="change"/>
                    <label :for="key" v-html="label"></label>
                </div>
            </div>
        </template>
        <template v-else-if="_conf.type=='w-radio'">
            <div class="w-full flex border-1 border-round-sm surface-border p-2"
                 :class="_conf.direction=='row'?'flex-row':'flex-column'">
                <div class="field-radiobutton mr-2" v-for="(label,key) in _conf.domainValues" :key="key">
                    <RadioButton :name="_conf.name" v-model="_conf.value" :value="key" v-bind="_conf.extraBind" @change="change"/>
                    <label :for="key" v-html="label"></label>
                </div>
            </div>
        </template>
        <template v-else-if="_conf.type=='w-text'">
            <component :is="_conf.tagContainer" :class="_conf.textClass">{{ _conf.value }}</component>
        </template>
    </div>
</template>
<script>
export default {
  name : "cWidget",
  props : {
    conf : {
      type : Object,
      default() {
        return {
          name : '',
          value: null,
          placeholder : '',
          extraBind: {},
          type : 'w-input',
          label : '',
          rules:'',
          errors : [],
        }
      }
    }
  },
  setup(props, { emit }) {
    return {
      _conf: useModelWrapper(props, emit),
    }
  }
}
</script>



