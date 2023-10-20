<template>

<div id="app" class='container-fluid-sm m-0'>

  <navigation-bar />

  <streams id='streams' />

  <div class='row' id='component-grid'>

    <div :class='leftClass' id='left-screen'>
      <div class='col drop-area' id='drop_0_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><send-commands id='send-commands' :singleFrequencyAllowed="singleFrequencyAllowed" :rangeFrequencyAllowed="rangeFrequencyAllowed" :sparams="sparamsOn" :averagingAllowed="averagingAllowed"/></div>
      <div class='col drop-area' id='drop_1_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><graph-output id='graph' :sparams="sparamsOn"/></div>
      <div class='col drop-area' id='drop_2_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><download id='download' :sparams="sparamsOn"/></div>
      <div class='col drop-area' id='drop_3_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
      <div class='col drop-area' id='drop_4_0' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
    </div>

    <div :class='rightClass' id='right-screen'>
      <div class='col drop-area' id='drop_0_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent><data-stream id='data-stream'/></div>
      <div class='col drop-area' id='drop_1_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
      <div class='col drop-area' id='drop_2_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
      <div class='col drop-area' id='drop_3_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
      <div class='col drop-area' id='drop_4_1' :draggable='getDraggable' @dragstart="dragComponent" @drop='dropComponent' @dragover.prevent @dragenter.prevent></div>
    </div>

  </div>

</div>
  

</template>

<script>

import DataStream from './components/DataStream.vue'
import SendCommands from './components/SendCommands.vue'
import Streams from './components/Streams.vue'
import NavigationBar from './components/NavigationBar.vue'
import GraphOutput from './components/GraphOutput.vue';
import Download from './components/Download.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'App',
  components: {
    SendCommands,
    Streams,
    DataStream,
    NavigationBar,
    GraphOutput,
    Download,
  },
  data(){
    return {
      sparamsOn: ['s11'],   //list of the s parameters that are calculated
      singleFrequencyAllowed: false,
      rangeFrequencyAllowed: true,
      averagingAllowed: false,
      leftClass: 'col-lg-6',
      rightClass: 'col-lg-6' 
    }
  },
  computed:{
    ...mapGetters([
      'getDraggable',
      
    ]),
  },
  methods:{
    dragComponent(event){
        event.dataTransfer.effectAllowed = 'move';
         console.log(event.target.id);
         let element = event.target;
         if(element.classList.contains('drop-area')){
           console.log(element.id);
            event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
            console.log(element.childNodes[0]);
         } else{
           while(element.parentNode){
              element = element.parentNode;
              console.log(element.id);
              if(element.classList.contains('drop-area')){
                event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
                console.log(element.childNodes[0]);
                break;
              }
            }
         }
    },
    dropComponent(event){
      event.preventDefault();
      event.stopPropagation();
      let dropData = event.dataTransfer.getData('text/html');
      let dropItems = dropData.split("|");
      let draggedZone = document.getElementById(dropItems[0]);
      let droppedElement = document.getElementById(event.target.id);
      let draggedID = dropItems[1];
      
      if(droppedElement != null && droppedElement.classList.contains('drop-area')){
        if(event.target.childNodes.length > 0){
          draggedZone.appendChild(event.target.childNodes[0]);
        }
        console.log(draggedID);
        droppedElement.appendChild(document.getElementById(draggedID));
      } 
      else if(droppedElement){
        let element = droppedElement;
        while(element.parentNode){
          element = element.parentNode;
          if(element.classList.contains('drop-area')){
            console.log(element.childNodes[0]);
            draggedZone.appendChild(element.childNodes[0]);
            element.appendChild(document.getElementById(draggedID));
            
            break;
          }
        }
      }
      return false;
    },
    toggleLayout(ratio){
      if(ratio == 0.25){
        this.leftClass = 'col-lg-3';
        this.rightClass = 'col-lg-9';
      } else if(ratio == 0.5){
        this.leftClass = 'col-lg-6';
        this.rightClass = 'col-lg-6';
      } else if(ratio == 0.75){
         this.leftClass = 'col-lg-9';
        this.rightClass = 'col-lg-3';
      } else{
         this.leftClass = 'col-lg-12';
        this.rightClass = 'col-lg-12';
      }
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}

.drop-area {
    background-color: auto;
    margin: 5px;
    padding: 20px;
    border-style: dashed;
    border-radius:12px;
    border-width: 1px;
    border-color: rgba(0, 0, 255, 0.2);
  }


#left-screen{
  overflow: scroll;
  max-height: 100vh;
}

#right-screen{
  overflow: scroll;
  max-height: 100vh;
}

#modal-show{
  display: block;
  
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
