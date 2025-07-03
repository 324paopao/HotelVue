import { ref } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore(
  "counter",
  () => {
    const userInfo = ref({
      userName: "",
      accessToken: "",
      id: 0,
      refreshToken: "",
      nickName:""
    });
    return { userInfo };
  },
  {
    persist: true,
  }
);