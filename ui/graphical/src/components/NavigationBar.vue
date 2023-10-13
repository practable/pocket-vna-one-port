//Updated to Vue3, removing eventBus implementation, instead nav bar emits up to App which then controls components and passes props to sibling components

<template>

  <nav class="navbar fixed-top navbar-expand-lg navbar-dark background-primary">
    <div class="container-fluid">
        <img src="/images/practable-icon.png" width="30" height="30" alt="">
      <a class="navbar-brand" href="#">{{labName}}</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              

              
          </ul>

          <!-- <div class='d-flex'>
            <toolbar class='me-5' parentCanvasID="" parentDivID="navbar" parentComponentName="navbar" :showDownload="false" :showOptions="false" :showPopupHelp="true">
                  <template v-slot:popup id='navbar-popup'>
                    <div class='row'>
                      Temp popup
                    </div>
                  </template>
            </toolbar>
          </div> -->


          <div class='d-flex'>
              <clock />
          </div>

      </div>
    </div>
  </nav>

</template>

<script>

import Clock from "./Clock.vue";
//import Toolbar from './elements/Toolbar.vue';
import { mapGetters } from 'vuex';

export default {

  name: 'NavigationBar',
  components: {
    Clock,
    //Toolbar
  },
  props:{
      
  },
  emits:[
    
  ],
  data () {
    return {
        
    }
  },
  computed:{
    ...mapGetters([
      'getConfigJSON'
    ]),
      labName(){
        return 'Pocket VNA Lab: ' + this.getLabTitle;
      },
      getLabTitle(){
      let config = this.getConfigJSON;
      if(config.parameters != undefined){
        let title = config.parameters.find(parameters => {
        return parameters.for === "ui"
      })
        return title.are[0].v;
      } 
      else {
        return '';
      }
    },
  },
  methods: {
      addTool(tool){
          this.toggleComponent('workspace');
          setTimeout(() => {this.$emit('add' + tool)}, 100);  //give the workspace time to initialise and then send tool event
      },
      toggleComponent(component){
          this.$emit('toggle' + component);
      },
      clearWorkspace(){
          this.$emit('clearworkspace');
      },
      toggleLayout(ratio){
        if(ratio == 0.25)
        {
          this.$emit('togglelayout', 0.25);
        }
        else if(ratio == 0.5)
        {
          this.$emit('togglelayout', 0.5);
        }
        else if(ratio == 0.75)
        {
          this.$emit('togglelayout', 0.75);
        }
        else 
        {
          this.$emit('togglelayout', 1);
        }
      }
  }
}
</script>

<style scoped>


</style>