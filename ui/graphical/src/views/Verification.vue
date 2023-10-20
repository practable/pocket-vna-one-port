<template>

    <div class='row' id='component-grid'>

          <div class='col-sm-6' id='left-screen'>
            <div class='col drop-area' id='drop_0_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><drag-and-drop-verification id='dragDropVerification' :calibrationState="getCalibrationState"/></div>
          </div>

          <div class='col-sm-6' id='right-screen'>
            <div class='col drop-area' id='drop_0_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><data-stream id='data-stream' /></div>
            <div class='col drop-area' id='drop_1_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><smith-chart id='smith-chart' :sparams="getSParams" /></div>
            <div class='col drop-area' id='drop_2_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><graph-output id='graph-output' :sparams="getSParams" /></div>
          </div>

      </div>


</template>

<script>
import { mapGetters } from 'vuex';
import { dragComponent, dropComponent } from '@/js/dragAndDrop.js';

import GraphOutput from '../components/GraphOutput.vue';
import DragAndDropVerification from '../components/DragAndDropVerification.vue';
import SmithChart from '../components/SmithChart.vue';
import DataStream from '../components/DataStream.vue';

export default {
    name: 'Verification',
    props: [],
    data () {
        return {
            
        }
    },
    components: {
        GraphOutput,
        DragAndDropVerification,
        SmithChart,
        DataStream
        
    },
    computed:{
        ...mapGetters([
            'getDraggable',
            'getSParams',
            'getCalibrationState'
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