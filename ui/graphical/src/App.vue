<template>

<div id="app" class='container-fluid-sm m-0 background-grey'>

  <navigation-bar />

  <streams id='streams' />

   <div id="tabs" class='row fixed-top d-flex flex-row justify-content-start background-primary ps-3'>
   
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <router-link :class="getCalibrationClass" aria-current="page" :to="{ path: '/calibration', query: $route.query }">1) Calibration</router-link>
            </li>
            <li class="nav-item">
                <router-link :class="getVerificationClass" aria-current="page" :to="{ path: '/verification', query: $route.query }">2) Verification</router-link>
            </li>
            <li class="nav-item">
                <router-link class="tab" aria-current="page" :to="{ path: '/measurement', query: $route.query }">3) Measurement</router-link>
            </li>
        </ul>
          

    </div>

  <router-view/>

</div>
  

</template>

<script>

import { mapGetters } from 'vuex';
import NavigationBar from '@/components/NavigationBar.vue';
import Streams from '@/components/Streams.vue';

export default {
  name: 'App',
  components: {
    NavigationBar,
    Streams,
  },
  data(){
    return {
      
    }
  },
  computed:{
    ...mapGetters([
      'getDraggable',
      'getCalibrated',
      'getVerified'
    ]),
    getCalibrationClass(){
        if(this.getCalibrated){
            return 'tab completed'
        } else{
            return 'tab'
        }
    },
    getVerificationClass(){
        if(this.getVerified){
            return 'tab completed'
        } else{
            return 'tab'
        }
    }
  },
  methods:{
    
  },
}
</script>

<style scoped>

.router-link-active{
    background-color: #9F9F9F;
    border-top:1px solid #9F9F9F;
    border-left:1px solid #9F9F9F;
    border-right:1px solid #9F9F9F;
}

.completed{
    background-color: #048500;
}

#tabs{
    position: sticky;
    top: 0px;
}


</style>
