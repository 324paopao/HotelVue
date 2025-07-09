<!--
 * 基于 ECharts 的 Vue3 图表组件
 * 版权所有 © 2021-present 有来开源组织
 *
 * 开源协议：https://opensource.org/licenses/MIT
 * 项目地址：https://gitee.com/youlaiorg/vue3-element-admin
 * 参考：https://echarts.apache.org/handbook/zh/basics/import/#%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5-echarts-%E5%9B%BE%E8%A1%A8%E5%92%8C%E7%BB%84%E4%BB%B6
 *
 * 在使用时，请保留此注释，感谢您对开源的支持！
 -->

<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状、折线和饼图常用图表
import { BarChart, LineChart, PieChart } from "echarts/charts";
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

import { useResizeObserver } from "@vueuse/core";

// 按需注册组件
echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

const props = defineProps<{
  options: echarts.EChartsCoreOption;
  width?: string;
  height?: string;
}>();

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    try {
      chartInstance = echarts.init(chartRef.value);
      if (props.options) {
        // 确保所有选项都是有效的，避免undefined数据
        const safeOptions = validateOptions(props.options);
        chartInstance.setOption(safeOptions);
      }
    } catch (error) {
      console.error('初始化图表时出错:', error);
    }
  }
};

// 验证并修复选项中可能存在的问题
const validateOptions = (options: any) => {
  try {
    // 创建一个深拷贝，避免修改原始数据
    const safeOptions = JSON.parse(JSON.stringify(options));
    
    // 确保series是数组
    if (!Array.isArray(safeOptions.series)) {
      safeOptions.series = [];
    }
    
    // 确保每个系列的data都是数组
    safeOptions.series.forEach((series: any) => {
      if (!Array.isArray(series.data)) {
        series.data = [];
      }
    });
    
    // 确保xAxis.data是数组(如果存在)
    if (safeOptions.xAxis && !Array.isArray(safeOptions.xAxis.data)) {
      safeOptions.xAxis.data = [];
    }
    
    return safeOptions;
  } catch (error) {
    console.error('验证图表选项时出错:', error);
    // 返回一个最小化的有效选项
    return { 
      series: [] 
    };
  }
};

// 监听尺寸变化，自动调整
useResizeObserver(chartRef, () => {
  if (chartInstance) {
    try {
      chartInstance.resize();
    } catch (error) {
      console.error('调整图表大小时出错:', error);
    }
  }
});

// 监听 options 变化，更新图表
watch(
  () => props.options,
  (newOptions) => {
    if (chartInstance && newOptions) {
      try {
        // 同样验证新的选项
        const safeOptions = validateOptions(newOptions);
        chartInstance.setOption(safeOptions);
      } catch (error) {
        console.error('更新图表选项时出错:', error);
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    try {
      initChart();
    } catch (error) {
      console.error('挂载图表时出错:', error);
    }
  });
});

onBeforeUnmount(() => {
  if (chartInstance) {
    try {
      chartInstance.dispose();
    } catch (error) {
      console.error('销毁图表时出错:', error);
    }
  }
});
</script>
