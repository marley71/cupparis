<template>
    <div v-if="loaded">
        <template v-for="(v,row) in iconf.value">
            <template v-for="(col) in getHiddenFields()" :key="col">
                <c-widget :ref="'w'+row+'_'+col" :conf="getWidgetConf(row,col,v[col])"></c-widget>
            </template>
        </template>
        <slot name="header" :collectionActions="iconf.collectionActions">
            <div class="v-list-edit-header">
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
                                <c-action :layout="iconf.actionsLayout"  :conf="iconf.collectionActions"></c-action>
                            </div>

                        </template>
                    </div>
                </div>
            </div>



        </slot>
        <slot name="content" :value="iconf.value" :metadata="iconf.metadata" :widgetsConfig="iconf.widgetsConfig">
            <DataTable :value="iconf.value" responsiveLayout="scroll" v-model:selection="iconf.selected"
                :rows="getPerPage()"
                :paginator="iconf.paginator"
                :lazy="iconf.routeName==null?false:true"
                @page="onPage($event)" @sort="onSort($event)"
                :total-records="getTotal()"
                :first="getFirst()"
                :sortField="getSortField()"
                :sortOrder="getSortOrder()"

            >
                <Column :selection-mode="iconf.selectionMode"></Column>
                <!-- <Column v-if="getRecordActionsPosition() == 'start' && hasRecordActions()" :exportable="false" :header="translate('app.actions')">
                    <template #body="slotProps">
                        <c-action :ref="'r'+slotProps.index" :conf="iconf.recordActionsConf[slotProps.index % getPerPage()]"
                                    :layout="actionsLayout" :menubar-title="actionsLayoutTitle"></c-action>
                    </template>
                </Column> -->
                <Column :exportable="false" header="Actions">
                    <template #body="slotProps">
                        <c-action :ref="'r'+slotProps.index % getPerPage()" :conf="iconf.recordActionsConf[slotProps.index % getPerPage()]" :layout="iconf.actionRecordLayout"></c-action>
                    </template>
                </Column>
                <Column v-for="(col) in iconf.fields" :field="col" :header="col" :key="col" :sortable="isSortable(col)" :dir="sortDirection(col)">
                    <template #body="slotProps">
    <!--                    {{getWidgetConf(slotProps.index,col,slotProps.data[col])}}-->
                        <c-widget v-if="!editMode[slotProps.index % getPerPage()]" :ref="'w'+slotProps.index % getPerPage()+'_'+col"
                                :conf="getWidgetConf(slotProps.index % getPerPage(),col,slotProps.data[col])"></c-widget>
                        <c-widget v-if="editMode[slotProps.index % getPerPage()]" :ref="'we'+slotProps.index % getPerPage() +'_'+col"
                                :conf="getWidgetEditConf(slotProps.index % getPerPage(),col,slotProps.data[col])"></c-widget>
                    </template>
                </Column>
            </DataTable>
        </slot>
        <slot name="footer">

        </slot>
    </div>
</template>

<script>
import cWidget from "../../widgets/cWidget.vue";
import cAction from "../../actions/cAction.vue";
import Server from "../../core/Server";
import CrudCore from "../../core/CrudCore";
import vList from './vList.vue';
import ViewsWrapperConf from "../../confs/ViewsWrapperConf";
import {useModelWrapper} from "../modelWrapper";

export default {
    name: "vListEdit",
    extends: vList,
    components: {cAction,cWidget},
    mounted() {
        this.load();
    },
    data() {
      return {
          rows:5,
          menuCollection : [],
          editMode : {},
      }
    },
    setup(props, { emit }) {
        ViewsWrapperConf.setConf(props.conf);
        console.debug('VILSTEdit ICONF',props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    methods: {
        setWidgetsConfig() {
            this._setWidgetsConfig();
            this._setWidgetsEditConfig();
        },
        _setWidgetsEditConfig: function () {
            let that = this;
            let fConf = {};
            let fieldsEditConfig = that.iconf.fieldsEditConfig || {};
            for (let f in that.iconf.fields) {
                let key = that.iconf.fields[f];
                fConf[ key ] = {
                    type : 'w-input',
                }
                if (fieldsEditConfig[key]) {
                    fConf[key] = Object.assign(fConf[key],CrudCore.normalizeConf(fieldsEditConfig[key]));
                }
                that.setFieldLabel(key,fConf[key]);
                that.labelCols[key] = fConf[key].label;
            }

            // configurazione finale dei widgets
            let widgetsEditConfig = [];
            for (let i in that.iconf.value) {
                widgetsEditConfig.push({});
                for (let f in that.iconf.fields) {
                    let key = that.iconf.fields[f];
                    let val = that.iconf.value[i][key];
                    let md = Object.assign({},(that.iconf.metadata[key] || {}));
                    //console.log('field',key,'value',val);
                    widgetsEditConfig[i][key] = Object.assign(md,fConf[key]);
                    widgetsEditConfig[i][key].value = val;
                    widgetsEditConfig[i][key].name = that.getFieldName(key);
                    widgetsEditConfig[i][key].modelData = that.iconf.value[i];
                    //widgetsConfig[i][key].label = that.getFieldLabel(key);
                }
            }
            that.iconf.widgetsEditConfig = widgetsEditConfig;
        },
        getWidgetEditConf(index,field,data) {
            let that = this;
            if (!that.iconf.widgetsEditConfig || !that.iconf.widgetsEditConfig[index] || !that.iconf.widgetsEditConfig[index][field]) {
                return {};
            }
            that.iconf.widgetsEditConfig[index][field].value = data;
            return that.iconf.widgetsEditConfig[index][field];
        },
        setEditMode: function (index) {
            var that = this;
            //console.log('edit mode',index);
            if (that.iconf.actions.indexOf('action-delete') >= 0)
                that.hideRA(index, 'action-delete');
            if (that.iconf.actions.indexOf('action-edit-mode') >= 0)
                that.hideRA(index, 'action-edit-mode');
            if (that.iconf.actions.indexOf('action-view') >= 0)
                that.hideRA(index, 'action-view');

            if (that.iconf.actions.indexOf('action-view-mode') >= 0)
                that.showRA(index, 'action-view-mode');
            if (that.iconf.actions.indexOf('action-save-row') >= 0)
                that.showRA(index, 'action-save-row');
            //that.recordActions[index]['action-delete'].setVisible(false);
            that.editMode[index] = true;
        },
        setViewMode: function (index) {
            var that = this;
            that.editMode[index] = false;
            if (that.iconf.actions.indexOf('action-delete') >= 0)
                that.showRA(index, 'action-delete');
            if (that.iconf.actions.indexOf('action-edit-mode') >= 0)
                that.showRA(index, 'action-edit-mode');
            if (that.iconf.actions.indexOf('action-view') >= 0)
                that.showRA(index, 'action-view');

            if (that.iconf.actions.indexOf('action-view-mode') >= 0)
                that.hideRA(index, 'action-view-mode');
            if (that.iconf.actions.indexOf('action-save-row') >= 0)
                that.hideRA(index, 'action-save-row');
        },
        hideRA: function (index, name) {
            var that = this;
            var a = that.getRecordAction(index, name);
            if (a) {
                a.setVisible(false);
            }

        },
        showRA (index, name) {
            var that = this;
            var a = that.getRecordAction(index, name);
            if (a) {
                a.setVisible(true);
            }

        },
        getWidgetEdit (row, key) {
            let realKey = 'we'+(parseInt(row) % this.getPerPage()) +'_'+key
            console.debug('vListEdit.getWidgetEdit',row,realKey,this.$refs[realKey],Array.isArray(this.$refs[realKey]))
            return Array.isArray(this.$refs[realKey])?this.$refs[realKey][0]:this.$refs[realKey];
            // var wConf = this.widgetsEditConfig[row][key];
            // return this.store.cRefs[wConf.cRef];
        },
        getWidget (row, key) {
            let realKey = 'w'+(parseInt(row) % this.getPerPage()) +'_'+key
            console.debug('vListEdit.getWidget',row,realKey,this.$refs[realKey],Array.isArray(this.$refs[realKey]))
            return Array.isArray(this.$refs[realKey])?this.$refs[realKey][0]:this.$refs[realKey];
            // var wConf = this.widgetsEditConfig[row][key];
            // return this.store.cRefs[wConf.cRef];
        },
        setRowData (index,values) {
            var that = this;

            //console.log('fields',that.fields,'values',values);
            try {
                for (var i in that.iconf.fields) {
                    var key = that.iconf.fields[i];
                    that.iconf.widgetsEditConfig[index][key].value = values[key];
                    that.iconf.widgetsConfig[index][key].value = values[key];
                    var we = that.getWidgetEdit(index,key);
                    var w = that.getWidget(index,key);
                    console.debug('setR',we,w,values[key])
                    if (we) {
                        console.debug('we instance',we.instance())
                    }
                    if (w) {
                        console.debug('w instance',w.instance())
                    }
                    if (we) we.setValue(values[key]);
                    if (w) w.setValue(values[key]);
                }
            } catch (e) {
                console.error('vListEdit.setRowData',e);
            }

        },
        getRowEditData (index) {
            let that = this;
            let values = {};
            for (let i in that.iconf.fields) {
                let field = that.iconf.fields[i];
                console.log('prendo ' +index + ' ' + field,that.$refs['we'+index+'_'+field]);
                let w = that.$refs['we'+index+'_'+field];
                if (Array.isArray(w)) {
                    w = w[0];
                }
                if (w) {
                    values[field] = w.getValue()
                }
            }
            console.log('rowEditData values',values);
            return values;
        },
        /**
         * salva una riga
         * @param {indice della row da salvare} index
         */
        save(index,callback) {
            let that = this;
            var values = that.getRowEditData(index);

            //var id = that.view.value[that.index][that.view.primaryKey];
            var r = that.createRoute('update');
            r.setValues({
                modelName: that.iconf.modelName,
                pk : that.iconf.value[index][that.iconf.primaryKey]
            });

            //that.setRouteValues(r);
            r.setParams(values);
            Server.route(r, function (json) {
                if (json.error) {
                    that.errorDialog(json.msg);
                    callback(false)
                    return;
                }
                var msg = json.msg?json.msg:that.translate('app.salvataggio-ok');
                that.alertSuccess(msg,3000);
                var values = json.result;
                that.setRowData(index,values);
                that.setViewMode(index);
                setTimeout(function () {
                    that.setRowData(index,values);
                    callback(true)
                },20)

                //that.view.reload();
            })
            //console.log('values', values);
        }
    }
}
</script>

<style scoped>

</style>
