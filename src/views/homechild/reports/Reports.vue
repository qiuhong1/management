<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width:600px;height:400px"></div>
    </el-card>
  </div>
</template>

<script>
import _ from 'loadsh'
import * as echarts from 'echarts';
export default {
  data(){
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted(){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    
    // 获取数据
    const {data:res}=await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
        return this.$message.error('获取折线图数据失败！')
      }
    // 绘制图表
    const result=_.merge(res.data,this.options)
    myChart.setOption(result);
  }
}
</script>

<style>

</style>