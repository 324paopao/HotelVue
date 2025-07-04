<!-- 菜单组件 -->
<template>
  <div>
    <!-- <h2>静态页面自定义菜单</h2> -->
    <el-col :span="24">
      <el-menu 
      :default-active="activeMenu" router background-color="#1e3a5f" text-color="#fff"
        active-text-color="#ffd04b" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <MenuItem v-for="item in menuList" :key="item.id || item.path" :item="item" :base-path="item.path || ''" />
      </el-menu>
    </el-col>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useMenuStore } from '@/store/modules/menu.store';
import MenuItem from './components/MenuItem.vue';
import { useRoute } from 'vue-router';

const menuStore = useMenuStore();
const menuList = computed(() => menuStore.menuList);
console.log('menuList:', menuList.value);
const route = useRoute();
const activeMenu = computed(() => route.path);

function handleOpen() { }
function handleClose() { }
</script>

<style scoped>
.custom-menu {
  width: 200px;
  background: #1e3a5f !important;
  /* 深蓝色背景 */
  color: #fff !important;
  /* 白色字体 */
  border: none;
}

.custom-menu .el-menu-item {
  background: #1e3a5f !important;
  color: #fff !important;
}

.custom-menu .el-menu-item.is-active {
  background: #1e3a5f !important;
  /* 选中时更亮一点的蓝色 */
  color: #fff !important;
}
</style>
