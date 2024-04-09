import {defineStore} from "pinia";
import axios from "axios";
import defaultAvatar from "@/assets/image/defaultAvatar.png";


export const useUserInfoStore = defineStore('userInfo', {
    state:() => {
        return{
            user:{
                username: '',
                name: '',
                email: '',
                role: '',
                avatar: null,
                registerTime: null
            },
            isCollapse: true,
            isLoading:{
                avatarUpload: false
            },
            student:{
                studentList: [],
                learningDoneRate: [],
                dormitoryDoneRate: [],
                dormitoryEnum: {"n1":"北一","s1":"南一"}
            },
            task:{
                types:[],
                selectedType: [],
                taskList: []
            }
        }
    },getters: {
        avatarUrl(){
            if (this.user.avatar){
                return `${axios.defaults.baseURL}/image${this.user.avatar}`
            } else{
                return defaultAvatar;
            }
        },
    }, actions: {
        findTypeById(id){
            for (let type of this.task.types){
                if (type.id === id)
                    return type;
            }
        }
    }
})