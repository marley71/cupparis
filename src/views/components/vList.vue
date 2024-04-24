<template>
    <div>
        <div v-if="loaded">
            <template v-if="iconf.layout=='default'">
                <template v-for="(v,row) in iconf.value">
                    <template v-for="(col) in getHiddenFields()" :key="col">
                        <c-widget :ref="'w'+row+'_'+col" :conf="getWidgetConf(row,col,v[col])"></c-widget>
                    </template>
                </template>
                <slot name="header" :collectionActions="iconf.collectionActions">
                    <div class="v-list-header">
                        <div class="surface-section px-4 py-5 md:px-6 lg:px-8">
                            <div class="flex align-items-start flex-column lg:justify-content-start lg:align-items-center lg:flex-row">
                                <div class="mr-5 pr-3 border-right-none lg:border-right-1">
                                    <div class="font-medium text-3xl text-900">{{ translateUc(iconf.modelName + '.label', null,1) }}</div>
                                    <div class="flex align-items-center text-700 flex-wrap">
                                        <div class="mr-5 flex align-items-center mt-3">
                                            <!--                                    <i class="pi pi-users mr-2"></i>-->
                                            <span>{{
                                                    translate('app.numero-records-lista', null, 0, [(iconf.value ? iconf.value.length : 0), getFirst() + 1, getFirst() + (iconf.value ? iconf.value.length : 0), getTotal()])
                                                }}</span>
                                        </div>
                                    </div>
                                </div>
                                <template v-if="Object.keys(iconf.collectionActions).length > 0">
                                    <div class="mt-5 lg:mt-0">
                                        <c-action :layout="iconf.actionsLayout" :conf="iconf.collectionActions"></c-action>
                                    </div>

                                </template>
                            </div>
                        </div>
                    </div>



                </slot>
                <slot name="content" :value="iconf.value" :metadata="iconf.metadata" :widgetsConfig="iconf.widgetsConfig">
                    <DataTable :value="iconf.value" responsiveLayout="scroll" v-model:selection="iconf.selected"
                               :rows="getPerPage()"
                               :paginator="iconf.paginator" :paginatorPosition="iconf.paginatorPosition"
                               :lazy="iconf.routeName==null?false:true"
                               @page="onPage($event)" @sort="onSort($event)"
                               :total-records="getTotal()"
                               :first="getFirst()"
                               :sortField="getSortField()"
                               :sortOrder="getSortOrder()"
                               :loading="!loaded"


                    >
                        <Column v-if="iconf.selectionMode" :selection-mode="iconf.selectionMode"></Column>
                        <Column v-if="getRecordActionsPosition() == 'start' && hasRecordActions()" :exportable="false" :header="translate('app.actions')">
                            <template #body="slotProps">
                                <c-action :ref="'r'+slotProps.index" :conf="iconf.recordActionsConf[slotProps.index % getPerPage()]"
                                          :layout="iconf.actionsLayout" :menubar-title="iconf.actionsLayoutTitle"></c-action>
                            </template>
                        </Column>
                        <Column v-for="(col) in getVisibleFields()" :field="col" :header="columnLabel(col)" :key="col"
                                :sortable="isSortable(col)" :dir="sortDirection(col)">
                            <template #body="slotProps">
                                <!--                    {{slotProps.data[col]}} {{ slotProps.index}}-->
                                <c-widget :ref="'w'+slotProps.index+'_'+col"
                                          :conf="getWidgetConf(slotProps.index,col,slotProps.data[col])"></c-widget>
                                <!--                    {{getW(slotProps.index,col,slotProps.data[col])}}-->
                                <!--                    <c-widget :conf="widgetsConfig[parseInt(slotProps.index)][col]"></c-widget>-->
                            </template>
                        </Column>
                        <Column v-if="getRecordActionsPosition() == 'end' && hasRecordActions()" :exportable="false" :header="translate('app.actions')">
                            <template #body="slotProps">
                                <c-action :ref="'r'+slotProps.index" :conf="iconf.recordActionsConf[slotProps.index % getPerPage()]"
                                          :layout="iconf.actionsLayout" :menubar-title="iconf.actionsLayoutTitle"></c-action>
                            </template>
                        </Column>

                        <template #empty>
                            {{ translate('app.no_records_found') }}
                        </template>
                    </DataTable>

                </slot>
                <slot name="footer">

                </slot>
            </template>
            <template v-if="iconf.layout=='simple'">
                <template v-for="(v,row) in iconf.value">
                    <template v-for="(col) in getHiddenFields()" :key="col">
                        <c-widget :ref="'w'+row+'_'+col" :conf="getWidgetConf(row,col,v[col])"></c-widget>
                    </template>
                </template>
                <slot name="header" :collectionActions="iconf.collectionActions">
<!--                    <div class="v-list-header">-->
<!--                        <div class="surface-section px-4 py-0 md:px-6 lg:px-8">-->
<!--                            <div class="flex align-items-start flex-column lg:justify-content-start lg:align-items-center lg:flex-row">-->
<!--                                <div class="mr-5 pr-3 border-right-none lg:border-right-1">-->
<!--                                    <div class="font-medium text-3xl text-900">{{ translateUc(modelName + '.label', null,1) }}</div>-->
<!--                                    <div class="flex align-items-center text-700 flex-wrap">-->
<!--                                        <div class="mr-5 flex align-items-center mt-3">-->
<!--                                            &lt;!&ndash;                                    <i class="pi pi-users mr-2"></i>&ndash;&gt;-->
<!--                                            <span>{{-->
<!--                                                    translate('app.numero-records-lista', null, 0, [(iconf.value ? iconf.value.length : 0), getFirst() + 1, getFirst() + (iconf.value ? iconf.value.length : 0), getTotal()])-->
<!--                                                }}</span>-->
<!--                                        </div>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                                <template v-if="Object.keys(collectionActions).length > 0">-->
<!--                                    <div class="mt-5 lg:mt-0">-->
<!--                                        <c-action :layout="iconf.actionsLayout" :conf="collectionActions"></c-action>-->
<!--                                    </div>-->

<!--                                </template>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->

                    <div>records : {{getTotal()}}</div>

                </slot>
                <slot name="content" :value="iconf.value" :metadata="iconf.metadata" :widgetsConfig="iconf.widgetsConfig">
                    <DataTable :value="value" responsiveLayout="scroll" v-model:selection="iconf.selected"
                               :rows="getPerPage()"
                               :paginator="iconf.paginator" :paginatorPosition="iconf.paginatorPosition"
                               :lazy="iconf.routeName==null?false:true"
                               @page="onPage($event)" @sort="onSort($event)"
                               :total-records="getTotal()"
                               :first="getFirst()"
                               :sortField="getSortField()"
                               :sortOrder="getSortOrder()"
                               :loading="!loaded"


                    >
                        <Column v-if="iconf.selectionMode" :selection-mode="iconf.selectionMode"></Column>
                        <Column v-if="getRecordActionsPosition() == 'start' && hasRecordActions()" :exportable="false" :header="translate('app.actions')">
                            <template #body="slotProps">
                                <c-action :ref="'r'+slotProps.index" :conf="iconf.recordActionsConf[slotProps.index % getPerPage()]"
                                          :layout="iconf.actionsLayout" :menubar-title="iconf.actionsLayoutTitle"></c-action>
                            </template>
                        </Column>
                        <Column v-for="(col) in getVisibleFields()" :field="col" :header="columnLabel(col)" :key="col"
                                :sortable="isSortable(col)" :dir="sortDirection(col)">
                            <template #body="slotProps">
                                <!--                    {{slotProps.data[col]}} {{ slotProps.index}}-->
                                <c-widget :ref="'w'+slotProps.index+'_'+col"
                                          :conf="getWidgetConf(slotProps.index,col,slotProps.data[col])"></c-widget>
                                <!--                    {{getW(slotProps.index,col,slotProps.data[col])}}-->
                                <!--                    <c-widget :conf="widgetsConfig[parseInt(slotProps.index)][col]"></c-widget>-->
                            </template>
                        </Column>
                        <Column v-if="getRecordActionsPosition() == 'end' && hasRecordActions()" :exportable="false" :header="translate('app.actions')">
                            <template #body="slotProps">
                                <c-action :ref="'r'+slotProps.index" :conf="iconf.recordActionsConf[slotProps.index % getPerPage()]"
                                          :layout="iconf.actionsLayout" :menubar-title="iconf.actionsLayoutTitle"></c-action>
                            </template>
                        </Column>

                        <template #empty>
                            {{ translate('app.no_records_found') }}
                        </template>
                    </DataTable>

                </slot>
                <slot name="footer">

                </slot>
            </template>
        </div>
        <OverlayPanel ref="panel" :showCloseIcon="true" :dismissable="true" @hide="panelConf.hide()" :class="panelConf.panelClass">
            <div class="w-full">
                <component v-if="panelConf.componentName" :is="panelConf.componentName"
                        :conf="panelConf.componentConf" ></component>
            </div>
        </OverlayPanel>
    </div>
</template>

<script>
import cWidget from "../../widgets/cWidget.vue"
import cAction from "../../actions/cAction.vue";
import actionConfs from "../../confs/actions";
import vBase from './vBase.vue';
import CrudCore from "../../core/CrudCore";
import ViewsWrapperConf from "../../confs/ViewsWrapperConf";
import {useModelWrapper} from "../modelWrapper";
const defaultPanelConf = () => {
    return {
        componentName: null,
        componentConf: {},
        panelClass: 'w-8',
        hide() {
            Function.prototype();
        }
    }
}

export default {
    name: "v-list",
    extends: vBase,
    //props: ['conf'],
    components: {cAction,cWidget},
    mounted() {
        console.debug('v-list mounted',this.iconf);
        if (this.iconf.autoload)
            this.load();
    },
    data() {
        return {
            // rows: 5,
            menuCollection: [],
            panelConf: defaultPanelConf(),
            labelCols : {},
            // layout : this.conf.layout?this.conf.layout:'default',
        }
    },
    setup(props, { emit }) {
        ViewsWrapperConf.setConf(props.conf);
        console.debug('VILST ICONF',props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    methods: {
        draw() {
            this.setActions();
            if (this.getPerPage() >= this.getTotal()) {
                this.paginator = false;
            }
            this.loaded = true;
        },

        onRowContextMenu(event) {
            this.$refs.cm.show(event.originalEvent);
        },
        onPage(event) {
            console.log('page event', event)
            if (this.iconf.routeName) {
                //let page = Math.floor(event.first / event.rows) +1;
                let page = event.page + 1;
                this.iconf.route.setParam('page', page);
                this.reload();
            }

        },
        onSort(event) {
            let that = this;
            console.log('sort event', event)
            if (that.iconf.routeName) {
                that.iconf.route.setParam('order_field', event.sortField);
                that.iconf.route.setParam('order_direction', event.sortOrder > 0 ? 'ASC' : 'DESC');
                that.reload();
            }

        },
        viewRow() {
            console.log('viewRow', this.iconf.selectedRow)
        },
        deleteRow() {
            console.log('deleteRow', this.iconf.selectedRow)
        },

        setActions() {
            let that = this;
            this.menuModel = [
                {label: 'View', icon: 'pi pi-fw pi-search', command: () => this.viewRow()},
                {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => this.deleteRow()}
            ]

            let rActions = {};
            let gActions = {};
            for (let i in that.iconf.actions) {
                let aName = that.iconf.actions[i];
                let aConf = CrudCore.getActionConf(aName,that.iconf.actionsConfig[aName]);
                console.debug(aName,'caso parent --view',aConf)
                // --vecchio modo
                // let aConf = Object.assign({}, actionConfs['default']);
                // aConf = Object.assign(aConf, actionConfs[aName]);
                // aConf = Object.assign(aConf, (that.actionsConfig[aName] || {}));
                if (aConf.type == 'record') {
                    rActions[aName] = aConf;
                } else {
                    gActions[aName] = aConf;
                }
            }
            that.iconf.recordActionsConf = [];
            that.iconf.collectionActions = {};


            //let rActions = ['action-delete','action-edit','action-view'];
            for (let i in that.iconf.value) {
                let rowActions = {};
                for (let aName in rActions) {
                    let aConf = Object.assign({}, rActions[aName]);
                    aConf.modelData = that.iconf.value[i];
                    aConf.view = that;
                    aConf.index = i;
                    rowActions[aName] = aConf;
                }
                that.iconf.recordActionsConf.push({actions: rowActions});
            }
            that.iconf.collectionActions.actions = {};
            let needSelection = false;
            for (let aName in gActions) {
                let aConf = Object.assign({}, gActions[aName]);
                aConf.modelData = that.iconf.value;
                aConf.view = that;
                needSelection |= aConf.needSelection;
                that.iconf.collectionActions.actions[aName] = aConf;
            }
            this.selectionMode = needSelection?'multiple':null;
            console.debug('RECORDACTIONS', that.iconf.recordActionsConf)
            console.debug('GLOBAL ACTIONS', that.iconf.collectionActions);
            this._setMenuCollection();
        },

        getWidgetConf(index, field, data) {
            let that = this;
            index = index % that.getPerPage();
            //console.log('GETWIDGETCONF',index,field,data);
            if (!that.iconf.widgetsConfig || !that.iconf.widgetsConfig[index] || !that.iconf.widgetsConfig[index][field]) {
                console.log('conf non trovata',field,index);
                return {};
            }

            if (that.iconf.widgetsConfig[index][field] instanceof String) {
                that.iconf.widgetsConfig[index][field] = {
                    type : that.iconf.widgetsConfig[index][field]
                }
            }
            that.iconf.widgetsConfig[index][field].value = data;
            return that.iconf.widgetsConfig[index][field];
        },
        setWidgetsConfig() {
            this._setWidgetsConfig();
        },
        _setWidgetsConfig() {
            let that = this;
            // configurazioni widgets
            if (!that.iconf.fields && that.iconf.value.length) {
                that.iconf.fields = Object.keys(that.iconf.value[0]);
            }
            let fConf = {};
            let fieldsConfig = that.iconf.fieldsConfig || {};
            //console.log('FIEDLS CONFIG',fieldsConfig,that.defaultWidgetType);
            // configurazione base mergiata con la configurazione passata
            for (let f in that.iconf.fields) {
                let key = that.iconf.fields[f];
                fConf[key] = {
                    type: that.iconf.defaultWidgetType,
                }
                if (fieldsConfig[key]) {
                    fConf[key] = Object.assign(fConf[key], CrudCore.normalizeConf(fieldsConfig[key]) );
                }
                that.setFieldLabel(key,fConf[key]);
                that.labelCols[key] = fConf[key].label;
            }
            // configurazione finale dei widgets
            let widgetsConfig = [];
            for (let i in that.iconf.value) {
                widgetsConfig.push({});
                for (let f in that.iconf.fields) {
                    let key = that.iconf.fields[f];
                    let val = that.iconf.value[i][key];
                    let md = Object.assign({}, (that.iconf.metadata[key] || {}));
                    //console.log('field',key,'value',val);
                    widgetsConfig[i][key] = Object.assign(md, fConf[key]);
                    widgetsConfig[i][key].value = val;
                    widgetsConfig[i][key].name = that.getFieldName(key);
                    widgetsConfig[i][key].modelData = that.iconf.value[i];
                    widgetsConfig[i][key].view = that;
                    //widgetsConfig[i][key].label = that.getFieldLabel(key);
                }
            }
            //that.fields = Object.assign([],that.fields);
            //console.log('vList value',that.iconf.value)
            console.log('vList _setWidgetsConfig',widgetsConfig,fieldsConfig)
            that.iconf.widgetsConfig = widgetsConfig;
        },
        columnLabel(col) {
            //console.debug('labelCols',this.labelCols)
          return this.labelCols[col];
        },
        isSortable(field) {
            var that = this;
            if (that.iconf.orderFields[field])
                return true;
            return false;

            //return (Object.key(this.iconf.orderFields).indexOf(field) >= 0);
        },
        sortDirection(field) {
            let that = this;
            var order = that.iconf.metadata.order || {};
            if (order.field == field) {
                if (order.direction.toLowerCase() == 'asc')
                    return 1;
                return -1
            }
            return null;
        },
        getFirst() {
            let first = 0;
            if (this.iconf.routeName) {
                if (this.iconf.pagination && this.iconf.pagination.current_page) {
                    first = (this.iconf.pagination.current_page - 1) * this.iconf.pagination.per_page;
                }
            }
            //console.log('first', first, this.pagination);
            return first;
        },
        getTotal() {
            if (this.iconf.routeName)
                return this.iconf.pagination.total;
            return this.iconf.value ? this.iconf.value.length : 0;
        },
        getSortField() {
            return (this.iconf.metadata.order && this.iconf.metadata.order.field) || null;
        },
        getSortOrder() {
            return (this.iconf.metadata.order && this.iconf.metadata.order.direction) ? (this.iconf.metadata.order.direction.toLowerCase() == 'asc' ? 1 : -1) : null;
        },
        getPerPage() {
            if (this.iconf.routeName)
                return this.iconf.pagination.per_page;
            let pagination = this.iconf.pagination || {};
            return (pagination.per_page ? pagination.per_page : this.getTotal());
            //return this.getTotal();
        },
        getPage() {
            console.log('pagination',this.iconf.pagination);
            if (this.iconf.routeName)
                return this.iconf.pagination.current_page;
            return parseInt(Math.floor(this.getTotal()/this.getPerPage()));
        },
        getRecordAction(index, name) {
            let key = 'r' + index
            console.log('getRecordAction', index, name,key,this.$refs);
            if (this.$refs[key]) {
                return this.$refs[key].instance(name);
            }
            return null;
        },
        selectedRows() {
            let that = this;
            let ids = [];
            for (let i in that.iconf.selected) {
                console.log('selected', that.iconf.selected[i], that.iconf.selected[i][that.iconf.primaryKey])
                ids.push(that.iconf.selected[i][that.iconf.primaryKey])
            }
            return ids;
        },
        hasCollectionActions() {
            let that = this;
            //console.log('hasRecordActions',that.iconf.recordActionsConf);
            if (that.iconf.collectionActions && that.iconf.collectionActions.length && (Object.keys(that.iconf.collectionActions[0].actions).length > 0))
                return true;
            return false;
        },
        hasRecordActions() {
            let that = this;
            //console.log('hasRecordActions',that.recordActionsConf);
            if (that.iconf.recordActionsConf && that.iconf.recordActionsConf.length && (Object.keys(that.iconf.recordActionsConf[0].actions).length > 0))
                return true;
            return false;
        },
        getRecordActionsPosition() {
            let that = this;
            //console.log('getRecordActionsPosition, hasRecordActions',that.iconf.recordActionsConf,that.recordActionsPosition);
            switch (that.iconf.recordActionsPosition) {
                case 'end':
                    return 'end';
                default:
                    return 'start';
            }
        },
        _setMenuCollection() {
            let that = this;
            let items = [];
            for (let name in that.iconf.collectionActions.actions) {
                items.push({
                    label: CrudCore.translate(that.iconf.collectionActions.actions[name].text),
                    icon: that.iconf.collectionActions.actions[name].icon,
                    command: () => that.iconf.collectionActions.actions[name].execute(),
                    disabled: that.iconf.collectionActions.actions[name].disabled,
                    action: name,
                })
            }
            that.menuCollection = items;
            console.log('menuCollection',that.menuCollection,that.collectionActions)
        },
        showPanel(event, conf) {
            if (conf) {
                this.panelConf = Object.assign(defaultPanelConf(),conf);
            } else {
                //this.panelConf.componentName = null;
                this.panelConf = defaultPanelConf();
            }
            this.$refs.panel.show(event);
        },
        hidePanel() {
            this.$refs.panel.hide();
        },

        getValue() {
            let that = this;
            let vs = [];
            for (let i in that.iconf.value) {
                let r = that.getRowData(i);
                vs.push(r);
            }
            return vs;
        },

        getRowData (index) {
            var that = this;
            var values = {};
            for (var k in that.iconf.fields) {
                let field = that.iconf.fields[k];
                //console.log('w ref','w'+index+'_'+field)
                let w = that.$refs['w'+index+'_'+field];
                if (w) {
                    //WW = w;
                    //console.log('w',w);
                    values[field] = w[0].instance().getValue()
                }
            }
            //console.log('rowData values',values);
            return values;
        },
        getVisibleFields() {
            var that = this;
            var visible = [];
            for (let i in that.iconf.fields) {
                let keyField = that.iconf.fields[i];
                if ( (that.iconf.hiddenColumns.indexOf(keyField) < 0) &&
                    (!that.isHiddenField(keyField)) ){
                    visible.push(keyField)
                }
            }
            //console.log('VISIBLE FIELDS',visible);
            return visible;
        },
        hideColumn(field) {
            if (this.iconf.hiddenColumns.indexOf(field) < 0) {
                this.iconf.hiddenColumns.push(field)
            }
        },
        showColumn(field) {
            let idx = this.iconf.hiddenColumns.indexOf(field);
            if ( idx >= 0) {
                this.iconf.hiddenColumns.splice(idx,1);
            } else {
                console.warn('widget',field,'is not hidden column');
            }
        }
    }
}
</script>

<style lang="scss" scoped>

.v-list-header {
    border-bottom: 2px solid var(--primary-color);
}

.p-datatable {
    :deep(.p-datatable-header) {
        background-color: transparent;
        padding: 1.25rem 0;
        margin-top: 0;
        margin-bottom: 1rem;
        border-top: 2px solid var(--primary-color);
    }

    :deep(.p-datatable-header .surface-section) {
        padding-left: 0.75rem !important;
        padding-right: 0.75rem !important;
    }

    :deep(.p-datatable-wrapper) {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

}


</style>
