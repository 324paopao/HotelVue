<!-- 菜单组件 -->
<template>
  <div>
    <h2>静态页面自定义菜单</h2>
    <el-col :span="24">
      <el-menu active-text-color="#ffd04b" background-color="#1e3a5f" class="el-menu-vertical-demo" default-active="2"
        text-color="#fff" router @open="handleOpen" @close="handleClose">
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <Location />
            </el-icon>
            <span>房态</span>
          </template>
          <el-menu-item index="/listroomtype">
            <el-icon>
              <IconMenu />
            </el-icon>
            <span>房态列表</span>
          </el-menu-item>
          <el-menu-item index="/ReserveRoomList">
            <el-icon>
              <Document />
            </el-icon>
            <span>预定</span>
          </el-menu-item>
          <el-menu-item index="/ReserverGetlist">
            <el-icon>
              <Setting />
            </el-icon>
            <span>预定列表 </span>
          </el-menu-item>

          <el-menu-item index="/ReserverDetails">
            <el-icon>
              <Setting />
            </el-icon>
            <span>预定详情 </span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <Location />
            </el-icon>
            <span>订单</span>
          </template>
          <el-menu-item index="/Orderlist">
            <el-icon>
              <Setting />
            </el-icon>
            <span>订房订单 </span>
          </el-menu-item>
          <el-menu-item index="/ReserveRoomList">
            <el-icon>
              <Document />
            </el-icon>
            <span>预定</span>
          </el-menu-item>
          <el-menu-item index="/ReserverGetlist">
            <el-icon>
              <Setting />
            </el-icon>
            <span>预定列表 </span>
          </el-menu-item>


        </el-sub-menu>
      </el-menu>
    </el-col>
  </div>
</template>

<script lang="ts" setup>
import { Document, Menu as IconMenu, Location, Setting } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const activeIndex = ref(route.path);

// 添加空函数实现以解决报错
const handleOpen = (key: string, keyPath: string[]) => {
  // 可选：添加实际需要的打开逻辑
  console.log('handleOpen', key, keyPath);
};

// 添加空函数实现以解决报错
const handleClose = (key: string, keyPath: string[]) => {
  // 可选：添加实际需要的关闭逻辑
  console.log('handleClose', key, keyPath);
};

watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = newPath;
  }
);

/* function handleSelect(index: string) {
  router.push(index);
} */
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
