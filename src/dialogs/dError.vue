<template>
    <Dialog class="p-dialog bg-blue-500" v-model:visible="display" :modal="true" :style="{width: width}">
        <template #header>
            <h3>{{ translate(title) }}</h3>
        </template>

        <div class="text-red-500" ref="el">
            <template v-if="Array.isArray(message)">
                <div  v-for="(msg,index) in message" v-html="msg" :key="index"></div>
            </template>
            <template v-else>
                <div v-html="message"></div>
            </template>
        </div>

        <template #footer>
            <Button class="p-" :label="translate('app.ok')" icon="pi pi-check" autofocus v-on:click="ok" />
        </template>
    </Dialog>
</template>

<script>
import dBase from './dBase.vue'
import Button from 'primevue/button';
import Dialog from "primevue/dialog";

export default {
  name: 'd-error',
  extends: dBase,
    components: {Button,Dialog},
  mounted () {
    if (!this.title) {
      this.title = 'app.errore'
    }
  }
}
</script>

<style scoped>

</style>
