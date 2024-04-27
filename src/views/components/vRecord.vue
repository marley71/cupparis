<template>
    <div>
        <template v-if="inlist && loaded">
        <slot name="content">
            <tr role="row" v-if="isInlist">
                <td class="" role="columnheader">
    <!--                <Button icon="fa fa-trash" class="p-button-outlined p-button-danger"-->
    <!--                    @click="inlistAction(indexInlist,'delete')">-->
    <!--                </Button>-->
                    <Button icon="fa fa-trash" class="p-button-outlined p-button-danger"
                            @click="removeFromList()">
                    </Button>
                    <template v-for="field in getHiddenFields()">
                        <template v-if="!isRemovedWidget(field)">
                            <c-widget :ref="field" :conf="iconf.widgetsConfig[field]" v-show="!isHiddenWidget(field)"></c-widget>
                        </template>

                    </template>
                </td>


                <td v-for="(field,indexV) in getVisibleFields()" :key="field" class="" role="cell">

                    <div class="">
                        <template v-if="!isRemovedWidget(field)">
                            <c-widget :ref="field" :conf="iconf.widgetsConfig[field]" v-show="!isHiddenWidget(field)"></c-widget>
                        </template>
                    </div>

                </td>
            </tr>
        </slot>
        </template>
        <template v-if="loaded && !inlist">

            <div v-if="loaded">
                <slot name="content">
                    <div v-if="hasActionsDivider()">
                        <Divider align="center" class="actionsDivider">
                                        <span class="p-tag text-white">
                                            {{ title }}
                                        </span>

                        </Divider>
                    </div>

                    <template v-if="iconf.type==='v-view'">

                        <template v-for="field in getHiddenFields()">
                            <template v-if="!isRemovedWidget(field)">
                                <c-widget :ref="field" :conf="iconf.widgetsConfig[field]" v-show="!isHiddenWidget(field)"></c-widget>
                            </template>

                        </template>
                        <div class="grid">
                            <template v-for="field in getVisibleFields()" :key="field">
                                <template v-if="!isRemovedWidget(field)" >
                                    <div class="py-3" :class="getWidgetLayout(field,'colClass')" v-show="!isHiddenWidget(field)">

                                            <template v-if="getWidgetLayout(field,'labelPosition')==='float'">

                                                <span class="p-float-label">
                                                    <c-widget :ref="field" :conf="widgetsConfig[field]"></c-widget>
                                                    <label :for="field">{{ iconf.widgetsConfig[field].label }}</label>
                                                </span>
                                            </template>
                                            <template v-else>

                                                <label class="labelTop" :for="field"
                                                    v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                                    {{ translateUc(iconf.widgetsConfig[field].label) }}
                                                </label>
                                                <div class="">
                                                    <c-widget :ref="field" :conf="iconf.widgetsConfig[field]"></c-widget>
                                                </div>
                                                <label class="labelBottom" :for="field"
                                                    v-if="getWidgetLayout(field,'labelPosition')=='bottom'">
                                                    {{ translateUc(iconf.widgetsConfig[field].label) }}
                                                </label>
                                            </template>

                                    </div>
                                </template>
                                <template v-if="getWidgetLayout(field,'hasDivider')">
                                    <Divider align="center" class="col-10 col-offset-1">
                                            <span v-if="getWidgetLayout(field,'dividerLabel')"
                                                class="p-tag text-white">{{ getWidgetLayout(field, 'dividerLabel') }}</span>
                                    </Divider>

                                </template>
                                <template v-else-if="getWidgetLayout(field,'lastInRow')">
                                    <div class="col-12 max-h-0 p-0">&nbsp;</div>
                                </template>
                            </template>
                        </div>
                        <div>
                            <c-action ref="actions" :conf="iconf.recordActionsConf" layout="buttons"></c-action>
                        </div>
                    </template>
                    <template v-else>

                    <form ref="form" enctype="multipart/form-data" @submit="handleSubmit" class="p-fluid">
                            <template v-for="field in getHiddenFields()">
                                <template v-if="isRemovedWidget(field)">
                                    <c-widget :ref="field" :conf="iconf.widgetsConfig[field]"></c-widget>
                                </template>
                            </template>
                            <div class="grid">
                                <template v-for="field in getVisibleFields()" :key="field">
                                    <template v-if="!isRemovedWidget(field)" >
                                        <div class="py-3" :class="getWidgetLayout(field,'colClass')" v-show="!isHiddenWidget(field)">
                                            <template v-if="getWidgetLayout(field,'labelPosition')==='float'">

                                                <span class="p-float-label">
                                                    <c-widget :ref="field" :conf="iconf.widgetsConfig[field]"></c-widget>
                                                    <label :for="field">{{ iconf.widgetsConfig[field].label }}{{ isRequired(field) }}</label>
                                                </span>
                                            </template>
                                            <template v-else>

                                                <label class="labelTop" :for="field"
                                                    v-if="getWidgetLayout(field,'labelPosition')=='top'">
                                                    {{ translateUc(iconf.widgetsConfig[field].label) }}{{ isRequired(field) }}
                                                </label>
                                                <div class="">
                                                    <c-widget :ref="field" :conf="iconf.widgetsConfig[field]"></c-widget>
                                                </div>
                                                <label class="labelBottom" :for="field"
                                                    v-if="getWidgetLayout(field,'labelPosition')=='bottom'">
                                                    {{ translateUc(iconf.widgetsConfig[field].label) }}{{ isRequired(field) }}
                                                </label>
                                            </template>
                                        </div>
                                    </template>
                                    <template v-if="getWidgetLayout(field,'hasDivider')">
                                        <Divider align="center" class="col-10 col-offset-1">
                                            <span v-if="getWidgetLayout(field,'dividerLabel')"
                                                class="p-tag text-white">{{ getWidgetLayout(field, 'dividerLabel') }}</span>
                                        </Divider>

                                    </template>
                                    <template v-else-if="getWidgetLayout(field,'lastInRow')">
                                        <div class="col-12 max-h-0 p-0">&nbsp;</div>
                                    </template>
                                </template>
                            </div>
                        </form>
                        <div class="w-full">
                            <c-action ref="actions" :conf="iconf.recordActionsConf" layout="buttons"></c-action>
                        </div>
                    </template>
                </slot>
            </div>
        </template>
    </div>
</template>

<script>
import cWidget from "../../widgets/cWidget.vue";
import vBase from './vBase.vue';
import cAction from "../../actions/cAction.vue";
import actionConfs from "../../confs/actions";
import Server from "../../core/Server";
import viewConfs from "../../confs/views";
import { defineRule,validate } from 'vee-validate';

import AllRules  from "../../core/AllRules";
import CrudCore from "../../core/CrudCore";
import ViewsWrapperConf from "../../confs/ViewsWrapperConf";
import {useModelWrapper} from "../../core/modelWrapper";

export default {
    name: "vRecord",
    extends: vBase,
    props: ['inlist', 'indexInlist'],
    emits: ['deleteInlist'],
    components: {cWidget, cAction},
    mounted() {
        if (this.iconf.autoload)
            this.load();
    },
    data() {
        //console.log('vRecord', this.conf);
        let ly = this.conf.layout || {};
        if (ly instanceof String) {
            ly = viewConfs.recordLayouts[ly] || viewConfs.recordLayouts.default;
        } else {
            let tmp = Object.assign({}, viewConfs.recordLayouts.default);
            ly = Object.assign(tmp, ly);
        }
        ly.colClass = this.getColClass(ly.cols);
        //console.log('layout',ly);
        // const { handleSubmit, resetForm } = useForm();
        // const { value, errorMessage } = useField('value', this.validateField);
        return {
            layout: ly,
            isInlist: true,
            blocked : false,
            removedWidgets : [], // rimuove il widget usando v-if
            hiddenWidgets : [],   // nasconde il widget usando v-show
            myShow : false,
        }
    },
    setup(props, { emit }) {
        ViewsWrapperConf.setConf(props.conf);
        console.debug('vRecord ICONF',props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    methods: {
        draw() {
            //console.debug('record widgetsConfig',this.iconf.widgetsConfig);
            for (let k in this.iconf.widgetsConfig) {
                if (this.iconf.widgetsConfig[k].removeWidget) {
                    this.removedWidgets.push(k);
                }
                if (this.iconf.widgetsConfig[k].hiddenWidget) {
                    this.hiddenWidgets.push(k);
                }
            }
            this.setActions();
            this.loaded = true;
        },
        removeFromList() {
          this.isInlist = false;
        },
        inlistAction(index, action) {
            console.log('EMIT---ACTIONINLIST::: ',index,action);
            this.$emit('actionInlist',index,action);
        },
        hasActionsDivider() {
            return this.iconf.actionDivider;
        },
        getColClass(col) {
            switch (col) {
                case 1:
                    return 'col-12'
                case 2:
                    return 'col-12 md:col-6'
                case 3:
                    return 'col-12 md:col-4'
                case 4:
                    return 'col-3 md:col-3'
                case 6:
                    return 'col-2'
                case 12:
                    return 'col-1'
                default:
                    return 'col-12'
            }
        },
        setActions() {
            let that = this;
            that.iconf.recordActionsConf = {
                actions: {}
            };
            let rActions = that.iconf.actions;
            //console.log('actionsConfig', that.iconf.actionsConfig)
            for (let k in rActions) {
                let aName = rActions[k];
                let currenConfig = Object.assign({},(that.iconf.actionsConfig[aName] || {}));
                currenConfig.modelData = that.iconf.value;
                currenConfig.view = that;
                let aConf = CrudCore.getActionConf(aName,currenConfig);
                that.iconf.recordActionsConf.actions[aName] = aConf;
            }
            //console.log('recordActionsConf', that.iconf.recordActionsConf)
        },
        getWidgegConf(index, field, data) {
            let that = this;
            that.iconf.widgetsConfig[index][field].value = data;
            return Object.assign({}, that.iconf.widgetsConfig[index][field]);
        },
        setWidgetsConfig() {
            let that = this;
            // configurazioni widgets
            if (!that.iconf.fields && that.iconf.value) {
                that.iconf.fields = Object.keys(that.iconf.value);
            }

            let fConf = {};
            let fieldsConfig = that.iconf.fieldsConfig || {};
            for (let f in that.iconf.fields) {
                let key = that.iconf.fields[f];
                fConf[key] = {
                    type: that.iconf.defaultWidgetType,
                };

                if (fieldsConfig[key]) {
                    fConf[key] = Object.assign(fConf[key], CrudCore.normalizeConf(fieldsConfig[key]) );
                }
                that.setFieldLabel(key, fConf[key]);
            }
            let widgetsConfig = {};
            for (let f in that.iconf.fields) {
                let key = that.iconf.fields[f];
                let val = that.iconf.value[key];
                let md = that.iconf.metadata[key] || {};
                widgetsConfig[key] = Object.assign(md, fConf[key]);
                widgetsConfig[key].value = val;
                widgetsConfig[key].name = that.getFieldName(key);
                widgetsConfig[key].modelData = that.value;
                widgetsConfig[key].view = that;
                widgetsConfig[key].rules = fConf[key].rules || '';
            }
            console.log('vRecord setWidgetsConfig', widgetsConfig)
            that.iconf.widgetsConfig = widgetsConfig;

        },
        save(callback) {
            var that = this;
            let route = null;
            that.resetWidgetsErrors();
            that.validate().then((res) => {
                if (!res) {
                    return ;
                }
                if (that.type == 'v-edit') {
                    route = that.createRoute('update');
                    var pk = that.cPk || that.pk || 0;
                    route.setValues({
                        modelName: that.modelName,
                        pk: pk
                    });
                } else {
                    route = that.createRoute('create');
                    route.setValues({
                        modelName: that.modelName,
                    });
                }
                route.setParams(that.getViewData());
                that.block();

                Server.route(route, function (json) {
                    that.unblock();
                    callback(json);
                })
            })


        },
        getViewData(ref) {
            let that = this;
            let form = ref || 'form';
            const formData = new FormData(that.$refs[form]);
            console.log('formData', formData);
            return formData;
        },
        getWidget(field) {
            return Array.isArray(this.$refs[field])?this.$refs[field][0]:this.$refs[field];
        },
        getAction(name) {
            //console.log('getAction',name,this.recordActionsConf);
            return this.$refs.actions.instance(name);
        },
        getValue() {
            var that = this;
            var values = {};
            for (var k in that.fields) {
                let field = that.fields[k];
                let w = that.getWidget(field);
                if (!w) {
                    console.warn('vRecord.getValue widget not found',field);
                } else {
                    values[field] = w.getValue();
                }
            }
            console.log('rowData ',that.value);
            return values;
        },
        setValue(values) {
            let that = this;
            for (let key in values) {
                if (that.fields.indexOf(key) >= 0) {
                    let w = that.getWidget(key);
                    console.log('set Value w',w,key);
                    if (w ) {
                        w.setValue(values[key]);
                    }
                }
            }
        },
        /**
         * esegue la validazione della form prima di inviarla al server in base
         * alle rules definite in configurazione su ogni campo.
         */
        async validate() {
            //console.log(AllRules)
            let that = this;
            //console.log('widgetsConfig',that.iconf.widgetsConfig);

            that.defineRules();
            let isValid = true;
            for (let i in that.fields) {
                let name = that.fields[i];
                let widget = this.getWidget(name);

                if (widget && widget.rules) {
                    //console.log('name',name,widget.getValue());
                    let res = await validate(widget.getValue(),
                                        widget.rules,
                                        {
                                            name : name,
                                            label : widget.label,
                                            bails : false,
                                        });
                    //console.log(name,'res',res);
                    isValid = isValid && res.valid;
                    //console.log('ISVALID',isValid);
                    that.getWidget(name).setErrors(res.errors);
                }
            }
            //console.log('isValid',isValid)
            return isValid;
        },
        /**
         * definisce tutte le rules definite nel campo rules per poterle richiamare in fase di validate form
         */
        defineRules() {
            let that = this;
            let rulesArray = [];
            for (let i in that.fields) {
                let name = that.fields[i];
                let widget = this.getWidget(name);
                if (widget) {
                    rulesArray = rulesArray.concat(widget.rules.split('|'));
                }
            }
            for (let i in rulesArray) {
                let ruleName = rulesArray[i].split(':')[0];
                if (ruleName) {
                    defineRule(ruleName,AllRules[ruleName]);
                }
            }
        },
        /**
         * se esiste un regola required aggiunge l'asterisco alla label del campo
         * @param {} field
         */
        isRequired(field) {
            if (this.iconf.widgetsConfig[field].rules.indexOf('required') >= 0) {
                return ' *';
            }
            return ''
        },
        /**
         * resetta gli errori segnalati in un eventuale validate
         */
        resetWidgetsErrors() {
            let that = this;
            for (let i in that.fields) {
                let name = that.fields[i];
                if (this.getWidget(name)) {
                    this.getWidget(name).setErrors([]);
                }
            }
        },
        isRemovedWidget(field) {
            //console.debug('isRemovedWidget',field,(this.removedWidgets.indexOf(field) >= 0))
            return (this.removedWidgets.indexOf(field) >= 0);
        },
        removeWidget(field) {
            if (this.removedWidgets.indexOf(field) < 0) {
                this.removedWidgets.push(field);
            }
        },
        putInWidget(field) {
            let idx = this.removedWidgets.indexOf(field)
            if ( idx >= 0) {
                this.removedWidgets.splice(idx,1);
            } else {
                console.warn('widget',field,'is not removed');
            }
        },
        isHiddenWidget(field) {
            //console.debug('isHiddenWidget',field,(this.hiddenWidgets.indexOf(field) >= 0))
            return (this.hiddenWidgets.indexOf(field) >= 0);
        },
        hideWidget(field) {
            if (this.hiddenWidgets.indexOf(field) < 0) {
                this.hiddenWidgets.push(field);
            }
            //console.debug('hideWidget',field,this.hiddenWidgets)
        },
        showWidget(field) {
            let idx = this.hiddenWidgets.indexOf(field);
            if ( idx >= 0) {
                this.hiddenWidgets.splice(idx,1);
            } else {
                console.warn('widget',field,'is not hidden');
            }
        },
    }
}
</script>

<style lang="scss" scoped>

label.labelTop {
    font-size: 12px;
    color: var(--surface-text);
    position: relative;
    top: -0.25rem;
    left: 0.25rem;
}

</style>
