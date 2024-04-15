<template>
    <Dialog class="p-dialog" v-model:visible="display" :modal="true" :style="{width: width}">
        <template #header>
            <h3>{{ translate(title) }}</h3>
        </template>
        <template v-if="componentName">
            <component :is="componentName" :conf="componentConf"></component>
<!--            <c-view :conf="componentConf"></c-view>-->
<!--            <v-list :conf="componentConf"></v-list>-->
        </template>
        <div v-else ref="el">
            <template v-if="Array.isArray(message)">
                <div  v-for="(msg,index) in message" v-html="msg" :key="index"></div>
            </template>
            <template v-else>
                <div v-html="message"></div>
            </template>
        </div>
        <template v-if="Object.keys(callbacks).length > 0"  #footer>
            <Button v-for="(cb,key) in callbacks" :key="key" :callback-name="key" :label="translate(key)" icon="pi pi-check" autofocus v-on:click="callCb(key)" />
        </template>
        <template v-else-if="buttons.length > 0"  #footer>
            <Button v-for="(bt,index) in buttons"
              :key="index"
              :callback-name="'bt'+index"
              :label="bt.label?translate(bt.label):translate('bt'+index)"
              :icon="bt.icon?bt.icon:''"
              :class="bt.css?bt.css:''"
              :autofocus="bt.autofocus?true:false"
              v-on:click="buttonCallback(index)" />
        </template>
    </Dialog>
</template>

<script>
import dBase from './dBase.vue'
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

// import VList from "../views/vList.vue";
import CView from "../views/cView.vue";

export default {
  name: 'd-custom',
  extends: dBase,
    components: {CView, Button,Dialog},
    props : ['confComponent'],
    mounted () {
      if (!this.title) {
        this.title = 'app.nome-app'
      }
    },
    data() {
      let cc = this.confComponent || {};
      let componentName = cc.componentName?cc.componentName:null;
      let componentConf = cc.componentConf?cc.componentConf:null;
      console.log('custom',componentName,componentConf);
      return {
          componentName : componentName,
          componentConf : componentConf,
      }
    },
    methods: {
      showComponent(compName,conf) {
          this.cConf = conf;
          this.componentName = compName;
      }
    }
}
</script>

<style scoped>

</style>
