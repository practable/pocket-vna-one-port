import { createWebHistory, createRouter } from 'vue-router';
import Calibration from '@/views/Calibration.vue';
import Verification from '@/views/Verification.vue';
import Measurement from '@/views/Measurement.vue';


const routes = [
    {
        path: '/',
        redirect: '/calibration'
    },
  {
    path: '/calibration',
    name: 'Calibration',
    component: Calibration
  },
  {
    path: '/verification',
    name: 'Verification',
    component: Verification
  },
  {
    path: '/measurement',
    name: 'Measurement',
    component: Measurement
  },

  
  

]

const router = createRouter({
    history: createWebHistory(),       
    routes,
})

export default router
