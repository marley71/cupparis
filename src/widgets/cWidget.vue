<template>
<!--    <w-input v-if="conf.type==='w-input'" :conf="conf"></w-input>-->
<!--    <w-select v-else-if="conf.type==='w-select'" :conf="conf"></w-select>-->
<!--    <w-select-button v-else-if="conf.type==='w-select-button'" :conf="conf"></w-select-button>-->
<!--    <component v-else :is="type" :conf="conf"></component>-->

    <component :is="conf.type" :conf="conf"></component>

<!--    <div>-->
<!--        <template v-if="iconf.type==='w-hidden'">-->
<!--            <input type="hidden" :name="iconf.name" v-model="iconf.value" v-bind="iconf.extraBind" @change="change"/>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type==='w-input'">-->
<!--            <input type="hidden" :name="iconf.name" v-model="iconf.value" v-bind="iconf.extraBind" @change="change"/>-->
<!--            <Password v-if="iconf.inputType == 'password'" :inputProps="{'name':iconf.name}" :name="iconf.name" v-model="iconf.value" toggleMask v-bind="iconf.extraBind"-->
<!--                      @change="change" :class="iconf.errors && iconf.errors.length?'p-invalid':''"-->
<!--                      :promptLabel="translate('app.scegli-password')" :weakLabel="translate('app.password-semplice')"-->
<!--                      :mediumLabel="translate('app.password-media')" :strongLabel="translate('app.password-complessa')" />-->
<!--            <InputText v-else class="w-full" :name="iconf.name" :type="iconf.inputType" v-model="iconf.value" v-bind="iconf.extraBind"-->
<!--                       @change="change" :class="iconf.errors && iconf.errors.length?'p-invalid':''"></InputText>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-select'">-->
<!--            <div>-->
<!--                <input type="hidden" :name="iconf.name" :value="iconf.value">-->
<!--                <Dropdown class="w-full" :name="iconf.name" v-model="iconf.value" :options="iconf.options"-->
<!--                          option-label="label" option-value="id" :placeholder="iconf.placeholder || translate('app.seleziona')"-->
<!--                          v-bind="iconf.extraBind" @change="change">-->
<!--                    <template #option="slotProps">-->
<!--                        <div-->
<!--                            :class="'select-button-option select-button-option-'+iconf.name+ ' select-button-option-'+iconf.name+'-'+slotProps.option.id"-->
<!--                            v-html="slotProps.option.label">-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </Dropdown>-->
<!--            </div>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-select-button'">-->
<!--          <input type="hidden" :name="iconf.name" v-model="iconf.value">-->
<!--          <SelectButton :name="iconf.name" v-model="iconf.value" :options="iconf.options"-->
<!--                        option-label="label" option-value="id"-->
<!--                        v-bind="iconf.extraBind" @change="change">-->
<!--            <template #option="slotProps">-->
<!--              <div-->
<!--                  :class="'select-button-option select-button-option-'+name+ ' select-button-option-'+name+'-'+slotProps.option.id"-->
<!--                  v-html="slotProps.option.label">-->
<!--              </div>-->
<!--            </template>-->
<!--          </SelectButton>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-autocomplete'">-->
<!--          <div>-->
<!--            <input type="hidden" :name="iconf.name" v-model="iconf.value">-->
<!--            <div class="p-inputgroup">-->

<!--              <Button icon="fa fa-times" @click="change($event,'clear')"/>-->
<!--              <AutoComplete class="w-full" :name="iconf.name" v-model="iconf.autocompleteValue" :suggestions="iconf.suggestions"-->
<!--                            @complete="iconf.search" :option-label="iconf.getAutocompleteLabel" option-value="id"-->
<!--                            v-bind="iconf.extraBind" @change="change" @item-select="iconf.itemSelect"/>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-checkbox'">-->
<!--            <div class="w-full flex" :class="iconf.direction=='row'?'flex-row':'flex-column'">-->
<!--                <div class="field-checkbox mr-2" v-for="(label,key) in iconf.domainValues" :key="key">-->
<!--                    <Checkbox :name="iconf.name" v-model="iconf.value" :value="key" v-bind="iconf.extraBind" @change="change"/>-->
<!--                    <label :for="key" v-html="label"></label>-->
<!--                </div>-->
<!--            </div>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-radio'">-->
<!--            <div class="w-full flex border-1 border-round-sm surface-border p-2"-->
<!--                 :class="iconf.direction=='row'?'flex-row':'flex-column'">-->
<!--                <div class="field-radiobutton mr-2" v-for="(label,key) in iconf.domainValues" :key="key">-->
<!--                    <RadioButton :name="iconf.name" v-model="iconf.value" :value="key" v-bind="iconf.extraBind" @change="change"/>-->
<!--                    <label :for="key" v-html="label"></label>-->
<!--                </div>-->
<!--            </div>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-text'">-->
<!--            <component :is="iconf.tagContainer" :class="iconf.textClass">{{ iconf.value }}</component>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-belongsto'">-->
<!--            <div>-->
<!--                <span v-for="(field,index) in iconf.labelFields" :key="index">-->
<!--                    <span v-if="(iconf.separator && (index !== 0))">{{ iconf.separator }}</span>{{ iconf.value[field] }}-->
<!--                </span>-->
<!--            </div>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-custom'">-->
<!--            <div v-html="iconf.value"></div>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-color-picker'">-->
<!--            <ColorPicker v-model="iconf.value" @change="change" v-bind="iconf.extraBind"/>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-date-picker'">-->
<!--            <div>-->
<!--                <input type="hidden" :name="iconf.name" v-model="iconf.value">-->
<!--                <div class="p-inputgroup">-->
<!--                    <Button icon="fa fa-times" @click="change($event,'clear')" v-if="iconf.buttonClear"/>-->
<!--                    <Calendar class="w-full" :showButtonBar="true" v-model="iconf.dateValue" @date-select="change"-->
<!--                              inputDateFormat="YYYY-MM-DD" date-format="dd/mm/yy"-->
<!--                              v-bind="iconf.extraBind"-->
<!--                              @clear-click="change($event,'clear')"/>-->
<!--                </div>-->
<!--            </div>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-date-range-picker'">-->
<!--            <div>-->
<!--                <input type="hidden" :name="iconf.name" v-model="iconf.value">-->
<!--                <div class="p-inputgroup">-->
<!--                    <Button icon="fa fa-times" @click="change($event,'clear')" v-if="iconf.buttonClear"/>-->
<!--                    <Calendar class="w-full" :showButtonBar="true" v-model="iconf.dateValue" @date-select="change"-->
<!--                              inputDateFormat="YYYY-MM-DD" date-format="dd/mm/yy"-->
<!--                              v-bind="iconf.extraBind" selectionMode="range"-->
<!--                              @clear-click="change($event,'clear')"/>-->
<!--                </div>-->
<!--            </div>-->
<!--        </template>-->
<!--        <template v-else-if="iconf.type=='w-date-text'">-->
<!--            <span>{{ getFormattedValue() }}</span>-->
<!--        </template>-->
<!--    </div>-->
</template>
<script>
import { useModelWrapper } from './modelWrapper'
import CrudComponent from "../CrudComponent.vue";
import wHidden from "./components/wHidden.vue"
import wInput from "./components/wInput.vue"
import wSelect from './components/wSelect.vue'
import wSelectButton from './components/wSelectButton.vue'
import wAutocomplete from './components/wAutocomplete.vue'
import wCheckbox from './components/wCheckbox.vue'
import wRadio from './components/wRadio.vue'
import wText from './components/wText.vue'
import wBelongsto from './components/wBelongsto.vue'
import wCustom from './components/wCustom.vue'
import wColorPicker from './components/wColorPicker.vue'
import wDatePicker from './components/wDatePicker.vue'
import wDateRangePicker from './components/wDateRangePicker.vue'
import wDateText from './components/wDateText.vue'
import wTextarea from './components/wTextarea.vue'
import wMultiSelect from './components/wMultiSelect.vue'
import wSwap from './components/wSwap.vue'
import wStatus from './components/wStatus.vue'
import wTexthtml from './components/wTexthtml.vue'
import wUpload from './components/wUpload.vue'

export default {
    name : "cWidget",
    extends : CrudComponent,
    components : {
        wHidden,wInput,wSelect,wSelectButton,wAutocomplete,wCheckbox,wRadio,wText,
        wBelongsto,wCustom,wColorPicker,wDatePicker,wDateRangePicker,wDateText,
        wTextarea,wMultiSelect,wSwap,wStatus,wTexthtml,wUpload
    },
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
            iconf: useModelWrapper(props, emit),
        }
    },
}
</script>



