<template>
    <Card ref="el">
        <template #title>
            <slot name="title">
                {{ translate('app.import-titolo') }}
            </slot>
        </template>
        <template #content>
            <slot name="description">
                <div class="mb-0" v-html="translate('app.import-desc')"></div>
            </slot>

            <div v-if="step == 'upload'" class="panel panel-default">
                <h5>{{ translate('app.import-file') }}</h5>
                <div class="col-12">
                    <c-view :conf="_uploadConf()" ref="viewUpload"></c-view>
                </div>
            </div>
            <div v-if="['saving','loading'].indexOf(step) >= 0">
                <ProgressBar mode="indeterminate">
                    <div v-if="step==='loading'">
                        Lettura file e check degli errori ...&nbsp;
                    </div>
                    <div v-if="step==='saving'">
                        Salvataggio del file importato ...
                    </div>
                </ProgressBar>
            </div>
            <div v-if="step=='tosave'">
                <div>File caricato e controllato</div>
                <hr/>
                <v-record :conf="_saveConf()"></v-record>
                <v-list :conf="_listConf()">
                </v-list>
            </div>
        </template>
    </Card>
</template>

<script>
import CrudComponent from "../CrudComponent.vue";
import Server from "../core/Server";
import cView from "../views/cView.vue";
import vRecord from "../views/components/vRecord.vue";

export default {
    name: "c-import",
    components: {vRecord, cView},
    extends : CrudComponent,
    //props : ['conf'],
    data() {
        let that = this;
        window.IMPORT = this;
        if (!('title' in that.conf)) {
            that.conf.title = null;
        }
        if (!('sectionTitle' in that.conf)) {
            that.conf.sectionTitle = null;
        }
        //this.setManageActions();
        that.conf.step = 'upload';
        that.conf.viewDisplay = false;
        that.conf.importStatus = 'upload';
        that.conf.jobId = null;
        return that.conf;
    },
    watch: {
        importStatus() {
            switch (this.importStatus) {
                case 'upload':
                    break;
                case 'load':
                    this.checkStatus();
            }
        }
    },
    methods: {
        _uploadConf() {
            let that = this;
            //let userConf = that.viewUpload; //that.merge({},that.viewUpload);
            let userConf = {
                cRef: 'viewUpload',
                type : 'v-edit',
                routeName: 'datafile_insert',
                fields: [],
                actions: ['action-save'], // 'action-cancel'],
                fieldsConfig: {},
                actionsConfig: {
                    'action-save': {
                        text: 'app.import-button',
                        enabled:false,
                        csvDashboard : that,
                        execute() {
                            that.importForm();
                        }
                    }
                }
            }

            userConf.modelName = that.providerName;
            let confUpload = that._defaultUploadConf();
            let rsName = confUpload.name;
            if (userConf.fields.indexOf(rsName) < 0)
                userConf.fields.push(rsName);
            userConf.fieldsConfig[rsName] = confUpload;
            console.log('UPLOAD VIEW',userConf)
            return  userConf;
        },
        _defaultUploadConf() {
            var thatImport = this;
            var conf = thatImport.conf;
            var confUpload = {
                name: 'resource',
                type: 'w-upload-ajax',
                layout : {
                    labelPosition : 'none',
                },
                maxFileSize: '2M',
                routeName: 'uploadfile',
                modelName: null,
                extensions: [
                    'csv'
                ],
                ajaxFields: {
                    field: 'resource',
                    resource_type: 'attachment'
                },

                onError() {

                },
                onSuccess() {
                    //var that = this
                    var viewUpload = thatImport.$refs.viewUpload.instance();
                    window.pippo = thatImport;
                    console.log('viewUpload action-save', viewUpload.getAction('action-save'))
                    viewUpload.getAction('action-save').setEnabled(true)
                },
            }
            confUpload = Object.assign(confUpload,(conf.confUpload || {}));
            //console.log('BBBBB',confUpload);
            return confUpload;
        },
        importForm() {
            let that = this;
            let importView = that.$refs.viewUpload.instance();
            let viewParams = importView.getViewData();

            let w = importView.getWidget('resource');
            let value = JSON.parse(w.getValue());
            let r = this.createRoute('load_datafile');
            r.setParams(viewParams);
            r.setParam('fileName',value.id);
            r.setParam('datafileProviderName',that.providerName);
            r.setParam('resource',value);

            // var params = thatAction.merge(viewParams,{
            //     'fileName': value.id,
            //     'datafileProviderName': thatAction.csvDashboard.providerName,
            // })
            // r.setParams(params);
            console.log('ROUTE',r.getConf());
            //that.waitStart('caricamento file da importare...');
            window.RR = r;

            Server.route(r,function (json) {
                console.log('json',json);
                var checkError = that.checkJobError(json);
                if (checkError.error) {
                    that.step = 'upload'
                    that.errorDialog(checkError.msg);
                    return ;
                }
                that.step = 'loading';
                that.jobId = json.jobId;
                var params = {
                    jobId : json.jobId,
                    progressEnabled : true,
                }
                console.log('evento','start-import',params)
                that.importStatus = 'load';
            })
        },
        checkJobError : function (json) {
            if (json.error) {
                return  {
                    error : 1,
                    msg : json.msg
                };
            }
            if (json.job && json.job.error) {
                return {
                    error : 1,
                    msg : json.job.msg
                };
            }
            return {
                error : 0
            };
        },
        checkStatus : function () {
            var that = this;
            console.log('checkStatus',that.jobId);
            var r = that.createRoute('status_queue');
            r.setValues({
                id : that.jobId
            });
            Server.route(r,function (json) {
                if (json.error) {
                    clearInterval(that.timerStatus);
                    that.errorDialog(json.msg);
                    that.setStatus(true);
                    return ;
                }
                that.progress(json);
            })
        },
        progress : function (json) {
            var that = this;

            var checkError = that.checkJobError(json);

            if (checkError.error ) {
                that.progressEnabled = false;
                that.errorDialog(checkError.msg);
                that.setStatus(true);
                if (that.timerStatus) {
                    clearInterval(that.timerStatus);
                    that.timerStatus = null;
                }

                return ;
            }
            if (json.job.end) {
                console.log('job end',that.step)
                that.progressEnabled = false;
                clearInterval(that.timerStatus);
                that.timerStatus = null;
                if (that.step == 'loading') {
                    that.step = 'tosave';
                    that.saveEnabled = true;
                    that.uploadEnabled = false;
                    //that.datafileConf.jobId = that.jobId;
                    //that.modelName = that.csvProviderName;
                }
                if (that.step == 'saving') {
                    that.reset();
                    that.alertSuccess('Dati salvati',3000);
                }
                console.log('job end 2',that.step,that.saveEnabled,that.uploadEnabled)
                return ;
            }
            console.log('check',that.timerStatus);
            if (!that.timerStatus)
                that.timerStatus = setInterval(that.checkStatus,2000)
        },
        setStatus(preview) {
            let that = this;
            console.log('setStatus',preview,that.step);
            if (preview) {
                switch (that.step) {
                    case 'loading':
                        that.step = 'upload';
                        that.uploadEnabled = true;
                        that.progressEnabled = false;
                        break;
                }
            } else {
                switch (that.step) {
                    case 'loading':
                        that.step = 'tosave';
                        that.saveEnabled = true;
                        that.uploadEnabled = false;
                        break;
                    case 'saving':
                        that.step = 'upload';
                        that.uploadEnabled = true;
                        that.saveEnabled = false;
                        that.alertSuccess('Dati salvati',3000);
                        break;
                }
            }
        },
        _listConf() {
            var that = this;
            var userConf = that.viewList; //that.merge({},that.viewList);
            if (!userConf.type) {
                userConf.type = 'v-list';
            }
            userConf.jobId = that.jobId;
            userConf.modelName = that.providerName;
            userConf.actions = [];
            console.debug('import list conf',userConf);
            return userConf;
        },
        _saveConf() {
            var that = this;
            var userConf = that.viewSave; //that.merge({},that.viewSave);
            if (!userConf.type) {
                userConf.type = 'v-insert';
            }
            userConf.modelName = that.providerName;
            userConf.actionsConfig = that.viewSave.actionsConfig || {};
            userConf.fieldsConfig = that.viewSave.fieldsConfig || {};

            var aS = userConf.actionsConfig['action-save'] || {};
            aS.csvDashboard = that;
            aS.execute = function () {
                var thatAction = this;
                var r = thatAction.createRoute('save_datafile');
                var viewParams = thatAction.view.getViewData();
                r.setParams(viewParams);
                r.setParam('datafile_load_id',thatAction.csvDashboard.jobId);
                r.setParam('datafileProviderName',thatAction.csvDashboard.providerName);

                // var params = thatAction.merge(viewParams,{
                //     datafile_load_id : thatAction.csvDashboard.jobId,
                //     datafileProviderName : thatAction.csvDashboard.providerName,
                // })
                // r.setParams(params);
                Server.route(r,function (json) {
                    if (json.error) {
                        thatAction.errorDialog(json.msg);
                        return ;
                    }
                    thatAction.csvDashboard.jobId = json.jobId;
                    thatAction.csvDashboard.step='saving';
                    thatAction.csvDashboard.progressEnabled = true;
                    thatAction.csvDashboard.checkStatus();
                })
            }
            userConf.actionsConfig['action-save'] = aS;

            var aB = userConf.actionsConfig['action-back'] || {};
            aB.csvDashboard = that;
            aB.execute = function () {
                this.csvDashboard.reset();
            }
            userConf.actionsConfig['action-back'] = aB;

            console.debug('saveConf',userConf);
            return  userConf;
        },
        reset() {
            this.step = 'upload';
            this.importStatus = 'upload';
            this.uploadEnabled = true;
            this.saveEnabled = false;
        }
    }
}
</script>

<style scoped>

</style>
