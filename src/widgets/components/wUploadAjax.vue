<script>
import wBase from './wBase.vue'
import {useModelWrapper} from "../modelWrapper";
import WidgetsWrapperConf from "../../confs/WidgetsWrapperConf";
import Server from "../../core/Server";
export default {
    name: "wUploadAjax",
    extends: wBase,
    setup(props, { emit }) {
        WidgetsWrapperConf.setConf(props.conf);
        return {
            iconf: useModelWrapper(props, emit),
        }
    },
    methods : {
        setRouteValues(route) {
            if (this.iconf.setRouteValues) {
                return this.iconf.setRouteValues.apply(this,[route]);
            }
            route.setValues({
                modelName: this.modelName
            })
            return route;
        },
        onSuccess() {
            if (this.iconf.onSuccess) {
                this.iconf.onSuccess.apply(this);
                return
            }
        },
        onError() {
            if (this.iconf.onError) {
                this.iconf.onError.apply(this);
                return
            }
        },
        uploadFile(event) {
            this.files = event.files;
            this.sendAjax();
        },
        sendAjax() {
            var that = this;
            var fDesc = that.getFileValue();
            if (!fDesc || !fDesc[0])
                throw 'descrittore file upload non valido';
            fDesc = fDesc[0];
            // var fileName = fDesc.filename;
            var route = that.createRoute(that.routeName);
            that.setRouteValues(route);
            that.error = false;
            that.complete = false;

            var realUrl = Server.getUrl(route.getUrl());
            console.log('realurl', route.getUrl())
            var fdata = new FormData();
            //data.append('file',jQuery(that.$el).find('[c-image-file]').prop('files')[0]);
            fdata.append('file', fDesc)
            console.log('ajaxFields', that.ajaxFields)
            for (var k in that.ajaxFields)
                fdata.append(k, that.ajaxFields[k])
            Server.post(realUrl,fdata,function(data) {
                that.json = data;
                if (!data.error) {
                    console.log("Success: Files sent!", data);
                    if (data.error) {
                        // var msg = null;
                        // try {
                        //     var tmp = JSON.parse(data.msg);
                        //     msg = "";
                        //     for (k in tmp) {
                        //         msg += tmp[k] + '\n';
                        //     }
                        // } catch (e) {
                        //     msg = data.msg;
                        // }
                        that.error = true;
                        that.errorMessage = Server.getErrorMessage(data.msg);
                        //self._showError(dialog,msg);
                        window.jQuery(that.$el).find('[crud-button="ok"]').addClass("disabled");
                        that.value =  JSON.stringify({});
                        that.fileInfo = null;
                        return;
                    }
                    that.$emit('success', that);
                    that.complete = true;

                    console.log('done, data.result', data.result);

                    //that.lastUpload = Object.assign({},data.result);
                    that.fileInfo = Object.assign({},data.result);
                    // TODO sfruttare meglio l'oggetto upload primeface
                    that.value = JSON.stringify(data.result); //.replace(/\\"/g, '"');
                    //that.$refs.preview.setValue(data.result);
                    that.onSuccess();
                } else {
                    console.log("An error occurred, the files couldn't be sent!");
                    that.fileInfo = null;
                    that.error = true;
                    that.errorMessage = Server.getErrorMessage(data.msg);
                    that.value = JSON.stringify({});
                    that.onError();
                }

            });
        }
    }
}
</script>

<template>
    <div>
        <Message v-if="error" severity="error" :closable="false">{{ errorMessage }}</Message>
        <div class="flex">
            <FileUpload mode="basic" :auto="true" :customUpload="true" @uploader="uploadFile"
                        :multiple="false" v-bind="iconf.extraBind"/>
            <div class="ml-5">
                <div class="mt-3" v-if="fileInfo">
                    <template
                        v-if="['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].indexOf(fileInfo.mimetype) >= 0">
                        <i class="fa fa-file-excel fa-2xl"></i>
                    </template>
                    <template v-else-if="['application/pdf'].indexOf(fileInfo.mimetype) >= 0">
                        <i class="fa fa-file-pdf fa-2xl"></i>
                    </template>
                    <template v-else-if="['image/jpeg'].indexOf(fileInfo.mimetype) >= 0">
                        <img :src="fileInfo.url"/>
                    </template>
                    <template v-else>
                        <i class="fa fa-file fa-2xl"></i>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
