<template>
  <div id="app1">
    <VirtualList :list-data="data" :item-size="100" />
  </div>
</template>

<script setup lang="ts">
import VirtualList from '@/components/virtual-list/VirtualList.vue';
import { ref } from 'vue';
const data = ref<any>([]);

for(let i = 0; i < 10000; i++) {
  data.value.push({ id: i, value: i });
}
</script>

<style scoped>
html{
  height: 100%;
}
body{
  height: 100%;
  margin:0;
}
#app1{
  height:100%;
}
</style>