import { defineStore } from "pinia";
import { apiStore } from "~/stores/apistore";
import { storeToRefs } from "pinia";
export const selected = defineStore({
  id:"selected",
  state:()=>{
    return {
      selectedServer:null
    }
  },
  actions:{
    async serverChoose(server){
      const store = apiStore()
      const {url} = storeToRefs(store)
      const apiUrl = `${url.value}/api/v1/tservers/${server.uuid}`
      const serverDetails = await $fetch(apiUrl)
      this.selectedServer = serverDetails
      // console.log(this.selectedServer,"store")
    }
  }
})