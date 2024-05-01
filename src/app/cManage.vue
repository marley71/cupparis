<template>
    <Panel class="managePanel rounded">
        <template #header>
            <h5 class="p-panel-title">
                <span v-if="iconf.title" >
                    {{iconf.title}}
                </span>
                <span v-else>
                    {{translate('app.gestione')}} {{ translate(iconf.modelName + '.label', null,1) }}
                </span>
            </h5>
        </template>
        <div v-if="iconf.sectionTitle" class="p-card-subtitle" >
            {{iconf.sectionTitle}}
        </div>
        <div class="text-center" v-if="mode=='loading'">
            <ProgressSpinner ></ProgressSpinner>
        </div>

        <div>
            <div v-show="mode=='list'">
                <template v-if="!iconf.hideSearch">
                    <c-view v-if="!iconf.searchComponentName" :conf="iconf.search" ref="vSearch" @search="searchList"></c-view>
                    <component v-else :is="iconf.searchComponentName" :conf="iconf.search" ref="vSearch" @search="searchList"></component>
                </template>

<!--                <Divider align="center" class="listDivider mt-5">-->
<!--                    <span class="p-tag bg-primary-700 text-white">-->
<!--                                    Elenco elementi-->
<!--                    </span>-->
<!--                </Divider>-->

                <c-view v-if="!iconf.listComponentName"  :conf="iconf.list" ref="vList" @loaded="showListMia"></c-view>
                <component v-else :is="iconf.listComponentName" :conf="iconf.list" ref="vList"></component>
            </div>
            <template v-if="mode=='edit'">
                <c-view v-if="!iconf.editComponentName"  :conf="iconf.edit" ref="vRecord"></c-view>
                <component v-else :is="iconf.editComponentName" :conf="iconf.edit" ref="vRecord"></component>
            </template>
            <template v-else-if="mode=='insert'">
                <c-view v-if="!iconf.insertComponentName"  :conf="iconf.insert" ref="vRecord"></c-view>
                <component v-else :is="iconf.insertComponentName" :conf="iconf.insert" ref="vRecord"></component>
            </template>
        </div>
        <Dialog class="p-dialog" v-model:visible="viewDisplay" :modal="true" :style="{width: '50vw'}">
            <template #header>
                <h3>{{ translate(viewTitle) }}</h3>
            </template>

            <template v-if="viewDisplay">
                <c-view v-if="!iconf.viewComponentName" :conf="iconf.view" ref="vView"></c-view>
                <component v-else :is="iconf.viewComponentName" :conf="iconf.view"></component>
            </template>
            <div class="modal-footer">
                <Button :label="translate('app.ok')" icon="pi pi-check" autofocus @click="viewDisplay=false"/>
            </div>
        </Dialog>
    </Panel>
</template>

<script>
import cView from "../views/cView.vue";
import CrudComponent from "../CrudComponent.vue";
//import viewConfs from '../confs/views';
//import viewWrapperConf from '../views/WrapperConf'
import CrudCore from "../core/CrudCore";
import {useModelWrapper} from "../core/modelWrapper";
//import Dialog from "primevue/dialog";

export default {
    name: "Manage",
    extends : CrudComponent,
    components: {cView},
    //props : ['conf'],
    watch : {
        // '$route' (to, from) {
        //     console.log('TOOOOO',to,from);
        // },
        '$route.params.context': {
            handler: function(context) {
                //console.log('context watch');
                if (this.getViewList()) {
                    this.showContext();
                }

            },
            deep: true,
            //immediate: true
        }
    },
    mounted() {
        window.MG = this;
        this.showContext();
    },
    setup(props, { emit }) {
        props.conf.title = null;
        props.conf.sectionTitle = null;
        props.conf.hideSearch = false;
        props.conf.autoUpdateHash = true;
        props.conf.baseRouteName = 'manage';
        props.conf.editComponentName = null;
        props.conf.listComponentName = null;
        props.conf.searchComponentName = null;
        props.conf.insertComponentName = null;
        props.conf.viewComponentName = null;
        if (props.conf.list) {
            props.conf.list.autoload = false;
        }
        // that.conf.viewTitle = '';
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    data() {

        // let wc = new viewWrapperConf();
        // console.log('wc',wc);
        // //that.conf.list = that.conf.list?wc.loadConf(that.conf.list):{};
        // // that.conf.view = that.conf.view?wc.loadConf(that.conf.view):{};
        // that.conf.list = wc.loadConf(that.conf.list);
        // that.conf.edit = that.conf.edit?wc.loadConf(that.conf.edit):{};
        // // that.conf.insert = that.conf.insert?wc.loadConf(that.conf.insert):null;
        //
        this.setManageActions();
        this.setDefaultViewsProperties()
        // that.conf.mode = 'list';
        // that.conf.viewDisplay = false;


        // if (this.conf.list) {
        //     this.conf.list.autoload = false;
        // }
        // return that.conf;
        return {
            mode : 'loading',
            viewDisplay : false,
        };
    },
    methods : {
        searchList(event) {
            console.debug('searchList',event);
            if (this.getViewList()) {
                this.getViewList().setParams(event);
                this.getViewList().load();
            }
            //this.$refs.vList.instance().setParams(event);
        },
        setDefaultViewsProperties() {
            let that = this;
            console.debug('cManage.setDefaultViewsProperties',that.iconf);

            if (!('search' in that.iconf)) {
                that.iconf.search = {
                    type : 'v-search',
                    routeName : 'search',
                    modelName : that.iconf.modelName
                }
            }

            if (!('edit' in that.iconf)) {
                that.iconf.edit = {
                    type : 'v-edit',
                    routeName : 'edit',
                    pk : null,
                    modelName : that.iconf.modelName
                }
            }
            if (!('insert' in that.iconf)) {
                that.iconf.insert = Object.assign({},CrudCore.clone(that.iconf.edit));
                that.iconf.insert.type = 'v-insert';
                that.iconf.insert.routeName = 'insert';
            }
            if (!('view' in that.iconf)) {
                that.iconf.view = Object.assign({},CrudCore.clone(that.iconf.view));
                that.iconf.view.type = 'v-view';
                that.iconf.view.routeName = 'view';
                that.iconf.view.modelName = that.iconf.modelName;
                console.log('modelName',that.iconf.modelName);
            }
            // if (that.iconf.list) {
            //     this.conf.list.autoload = false;
            // }
            this.conf.insert.autoload= false;
            this.conf.edit.autoload= false;
        },
        setManageActions() {
            let that = this;
            let manage = this;
            // in caso di configurazioni non valide metto i valori accettabili
            that.iconf.list.actionsConfig = that.iconf.list.actionsConfig || {};
            that.iconf.list.actions = that.iconf.list.actions || [];

            if (that.iconf.list.actions.indexOf('action-view') >= 0) {
                let actionView = that.iconf.list.actionsConfig['action-view'] || {};
                if (!actionView.execute){
                    actionView.execute = function () {
                        let thatAction = this;
                        that.iconf.view.pk = thatAction.modelData[that.$refs.vList.instance().prop('primaryKey')];
                        that.viewDisplay = true;
                        that.viewTitle = that.translate('app.dettagli',0,null,[that.iconf.view.pk]);
                    }
                }
                that.iconf.list.actionsConfig['action-view'] = actionView;
            }
            if (that.iconf.list.actions.indexOf('action-edit') >= 0) {
                let actionEdit = that.iconf.list.actionsConfig['action-edit'] || {};
                if (!actionEdit.execute){
                    actionEdit.execute = function () {
                        let thatAction = this;
                        that.iconf.edit.pk = thatAction.modelData[manage.getViewList().prop('primaryKey')];
                        that.mode = 'edit';
                        let confName = this.$route.params.cConf;
                        that.updateHash(confName,'edit',[that.iconf.edit.pk]);
                        //window.history.pushState({},'',window.location.pathname + '#/' + manage.baseRouteName + '/'+ confName +'/edit/' + that.edit.pk);
                    }
                }
                that.iconf.list.actionsConfig['action-edit'] = actionEdit;
            }
            if (that.iconf.list.actions.indexOf('action-insert') >= 0) {
                let actionInsert = that.iconf.list.actionsConfig['action-insert'] || {};
                if (!actionInsert.execute){
                    actionInsert.execute = function () {
                        that.mode = 'insert';
                        let confName = this.$route.params.cConf;
                        that.updateHash(confName,'insert');
                        //window.history.pushState({},'',window.location.pathname + '#/' + manage.baseRouteName + '/'+ confName +'/insert');
                    }
                }
                that.iconf.list.actionsConfig['action-insert'] = actionInsert;
            }
            if (that.iconf.edit && that.iconf.edit.actions && that.iconf.edit.actions.indexOf('action-back') >= 0) {
                let actionBack = that.iconf.edit.actionsConfig['action-back'] || {};
                if (!actionBack.execute){
                    actionBack.execute = function () {
                        that.mode = 'list';
                        if (that.autoUpdateHash) {
                            window.history.back();
                        } else {
                            that.getViewList().reload();
                        }


                    }
                }
                that.iconf.edit.actionsConfig['action-back'] = actionBack;
            }
        },
        getViewList() {
            return this.$refs.vList?this.$refs.vList.instance():null;
        },
        getViewSearch() {
            return this.$refs.vSearch?this.$refs.vSearch.instance():null;
        },
        getViewRecord() {
            return this.$refs.vRecord?this.$refs.vRecord.instance():null;
        },
        /**
         * gestione del back mostra la vista giusta in baso allo stato della cmanage
         */
        showContext() {
            let that = this;
            console.debug('showContext',that.$route.params.context)
            let context = that.$route.params.context;
            if (!context || context.length == 0) {
                if (that.getViewList()) {
                    that.mode = 'list';
                    that.searchList();
                }

                return ;
            }
            let mode = context[0];
            that.mode = mode;
            switch(mode) {
                case 'edit':
                    that.iconf.edit.pk = context[1];
                    break;
                case 'insert':
                    break;
                case 'list':
                    var vList = that.getViewList();
                    if (vList) {
                        let listParams = context.filter( a => a.indexOf('s_') == 0) || [];
                        listParams = listParams.concat( context.filter( a => a.indexOf('page') == 0));
                        console.log('LISTPARAMS',listParams,JSON.stringify(vList.value),context.filter( a => a.indexOf('page') == 0));
                        if (listParams.length > 0) {
                            vList.autoload = false;
                            //that.waitViewLoaded('list',function() {

                                console.debug('view loaded');
                                for (let i in listParams) {
                                    let tmp = listParams[i].split(':');
                                    if (tmp.length != 2) {
                                        console.warn('non riesco a definire il valore da filtrare per il parmetro',listParams[i],tmp);
                                        continue;
                                    }
                                    vList.route.setParam(tmp[0],tmp[1]);
                                }

                            //})
                            that.waitViewLoaded('search',function() {
                                let vSearch = that.getViewSearch();
                                //window.VSS = vSearch;
                                for (let i in listParams) {
                                    let tmp = listParams[i].split(':');
                                    if (tmp.length != 2) {
                                        continue;
                                    }
                                    let fieldName = tmp[0];
                                    if (vSearch.isSpecialField(fieldName)) {
                                        vSearch.setSpecialField(fieldName,tmp[1]);
                                        continue;
                                    }
                                    fieldName = fieldName.substring(2);
                                    if (!vSearch.getWidget(fieldName)) {
                                        console.warn('getWidget ha ritornato null per ', fieldName);
                                        continue;
                                    }
                                    vSearch.getWidget(fieldName).setValue(tmp[1]);
                                }

                            })
                        }
                        vList.load();

                    }
                    break;
            }
        },
        waitViewLoaded(type,callback) {
            let that = this;
            if (type ==  'list') {
                let vList = this.getViewList();
                if (!vList || !vList.prop('loaded')) {
                    setTimeout(function() {
                        that.waitViewLoaded(type,callback);
                    },20)
                } else {
                    return callback();
                }
            } else if (type == 'search') {
                let vSearch = this.getViewSearch();
                if (!vSearch || !vSearch.prop('loaded')) {
                    setTimeout(function() {
                        that.waitViewLoaded(type,callback);
                    },20)
                } else {
                    return callback();
                }
            } else {
                console.warn('wait ' + type + ' non gestito');
            }
        },
        showListMia() {
            let that = this;
            let confName = this.$route.params.cConf;
            let params = that.getViewList().prop('route').getParams();
            let context = [];
            if (params && params instanceof FormData) {
                for (let key of params.keys()) {
                    let values = params.getAll(key);
                    context.push(key+':'+values.join('&'));
                }
            } else if (params  && params instanceof Object) {
                for (let key in params) {
                    let values = params[key];
                    if (Array.isArray(values)) {
                        context.push(key+':'+values.join('&'));
                    } else {
                        context.push(key+':'+values);
                    }

                }
            }
            //console.debug('listmia',params,context,window.location.pathname);192
            //window.history.pushState({},'',window.location.pathname + '#/' + that.baseRouteName + '/'+ confName +'/list/' + context.join('/'));
            that.updateHash(confName,'list',context);

        },
        updateHash(confName,type,context) {
            let that = this;
            let hash = '';
            if (this.autoUpdateHash) {
                hash = window.location.pathname + '#/' + that.baseRouteName + '/'+ confName +'/' + type;
                if (context && context.length > 0) {
                    hash += '/' + context.join('/');
                }
                window.history.pushState({},'',hash);
            }
        }
    }
}

</script>

<style lang="scss" scoped>
.managePanel {
    :deep(.p-panel-header) {

        background-color: var(--primary-color);


        .p-panel-title {
            color: var(--primary-color-text);
        }

        h5.p-panel-title {
            margin-bottom: .5rem;
        }
    }

    :deep(.p-panel-content) {
        border-color: var(--primary-color);
    }

    :deep(.p-panel-header) {
        border-color: var(--primary-color);
    }
}

.listDivider.p-divider-horizontal:before {
    border-color: var(--primary-700);
}
</style>
