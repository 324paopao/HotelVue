import { defineStore } from 'pinia'

/* export const useStore:any = defineStore('store', {
  state: () => ({
    accessToken:'',
    expiresIn:'',
    id:'',
    nickName:'',
    refreshToken:'',
    tokenType:'',
    userName:''
  }),
  persist: {
    storage: sessionStorage,
  },
},
    {
      persist: true,
    },
) */

export const useStore:any = defineStore('store', {
  state: () => {
    return {
      accessToken:'',
      expiresIn:'',
      id:'',
      nickName:'',
      refreshToken:'',
      tokenType:'',
      userName:''
    }
  },
  persist: true,
})