
<script>
import CrudComponent from "../CrudComponent.vue";

export default {
    name: 'd-base',
    extends : CrudComponent,
    //props:['conf'],
    data() {
      let d = Object.assign({
          cBig : false,
          display : true,
          content: null,
          visible: true,
          message: '',
          title: '',
          width: '50vw',
          callbacks: {},
          customClass:'',
          buttons: [],
      },this.conf);
      return d;
    },
  methods: {
    show () {
        let that = this
        that.display = true;
    },
    hide () {
        let that = this
        that.display = false;
    },
    ok : function () {
        let that = this;
        let exist = that.callbacks['ok'] && {}.toString.call(that.callbacks['ok']) === '[object Function]'
        if (exist)
            return that.callbacks['ok'].apply(that);
        console.log('default ok');
        this.hide();
    },
    cancel : function () {
        let that = this;
        let exist = that.callbacks['cancel'] && {}.toString.call(that.callbacks['cancel']) === '[object Function]'
        if (exist)
            return that.callbacks['cancel'].apply(that);
        console.log('default cancel');
        this.hide();
    },

    callCb : function (key) {
        let that = this;
        that.callbacks[key].apply(that);
    },
    buttonCallback(index) {
        let that = this;
        if (that.buttons[index].callback) {
            that.buttons[index].callback.apply(that);
        } else {
            console.warning('button index',index,'non ha una callback',that.buttons);
        }
    },
    destroy() {
        let that = this;
        console.log('destroy dialog component', that.component);
        that.$destroy();
        that.jQe().html(' ');
        that.jQe().remove();
        if (that.component)
            that.component.unmount();
    }
    }
}
</script>

<style scoped>

</style>
