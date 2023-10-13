//vue3 update

<template>

    <connect-and-display :url="url"/>

</template>

<script>
import axios from "axios";
import ConnectAndDisplay from './ConnectAndDisplay.vue';
import { mapGetters } from 'vuex';

export default {
	name: "DataStream",
	components:{
        ConnectAndDisplay,
	},
    data(){
        return{
			stream: Object,
        }
    },
	mounted(){
		// var _this = this;
		// var reconnect = function() {
		// 	console.log('reconnect running');
		// 	_this.getWebsocketConnection();
		// };
		//make second and subsequent connections
		document.addEventListener("streams:dropped", this.getWebsocketConnection);
	},
    computed:{
		...mapGetters({
			urlOK: 'getDataURLObtained',
			url: 'getDataURL',
		}),
		streamOK(){
			return this.$store.getters.getStream("data");
		},
		
	},
	watch:{
		streamOK: function(is) {
			if (is) {
				this.getWebsocketConnection();
			} else {
				console.log("no stream");
			}
		},
		urlOK(is) {
			if (is) {
				console.log("get dataURL", this.urlOK, this.url);
			}
		},

	},
	methods:{
		getWebsocketConnection(){
			this.stream = this.$store.getters.getStream("data");
			var accessURL = this.stream.url;
			var token = this.stream.token;
			let _this = this;
			this.$store.dispatch("deleteDataURL");		//NEWLY ADDED
			axios
			.post(accessURL, {}, { headers: { Authorization: token } })
			.then((response) => {
				_this.$store.dispatch("setDataURL", response.data.uri);
			})
			.catch((err) => console.log(err));
		}
	},
	
	
}


</script>

<style scoped>

</style>