<template>
  <div class='container-fluid m-2'>
  <!-- Possible measurements -->
  <h4 class='txt-primary'>{{header}}</h4>
  <div class='d-flex flex-row justify-content-center'>
      <div v-for='image in display' :key='image.type' class='col-md-3'>
          <div class='dragbox' @dragstart="dragImage(image)" @dragover.prevent @dragenter.prevent @touchstart="dragImage(image); dropPort1()">
              <!-- <img class='dragbox-image' :id='image.type' :src='require(`/images/${image.img}.png`)' :alt='image.type' :hidden='port1 == image || port2 == image'> -->
              <img class='dragbox-image' :id='image.type' :src='"/images/" + image.img + ".png"' :alt='image.type' :hidden='port1 == image || port2 == image'>
          
            </div>
          <figcaption class='txt-primary fig'>{{ image.type }}</figcaption>
      </div>
      
  </div>


    <!-- Pocket VNA and ports -->
  <div class='row'>

      <div v-if="port1 == ''" class='col-sm-12 pvna' @dragstart="removePort1" @dragover.prevent @dragenter.prevent @touchstart="removePort1">
        <img class='pvna-img' id='pvna-image' src='/images/DUT-disconnected.png' alt='pocket-vna'>

        <div v-if='getSParams.length > 1' class='dropbox mb-2' id='port2' @drop='dropPort2' @dragstart='removePort2'>
            <!-- <img v-if='port2 != ""' class='dropbox-image' :id='port2.type' :src='require(`/images/${port2.img}.png`)' :alt='port2.type'> -->
            <img v-if='port2 != ""' class='dropbox-image' :id='port2.type' :src='"/images/" + port2.img + ".png"' :alt='port2.type'>
        </div>

        <div class='dropbox' id='port1' @drop='dropPort1' @dragstart='removePort1'>
            <!-- <img v-if='port1 != ""' class='dropbox-image' :id='port1.type' :src='require(`/images/${port1.img}.png`)' :alt='port1.type'> -->
            <img v-if='port1 != ""' class='dropbox-image' :id='port1.type' :src='"/images/" + port1.img + ".png"' :alt='port1.type'>
        </div>
      </div>

      <div v-else-if="port1.type == 'dut'" class='col-sm-12 pvna' @mousedown='removePort1' @touchstart="removePort1">
        <img class='pvna-img' id='pvna-connected-dut-image' src='/images/PVNA-connected-state-dut.png' alt='pocket-vna-connected'>
      </div>

      <div v-else class='col-sm-12 pvna' @mousedown='removePort1' @touchstart="removePort1">
        <img class='pvna-img' id='pvna-connected-cal-image' src='/images/PVNA-connected-state-cal.png' alt='pocket-vna-connected'>
      </div>

      <!-- <div v-if="port1 == ''" class='col-sm-6 mt-1 pt-2'>
          <div :class='getSParams.length > 1 ? "dropbox mb-2" : "dropbox-hidden mb-2"' id='port2' @drop='dropPort2' @dragstart='removePort2'>
            <img v-if='port2 != ""' class='dropbox-image' :id='port2.type' :src='require(`../../public/images/${port2.img}.png`)' :alt='port2.type'>
        </div>
        <div class='dropbox' id='port1' @drop='dropPort1' @dragstart='removePort1'>
            <img v-if='port1 != ""' class='dropbox-image' :id='port1.type' :src='require(`../../public/images/${port1.img}.png`)' :alt='port1.type'>
        </div>
      </div> -->
  </div>

</div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'DragAndDropComponents',
    props: ['header', 'display'],
    emit:['port1change', 'port2change'],
    data () {
        return {
            selected: '',
            port1: '',
            port2: ''
        }
    },
    components: {
        
    },
    computed:{
        ...mapGetters([
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
        ...mapActions([
            'setDraggable',
            
        ]),
        dragImage(img){
            this.selected = img;
        },
        dropPort1(){
            this.port1 = this.selected;
            this.$emit('port1change', this.port1);
        },
        removePort1(){
            this.port1 = '';
            this.$emit('port1change', '');
        },
        dropPort2(){
            this.port2 = this.selected;
            this.$emit('port2change', this.port2);
        },
        removePort2(){
            this.port2 = '';
            this.$emit('port1change', '');
        },
        dragTest(event){
            event.dataTransfer.effectAllowed = 'move';
            
            let element = event.target;
            if(element.classList.contains('drop-area')){
            console.log(element.id);
                event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
                
            } else{
            while(element.parentNode){
                element = element.parentNode;
                console.log(element.id);
                if(element.classList.contains('drop-area')){
                    event.dataTransfer.setData("text/html", element.id + "|" + element.childNodes[0].id);
                    break;
                }
                }
            }
        },

        dropTest(event){
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
        }


    }
}
</script>

<style>

.dragbox{
    background-color: rgba(159, 159, 159, 0.75);
    border:2px dashed grey;
    width: 7.5vw;
    height:7.5vw;
}

.dragbox-image{
    max-height: 100%;
    max-width: 100%;
}

.dropbox{
    position: absolute;
    z-index: 10;
    background-color: rgba(159, 159, 159, 0.2);
    border:2px dashed grey;
    width: 5vw;
    height:5vw;
}

#port1{
    top: 57%;
    left: 65%;
}

#port2{
    top: 22%;
    left: 65%;
}

.dropbox-hidden{
    background-color: black;
    width: 5vw;
    height:5vw;
}

.dropbox-image{
    max-height: 100%;
    max-width: 100%;
}

.fig{
    width: 7.5vw;
}

.pvna{
    position:relative;
}

#pvna-image{
    max-width: 100%;
    max-height:100%;
    /*transform: rotate(-90deg);*/
}

#pvna-connected-cal-image{
    max-width: 100%;
    max-height:100%;
    /*transform: rotate(-90deg);*/
}

#pvna-connected-dut-image{
    max-width: 100%;
    max-height:100%;
    /*transform: rotate(-90deg);*/
}

</style>