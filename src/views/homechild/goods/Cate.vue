<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3,5,6,7,9]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
     <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return {
      // 查询到保存数据
      cateList:[],
      //查询条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 总数据条数
      total:0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      addCateDialogVisible:false,
      // 添加分类的表单数据对象
      addCateForm:{
        // 将要添加的分类的名称
        cat_name:'',
        // 父级分类的id
        cat_pid:0,
        // 分类的等级,默认一级分类
        cat_level:0
      },
      // 添加分类表单的验证规则
      addCateFormRules:{
       cat_name:[{
          required:true,message:'请输入分类的名称',trigger:'blur'
        }]
      },
      // 父级分类的列表
      parentCateList:[],
      // 级联选择器配置对象
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      // 选中的父级分类  
      selectedKeys:[]
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){
      const {data:res}=await this.$http.get('/categories',{params:this.queryInfo})
      if(res.meta.status!==200)return this.$Message.error('获取数据失败')
      // console.log(res.data);
      this.cateList=res.data.result
      this.total=res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange(newsize){
      // console.log(newpage);
      this.queryInfo.pagesize=newsize
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newpage){
      // console.log(newpage);
      this.queryInfo.pagenum=newpage
      this.getCateList()
    },
    showAddCateDialog(){
      this.getParentCateList()
      this.addCateDialogVisible=true
    },
    // 获取父级分类的数据列表
    async getParentCateList(){
      const {data:res}=await this.$http.get('/categories',{params:{type:2}})
      if(res.meta.status!==200)return this.$Message.error('获取父级分类数据失败')
      // console.log(res.data);
      this.parentCateList=res.data
    },
    // 选择项发生变化出发这个函数
    parentCateChanged(){
      // console.log(this.selectedKeys);如果selectedKeys大于0说明选中父级分类
      if(this.selectedKeys.length>0){
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
              // 为当前分类的等级赋值
         this.addCateForm.cat_level=this.selectedKeys.length
         return
      }else{
        this.addCateForm.cat_pid=0
        this.addCateForm.cat_level=0
      }
    },
    // 点击按钮添加新的分类
    addCate(){
      //  console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid=>{
      if(!valid) return
      const {data:res} =await this.$http.post('/categories',this.addCateForm)
      if(res.meta.status!==201)return this.$Message.error('添加分类失败')
      this.$Message.success('添加分类成功!')
      this.getCateList()
      this.addCateDialogVisible = false
    })
    },
    // 见他对话框关闭事件重置表单
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys=[]
      this.addCateForm.cat_pid=0
      this.addCateForm.cat_level=0
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>