<template>
  
 <div class='container-sm m-2 background-white border rounded'>

     <div v-if='!getCalibrated || !getVerified'>
         <h4 class='txt-primary txt-lg'>Please calibrate and verify the Pocket VNA before progressing</h4>
     </div>

    <div v-else>
        <h4 v-if='calibrationState.sparams.length < 2'> 1 port Measurement </h4>
        <h4 v-else> 2 port Measurement </h4>

        <div v-if='calibrationState.sparams.length > 1' class='row mb-2'>
        <div class='col-12'>
            <div v-if='sparams.includes("s11")' class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="flexCheckDefault" id="s11check" v-model='s11' disabled>
            <label class="form-check-label" for="s11check">S11</label>
            </div>

            <div v-if='sparams.includes("s12")' class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="flexCheckDefault" id="s12check" v-model='s12' disabled>
            <label class="form-check-label" for="s12check">S12</label>
            </div>

            <div v-if='sparams.includes("s21")' class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="flexCheckDefault" id="s21check" v-model='s21' disabled>
            <label class="form-check-label" for="s21check">S21</label>
            </div>

            <div v-if='sparams.includes("s22")' class="form-check form-check-inline">
            <input class="form-check-input" type="checkbox" name="flexCheckDefault" id="s22check" v-model='s22' disabled>
            <label class="form-check-label" for="s22check">S22</label>
            </div>
            
        </div>
        </div>

        <div class='row m-3'>
        
            <div class='input-group'>
            <div class='col-md-2 pe-2'>
                <label for="sizeRange" class="txt-grey">Data points</label>
            </div>
            <div class='col-md-8 pe-2'>
                <input type="range" class="form-range" min="2" max="501" step="1" id="sizeRange" :value='calibrationState.points' disabled>
            </div>
            <div class='col-md-2'>
                <label class='txt-grey'>{{ calibrationState.points }}</label>
            </div>
            </div>
        
        </div>

        
        <div class='d-flex flex-column'>
            <!-- CALIBRATION COMMANDS SHOWING BUT DISABLED-->
            <div class="input-group mb-2">
            <span class="input-group-text txt-grey col-sm-3">Start</span>
            <input type="number" class='form-control' placeholder="Start frequency" aria-label="freq" aria-describedby="basic-addon1" id="freq" :value="calibrationState.start" disabled>
            <span class="input-group-text txt-grey" id="basic-addon1">MHz</span>
            </div>

            <div class="input-group">
            <span class="input-group-text txt-grey col-sm-3" id="basic-addon1">End</span>
            <input type="number" class='form-control' aria-label="freq" aria-describedby="basic-addon1" id="freq_end" :value='calibrationState.end' disabled>     
            <span class="input-group-text txt-grey" id="basic-addon1">MHz</span>
            </div>
        </div>


        <!-- Drag and Drop elements -->
        <drag-and-drop-components id='dragdropcomponents' header="" :display='standards' @port1change='updatePort1' @port2change='updatePort2'/>
        
        <div class='d-flex flex-row justify-content-center'>

            <button id="measure" type='button' class="button-lg button-success" @click='measure' :disabled="port1 == '' && port2 == ''">Measure</button>

        </div>


        



        <transition name='fade'>
        <div v-if='getShowRequestModal' class="modal" id='modal-show' tabindex="-1">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" style="background-color: #ccc">
                <h5 class="modal-title">Requesting Measurement from Pocket VNA</h5>
                </div>
                <div class="modal-body">
                <div class='d-flex row align-items-center'>
                    <div class='col-2'>
                    <div class="spinner-border text-primary text-center" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    </div>
                    <div class='col-10'>
                    <p> Please wait for the pocket VNA to measure.</p>
                    <p>This could take around 30 seconds.</p>
                    </div>
                </div>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-danger" @click="setShowRequestModal(false)">Close</button>
                </div>
            </div>
            </div>
        </div>
        </transition>
    </div>
</div>


</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DragAndDropComponents from '@/components/DragAndDropComponents.vue';


export default {
   name: 'DragAndDropMeasurement',
    props: ['calibrationState'],
    components:{
        DragAndDropComponents,
    },
    data () {
        return {
            standards: [
                {type: 'short', img: "Short"},
                {type: 'open', img: "Open"},
                {type: 'load', img: "Load"},
                {type: 'dut', img: "DUT_real"},
            ],

            port1: '',
            port2: '',

        }
    },
    computed:{
        ...mapGetters([
            'getCalibrated',
            'getVerified',
            'getShowRequestModal',
        ]),
        
    },
    watch:{
        
    },
    created(){
        
    },
    mounted(){
        

    },
    methods:{
        ...mapActions([
            'setShowRequestModal'
        ]),
        // Take a measurement of calibration standards to check the calibration process
        measure(){
            this.rangeFreqRequest();
        }, 
        
      rangeFreqRequest(){
        //command structure: {"cmd":"crq","avg":1,"sparam":{"S11":true,"S12":false,"S21":false,"S22":false}}
        //only works for s11 parameter alone
        let params = {
            avg:Number(this.calibrationState.average),
            sparam:{s11:this.calibrationState.sparams.includes('s11'),s12:this.calibrationState.sparams.includes('s12'),s21:this.calibrationState.sparams.includes('s21'),s22:this.calibrationState.sparams.includes('s22')},
            what: this.port1
          }

          this.$store.dispatch('requestRangeAfterCal', params);
          this.$store.dispatch('setShowRequestModal', true);
      },
        updatePort1(connected){
            console.log("PORT 1 Connected");
            console.log(connected.type);
            if(connected.type){
                this.port1 = connected.type;
            } else{
                this.port1 = '';
            }
        },
        updatePort2(connected){
            console.log("PORT 2 Connected");
            console.log(connected.type);
            if(connected.type){
                this.port2 = connected.type;
            } else{
                this.port2 = '';
            }
            
        }


    }
}
</script>

<style>

</style>