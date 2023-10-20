import { createStore } from 'vuex'
import streamStore from './modules/streamStore.js'
import dataStore from './modules/dataStore.js'
import uiStore from './modules/uiStore.js'
import commandStore from './modules/commandStore.js'

const store = createStore({
    modules:{
        stream: streamStore,
        data: dataStore,
        ui: uiStore,
        command: commandStore
    }
})

export default store;