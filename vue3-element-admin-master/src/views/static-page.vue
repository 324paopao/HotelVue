<template>
  <div class="static-page-container">
    <h1>欢迎来到静态页面！</h1>
    <p>这里是一个示例静态页面，登录后会跳转到这里。</p>
  </div>
</template>

<script setup lang="ts">
// 静态页面无需任何逻辑
</script>

<style scoped>
.static-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  font-size: 1.5rem;
}
</style>