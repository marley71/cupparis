<template>
    <template v-if="controlType=='button' && _visible()">
        <Button :title="translate(title)" :label="translate(text)"
                :class=getActionClass()
                :icon="icon"
                :disabled="_disabled()"
                @click="_execute($event)"
        />
    </template>
    <template v-else-if="controlType=='link' && _visible()">
        <a class="p-button p-button-outlined" :target="target" :href="_href()"
            :title="translate(title)" :class="css + icon?'p-button-icon':''" :disabled="_disabled()">
            <i class="m-1" v-show="icon" :class="icon"></i>
            <span>{{ translate(text) }}</span>
        </a>
    </template>
    <template v-else-if="controlType  && _visible()" >
        <component :is="controlType" :conf="conf"></component>
    </template>
    <template v-else-if="_visible()">
        <b>controlType ({{ controlType }}) non riconosciuto</b>
    </template>
    <!-- <div v-if="['button','link'].indexOf(controlType) < 0">
        <b>controlType ({{ controlType }}) non riconosciuto</b>
    </div> -->
</template>

<script>
import CrudComponent from "../CrudComponent.vue";
import Server from "../core/Server";
import WrapperConf from "./WrapperConf";

export default {
    name: "aBase",
    extends: CrudComponent,
    //props: ['conf'],
    created() {
        let that = this;
        //console.log('CREATEDDD',that)
        that.overwriteMethods = {};
        var __call = function (lk) {
            that[lk] = function () {
                var localk = new String(lk);
                return that.overwriteMethods[localk].apply(that, arguments);
            }
        }

        for (let k in that.wConf) {
            //console.log('action wConf k',k,that.wConf[k]);

            if (that.wConf[k] instanceof Function) {
                //console.log('found method',k);
                that.overwriteMethods[k] = that.wConf[k];
                __call(k);
            }
        }
        this.Server = Server;
    },
    // mounted() {
    //     let that = this;
    //     if(that.controlType == 'link') {
    //         that.execute();
    //     }
    // },
    data() {
        let that = this;
        let wc = new WrapperConf();
        let ext = wc.loadConf(that.conf);
        let dt = {};
        for (let k in ext) {
            if (!(ext[k] instanceof Function)) {
                dt[k] = ext[k];
            }
        }

        dt.wConf = ext;
        // bug da capire perche'
        if (!dt.text)
            dt.text = '';
        if (!dt.title)
            dt.title = '';
        // if (!dt.icon) {
        //     dt.icon = '';
        // }
        //console.debug('action finalData',dt);
        return dt;
    },
    methods: {
        getButtonSize() {
            var that = this;
            var buttonSize = that.conf.buttonSize ? that.conf.buttonSize : 'small';

            switch (buttonSize) {
                case 'small':
                    return 'p-button p-button-sm';
                case 'normal':
                    return 'p-button';
                case 'large':
                    return 'p-button-lg';
            }

        },
        getButtonClass() {
            var that = this;
            return that.conf.buttonClass ? that.conf.buttonClass
                : 'p-button-outlined w-auto';
        },
        getActionClass() {
            var that = this;
            if (that.conf.actionClass) {
                return that.conf.actionClass;
            }
            return that.getButtonSize() + ' '
                + that.getButtonClass() + ' '
                + that.conf.spacing;
        },
        _href() {
            if (this.href instanceof Function) {
                return this.href.apply(this);
            }
            return this.href;
        },
        _visible() {
            //console.log('_visible',this.visible);
            if (this.visible instanceof Function) {
                return this.visible.apply(this);
            }
            return this.visible;
        },
        _disabled() {
            //console.log('_disable',this.enabled);
            if (this.enabled instanceof Function) {
                return !this.enabled.apply(this);
            }
            return !this.enabled;
        },
        _beforeExecute() {
            let that = this;
            return new Promise((resolve,reject) => {
                console.debug('_beforeExecute',that.beforeExecute);
                if (!that.beforeExecute) {
                    console.debug('_beforeExecute2');
                    resolve(true);
                } else {
                    console.debug('_beforeExecute1');
                    let result = that.beforeExecute();
                    console.log('result',result);
                    if (result && result instanceof Promise) {
                        result.then(() => {
                            console.debug('1then')
                            resolve(true)
                        }).catch(() => {
                            console.debug('2rejedct')
                            reject();
                        })
                        return ;
                    }
                    if (result) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }

            })
        },
        _execute(event) {
            let that = this;
            event.preventDefault();
            if (that.execute) {
                that._beforeExecute().then(() => {
                    try {
                        let result =  that.execute(event);
                        console.debug('execute after',result)
                        if (result && result instanceof Promise) {
                            result.then(() => {
                                that._afterExecute();
                            }).catch((error) => {
                                console.error('execute fallita',error)
                            })
                        } else {
                            if (result) {
                                that._afterExecute();
                            }
                        }
                    } catch(e) {
                        throw e
                    }

                }).catch((error) => {
                     console.error('beforeExecute failed',error);
                     throw error;
                })
            } else {
                alert('execute non definita')
            }
        },

        _afterExecute(params) {
            if (this.afterExecute) {
                this.afterExecute(params);
            }
        },

        setEnabled(value) {
            this.enabled = value;
        },
        setVisible(value) {
            this.visible = value;
        }
    }
}
</script>

<style scoped>

</style>
