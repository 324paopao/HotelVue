<template>
  <div style="margin-bottom: 8px;">
    <span style="font-weight: bold;">{{ node.permissionName }}</span>
    <div v-if="node.children && node.children.length" style="margin-left: 20px;">
      <PermissionNode v-for="(child, idx) in node.children" :key="idx" :node="child" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{ node: any }>()
</script>