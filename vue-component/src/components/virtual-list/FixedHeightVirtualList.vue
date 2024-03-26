
<!-- 固定高度的虚拟列表 -->
<template>
  <div ref="list" class="infinite-list-container" @scroll="scrollEvent($event)">
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div ref="items"
        class="infinite-list-item" 
        v-for="item in visibleData" 
        :key="item.id"
        :style="{ height: itemSize + 'px',lineHeight: itemSize + 'px' }"
      >{{ item.value }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

interface Props {
  listData: any[],
  itemSize: number,
}
const props = defineProps<Props>()

const list = ref<HTMLElement>();

// 容器高度
const screenHeight = ref(0);

// 起始位置
const start = ref(0);

const end = ref(0);

// 列表总高度
const listHeight = computed(() => props.itemSize * props.listData.length);

// 可现实的列表项数
const visibleCount = computed(() => Math.ceil(screenHeight.value / props.itemSize));

// 实际渲染数据
const visibleData = computed(() => props.listData.slice(start.value, Math.min(end.value, props.listData.length)))

// 偏移量
const startOffset = ref(0)

const getTransform = computed(() => `translate3d(0,${startOffset.value}px,0)`)

onMounted(() => {
  screenHeight.value = list.value?.clientHeight || 0
  end.value = start.value + visibleCount.value
})


const scrollEvent = () => {
  // 当前滚动位置
  let scrollTop = list.value?.scrollTop;

  start.value = Math.floor(Number(scrollTop) / props.itemSize);

  end.value = start.value + visibleCount.value;

  // 偏移量
  startOffset.value = Number(scrollTop) - (Number(scrollTop) % props.itemSize)
}

</script>


<style scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>