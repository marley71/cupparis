<template >
    <Dialog class="p-dialog" v-model:visible="display" :modal="true" :style="{width: width}" :class="customClass ? customClass : ''" >
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
            <Button :label="translate('app.annulla')" icon="pi pi-times p-button-secondary" autofocus v-on:click="cancel" />
            <Button :label="translate('app.ok')" icon="pi pi-check" autofocus v-on:click="ok" />
        </template>
    </Dialog>

<!--  <div ref="el"  c-confirm-dialog class="modal" tabindex="-1" role="dialog"-->
<!--       aria-labelledby="" aria-hidden="true"-->
<!--  >-->
<!--    <div class="modal-dialog" :class="customClass ? customClass : ''" role="document">-->
<!--      <div class="modal-content">-->
<!--        <div class="modal-header">-->
<!--          <h5 class="modal-title">{{ translate(title) }}</h5>-->
<!--          <button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
<!--            <span class="fi fi-close fs&#45;&#45;18" aria-hidden="true"></span>-->
<!--          </button>-->
<!--        </div>-->
<!--        <div class="modal-body">-->
<!--          <div class="alert alert-default">-->
<!--            <template v-if="Array.isArray(message)">-->
<!--              <div v-for="(msg,index) in message" v-html="msg" :key="index"></div>-->
<!--            </template>-->
<!--            <div v-else v-html="message"></div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="modal-footer">-->
<!--          <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="ok">-->
<!--              {{ translate('app.ok') }}-->
<!--          </button>-->
<!--          <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="cancel">-->
<!--            {{ translate('app.annulla') }}-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script>
import dBase from './dBase.vue'

export default {
  name: 'd-confirm',
  extends: dBase,
  mounted () {
    if (!this.title) {
      this.title = 'app.richiesta-conferma'
    }
  }
}
</script>

<style scoped>

</style>
