<template>
    <Dialog class="p-dialog" v-model:visible="display" :modal="true" :style="{width: width}">
        <template #header>
            <h3>{{ translate(title) }}</h3>
        </template>

        <div ref="el">
            <template v-if="Array.isArray(message)">
                <div  v-for="(msg,index) in message" v-html="msg" :key="index"></div>
            </template>
            <template v-else>
                <div v-html="message"></div>
            </template>
        </div>

        <template #footer>
            <Button :label="translate('app.ok')" icon="pi pi-check" autofocus v-on:click="ok" />
        </template>
    </Dialog>
</template>

<script>
import dBase from './dBase.vue'
import Button from 'primevue/button';
import Dialog from "primevue/dialog";

export default {
  name: 'd-warning',
  extends: dBase,
    components: {Button,Dialog},
  mounted () {
    if (!this.title) {
      this.title = 'app.attenzione'
    }
  }
}
</script>

<style scoped>

</style>
