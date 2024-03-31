import {defineStore} from "pinia";
import axios from "axios";
import defaultAvatar from "@/assets/image/defaultAvatar.png";


export const useUserInfoStore = defineStore('userInfo', {
    state:() => {
        return{
            user:{
                username: '',
                email: '',
                role: '',
                avatar: null,
                registerTime: null
            },
            isCollapse: true,
            isLoading:{
                avatarUpload: false
            }
        }
    },getters: {
        avatarUrl(){
            if (this.user.avatar){
                return `${axios.defaults.baseURL}/image${this.user.avatar}`
            } else{
                return defaultAvatar;
            }
        }
    }
})