import {defineStore} from "pinia";

export const useUserInfoStore = defineStore('userInfo', {
    state:() => {
        return{
            user:{
                username: '',
                email: '',
                role: '',
                registerTime: null
            }
        }
    }
})