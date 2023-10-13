
<template>
    <div class='container-sm m-2 background-white border rounded'>
        <h4> 1 port Calibration and Measurement </h4>

    <div v-if='singleFrequencyAllowed' class='row mb-2'>
      <div class='col-12'>
        <div v-if='singleFrequencyAllowed' class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="singleRadio" value='single' id="singleRadio" v-model='mode' :disabled='!rangeFrequencyAllowed'>
          <label class="form-check-label" for="singleRadio">Single Frequency</label>
        </div>
        <div v-if='rangeFrequencyAllowed' class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="rangeRadio" value='range' id="rangeRadio" v-model='mode' :disabled='!singleFrequencyAllowed'>
          <label class="form-check-label" for="rangeRadio">Range of frequencies</label>
        </div>
      </div>
    </div>

    <div v-if='sparams.length > 1' class='row mb-2'>
      <div class='col-12'>
        <div v-if='sparams.includes("s11")' class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" name="flexCheckDefault" id="s11check" v-model='s11' :disabled='sparams.length == 1'>
          <label class="form-check-label" for="s11check">S11</label>
        </div>

        <div v-if='sparams.includes("s12")' class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" name="flexCheckDefault" id="s12check" v-model='s12'>
          <label class="form-check-label" for="s12check">S12</label>
        </div>

        <div v-if='sparams.includes("s21")' class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" name="flexCheckDefault" id="s21check" v-model='s21'>
          <label class="form-check-label" for="s21check">S21</label>
        </div>

         <div v-if='sparams.includes("s22")' class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" name="flexCheckDefault" id="s22check" v-model='s22'>
          <label class="form-check-label" for="s22check">S22</label>
        </div>
        
      </div>
    </div>

    <div v-if='averagingAllowed' class='row mb-2' @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
      <div class='col-12'>
        <div class='input-group'>
          <div class='col-3'>
            <span for="averageRange" class="input-group-text me-4">Average</span>
          </div>
          <div class='col-6'>
            <input type="range" class="form-range" min="1" max="10" step="1" id="averageRange" v-model='avgCounts'>
          </div>
          <div class='col-2'>
            <span class='input-group-text ms-4'>{{avgCounts}}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if='mode == "range"' class='row p-3' @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
      <div class='col-12'>
        <div class='input-group'>
          <div class='col-lg-3'>
            <span for="sizeRange" class="input-group-text me-4 text-wrap">Frequency points</span>
          </div>
          <div class='col-lg-7'>
            <input type="range" class="form-range" min="2" max="501" step="1" id="sizeRange" v-model='size' @change='setCalibrated(false)'>
          </div>
          <div class='col-lg-2'>
            <span class='input-group-text ms-4'>{{size}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-if='mode == "range"' class='row mb-2'>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" name="flexCheckDefault" id="isLogcheck" v-model='islog' :disabled='getCalibrated'>
        <label class="form-check-label" for="flexCheckDefault">
            Logarithmic
        </label>
      </div>
    </div> -->

    
    <div class='row p-3'>
      <div class='col-lg-10'>
        <!-- CALIBRATION COMMANDS-->
        <div v-if='mode == "single"' class="input-group" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
          <span class="input-group-text" id="basic-addon1">Frequency</span>
          <input type="number" :class="(parseFloat(frequency) >= 0 && parseFloat(frequency) < maxFrequency) ? 'form-control' : 'form-control is-invalid'" :min='minFrequency' :max='maxFrequency' placeholder="frequency" aria-label="freq" aria-describedby="basic-addon1" id="freq" v-model="frequency">
          <span class="input-group-text" id="basic-addon1">MHz</span>
          <button id="request" type='button' class="btn btn-success btn-lg" @click="singleFreqCommand">Request</button>
        </div>

        <div v-else class="input-group" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
          <span class="input-group-text" id="basic-addon1">Start</span>
          <input type="number" :class="(parseFloat(frequency) >= 0 && parseFloat(frequency) < maxFrequency) ? 'form-control' : 'form-control is-invalid'" :min='minFrequency' :max='maxFrequency' placeholder="Start frequency" aria-label="freq" aria-describedby="basic-addon1" id="freq" v-model="frequency" @change="setCalibrated(false)">
          <span class="input-group-text" id="basic-addon1">MHz</span>
          <span class="input-group-text" id="basic-addon1">End</span>
          <input type="number" :class="(parseFloat(frequency_end) >= 0 && parseFloat(frequency_end) <= maxFrequency && parseFloat(frequency_end) > frequency) ? 'form-control' : 'form-control is-invalid'" :min='minFrequency' :max='maxFrequency' placeholder="End frequency" aria-label="freq" aria-describedby="basic-addon1" id="freq_end" v-model="frequency_end" @change="setCalibrated(false)">     
          <span class="input-group-text" id="basic-addon1">MHz</span>
          
        </div>
      </div>

      <div class='col-lg-2'>
          <button id="request_calibration" type='button' class="btn btn-success btn-lg" @click="rangeFreqCalibration">Calibrate</button>
      </div>
    </div>

    


    <div class='row p-3'>
      <div class='col-lg-10'>

         <!-- MEASUREMENT COMMANDS-->
        <div v-if='mode == "single"' class="input-group mb-2" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
          <span class="input-group-text" id="basic-addon1">Frequency</span>
          <input type="number" :class="(parseFloat(frequency) >= 0 && parseFloat(frequency) < maxFrequency) ? 'form-control' : 'form-control is-invalid'" :min='minFrequency' :max='maxFrequency' placeholder="frequency" aria-label="freq" aria-describedby="basic-addon1" id="freq" v-model="frequency">
          <span class="input-group-text" id="basic-addon1">MHz</span>
          <button id="request" type='button' class="btn btn-success btn-lg" @click="singleFreqCommand">Request</button>
        </div>

        <div v-else class="d-flex input-group mb-2" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
          <span class="input-group-text" id="basic-addon1">Start</span>
          <input type="number" :class="(parseFloat(frequency) >= 0 && parseFloat(frequency) < maxFrequency) ? 'form-control' : 'form-control is-invalid'" :min='minFrequency' :max='maxFrequency' placeholder="Start frequency" aria-label="freq" aria-describedby="basic-addon1" id="freq" :value="frequency" disabled>
          <span class="input-group-text" id="basic-addon1">MHz</span>
          <span class="input-group-text" id="basic-addon1">End</span>
          <input type="number" :class="(parseFloat(frequency_end) >= 0 && parseFloat(frequency_end) <= maxFrequency && parseFloat(frequency_end) > frequency) ? 'form-control' : 'form-control is-invalid'" :min='minFrequency' :max='maxFrequency' placeholder="End frequency" aria-label="freq" aria-describedby="basic-addon1" id="freq_end" :value="frequency_end" disabled>     
          <span class="input-group-text" id="basic-addon1">MHz</span>
        </div>

        <!-- WHAT IS BEING MEASURED-->
        <div class='row mb-2'>
          <div class='col-12 d-flex justify-content-end'>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="dutRadio" value='dut' id="dutRadio" v-model='what'>
              <label class="form-check-label" for="dutRadio">DUT</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="shortRadio" value='short' id="shortRadio" v-model='what'>
              <label class="form-check-label" for="shortRadio">Short</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="openRadio" value='open' id="openRadio" v-model='what'>
              <label class="form-check-label" for="openRadio">Open</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="loadRadio" value='load' id="loadRadio" v-model='what'>
              <label class="form-check-label" for="loadRadio">Load</label>
            </div>
          </div>
        </div>
    </div>

      <div class='d-flex col-lg-2'>
        <button id="request_results" type='button' class="btn btn-success btn-lg" @click="rangeFreqRequest" :disabled='!getCalibrated'>Measure</button>
      </div>

  </div>


    <transition name='fade'>
      <div v-if='getShowCalibrationModal' class="modal" id='modal-show' tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header" style="background-color: #ccc">
              <h5 class="modal-title">Calibrating Pocket VNA</h5>
              <!-- <button type="button" class="btn btn-close" aria-label="Close" @click='showLoadDataModal = false'>
                
              </button> -->
            </div>
            <div class="modal-body">
              <div class='d-flex row align-items-center'>
                <div class='col-2'>
                  <div class="spinner-border text-primary text-center" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div class='col-10'>
                  <p> Please wait for the pocket VNA to calibrate.</p>
                  <p>This could take around 30 seconds.</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" @click="setShowCalibrationModal(false)">Close</button>
            </div>
          </div>
        </div>
      </div>
      </transition>

      <transition name='fade'>
      <div v-if='getShowRequestModal' class="modal" id='modal-show' tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header" style="background-color: #ccc">
              <h5 class="modal-title">Requesting measurements from Pocket VNA</h5>
              <!-- <button type="button" class="btn btn-close" aria-label="Close" @click='showLoadDataModal = false'>
                
              </button> -->
            </div>
            <div class="modal-body">
              <div class='d-flex row align-items-center'>
                <div class='col-2'>
                  <div class="spinner-border text-primary text-center" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                <div class='col-10'>
                  <p> Please wait for the pocket VNA to send data.</p>
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
</template>

<script>
import dayjs from "dayjs";
import { mapActions, mapGetters } from 'vuex';

export default {

  name: 'SendCommands',
  props:['singleFrequencyAllowed', 'rangeFrequencyAllowed', 'sparams', 'averagingAllowed'],
  data () {
    return {
        mode: 'range',  // or 'range'
        frequency: 1.0,   //MHz
        frequency_end: 4.0, //MHz
        minFrequency: 0,
        maxFrequency: 4000.0, //MHz
        units: 1E6,
        s11: true,
        s12: false,
        s21: false,
        s22: false,
        avgCounts: 1,
        size: 20,
        islog: false,
        what: 'dut', //'short', 'load', 'open'

        showCancel: false,  //should the cancel button show on the modals

    }
  },
  components: {
    
  },
  computed:{
      ...mapGetters([
        'getCalibrated',
        'getShowCalibrationModal',
        'getShowRequestModal'
      ])
  },
  watch:{
      
  },
  created(){
      if(this.singleFrequencyAllowed && !this.rangeFrequencyAllowed){
        this.mode = 'single';
      } else if(!this.singleFrequencyAllowed && this.rangeFrequencyAllowed){
        this.mode = 'range';
      } else{
        this.mode = 'single';
      }
  },
  mounted(){
      

  },
  methods: {
    ...mapActions([
      'setDraggable',
      'setCalibrated',
      'setShowCalibrationModal',
      'setShowRequestModal'
    ]),
      singleFreqCommand(){
          //command structure: {"id":"945102d5-94e4-448e-bbbf-48384c662711","t":1634664795,"cmd":"sq","freq":100000,"avg":1,"sparam":{"S11":true,"S12":false,"S21":true,"S22":false}}
          if(this.frequency < this.minFrequency){
            this.frequency = this.minFrequency;
          } else if(this.frequency > this.maxFrequency){
            this.frequency = this.maxFrequency;
          }
          
          let params = {
            id:'',
            t:dayjs().unix(),
            freq:this.frequency*this.units,
            avg:this.avgCounts,
            sparam:{s11:this.s11,s12:this.s12,s21:this.s21,s22:this.s22}
          }
          this.$store.dispatch('requestSingle', params);
      },
      rangeFreqCommand(){
        //command structure: {"cmd":"rq","range":{"Start":100000,"End":4000000},"size":2,"isLog":true,"avg":1,"sparam":{"S11":true,"S12":false,"S21":true,"S22":false}}
        if(this.frequency < this.minFrequency){
            this.frequency = this.minFrequency;
          } else if(this.frequency > this.maxFrequency){
            this.frequency = this.maxFrequency - 1;
          }

          if(this.frequency_end < this.frequency){
            this.frequency_end = this.frequency + 1;
          } else if(this.frequency_end > this.maxFrequency){
            this.frequency_end = this.maxFrequency;
          }
        
        let params = {
            id:'',
            t:dayjs().unix(),
            range:{start: this.frequency*this.units, end: this.frequency_end*this.units},
            size: Number(this.size),
            islog: this.islog,
            avg:Number(this.avgCounts),
            sparam:{s11:this.s11,s12:this.s12,s21:this.s21,s22:this.s22}
          }

          this.$store.dispatch('requestRange', params);
      },
      rangeFreqCalibration(){
        //command structure: {"cmd":"rc","range":{"Start":100000,"End":4000000},"size":2,"isLog":true,"avg":1,"sparam":{"S11":true,"S12":false,"S21":true,"S22":false}}
        if(this.frequency < this.minFrequency){
            this.frequency = this.minFrequency;
          } else if(this.frequency > this.maxFrequency){
            this.frequency = this.maxFrequency - 1;
          }

          if(this.frequency_end < this.frequency){
            this.frequency_end = this.frequency + 1;
          } else if(this.frequency_end > this.maxFrequency){
            this.frequency_end = this.maxFrequency;
          }

        
        let params = {
            id:'',
            t:dayjs().unix(),
            range:{start: this.frequency*this.units, end: this.frequency_end*this.units},
            size: Number(this.size),
            islog: this.islog,
            avg:Number(this.avgCounts),
            sparam:{s11:this.s11,s12:this.s12,s21:this.s21,s22:this.s22}
          }

          this.$store.dispatch('requestCalibration', params);
          this.$store.dispatch('setShowCalibrationModal', true);
          
      },
      rangeFreqRequest(){
        //command structure: {"cmd":"crq","avg":1,"sparam":{"S11":true,"S12":false,"S21":false,"S22":false}}
        //only works for s11 parameter alone
        let params = {
            avg:Number(this.avgCounts),
            sparam:{s11:this.s11,s12:this.s12,s21:this.s21,s22:this.s22},
            what: this.what
          }

          this.$store.dispatch('requestRangeAfterCal', params);
          this.$store.dispatch('setShowRequestModal', true);
      },
      toggleCalibrationMessage(){
        this.showCalibrationMessage = !this.showCalibrationMessage;
      },
     
      
  }
}
</script>

<style scoped>
input[type=number]{
  min-width: 200px;
}

</style>