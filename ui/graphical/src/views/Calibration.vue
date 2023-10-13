<template>

    <div class='row' id='component-grid'>

          <div class='col-md-6' id='left-screen'>
            <div class='col drop-area' id='drop_0_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><drag-and-drop-calibrate id='drag-and-drop-calibrate' :sparams="getSParams"/></div>
          </div>

          <div class='col-md-6' id='right-screen'>
            <div class='col drop-area' id='drop_0_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><data-stream id='data-stream' /></div>
            <div class='col drop-area' id='drop_1_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
          </div>

      </div>


</template>

<script>
import { mapGetters } from 'vuex';
import { dragComponent, dropComponent } from '@/js/dragAndDrop.js';

import DragAndDropCalibrate from '@/components/DragAndDropCalibrate.vue';
import DataStream from '../components/DataStream.vue';
// import GraphOutput from '../components/GraphOutput.vue';

export default {
    name: 'Calibration',
    props: [],
    data () {
        return {
            
        }
    },
    components: {
        DragAndDropCalibrate,
        DataStream,
        //GraphOutput,
        
    },
    computed:{
        ...mapGetters([
            'getDraggable',
            'getSParams',
        ])
    },
    watch:{
        
    },
    created(){
        
    },
    mounted(){
        

    },
    methods:{
        dragComponent(event){
            dragComponent(event);
        },
        dropComponent(event){
            dropComponent(event);
        }

    }
}
</script>

<style>

</style>