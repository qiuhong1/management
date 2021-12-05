<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
     <el-row :gutter="20">
       <el-col :span="6">
        <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getGoodsList">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
       </el-col>
       <el-col :span="3"><el-button type="primary" @click="goAddPage">添加商品</el-button></el-col>
     </el-row>
     <!-- 表格 -->
    <el-table :data="goodsList" style="width: 100%" border stripe>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        width="95px">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量" width="95px">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间" width="150px">
        <template slot-scope="scope">
          {{scope.row.add_time | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="130px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteGoods(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return {
      // 查询参数
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10,
      },
      // 数据总条数
      total:0,
      // 商品列表
      goodsList:[],
    }
  },
  created(){
    this.getGoodsList()
  },
  methods:{
    async getGoodsList(){
      const {data:res}=await this.$http.get('goods',{params:this.queryInfo})
      if(res.meta.status!==200)return this.$Message.error('获取参数失败')
      // this.$Message.success('获取参数成功')
      this.total=res.data.total
      this.goodsList=res.data.goods
      // console.log(res.data);
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getGoodsList()
    },
    handleCurrentChange(newNum){
      this.queryInfo.pagenum=newNum
      this.getGoodsList()
    },
    // 删除商品
    deleteGoods(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res}=await this.$http.delete(`goods/${id}`)
         if(res.meta.status!==200)return this.$Message.error('删除商品失败')
          this.getGoodsList()
          this.$Message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$Message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 添加商品
    goAddPage(){
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style>

</style>