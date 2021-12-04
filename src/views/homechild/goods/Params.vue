<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
     <el-alert
        title="注意:只允许第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <el-row class="rows">
        <span>选择商品分类: </span>
        <el-cascader expand-trigger="hover" :options="cateList" :props="cateProps" v-model="selectedCateKeys" @change="handleChanged"></el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handelTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="ischoose" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                :key="index"
                v-for="(item,index) in scope.row.attr_vals"
                closable @close="handleClose(index,scope.row)">
                {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="ischoose" @click="addDialogVisible = true">添加属性</el-button>
            <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
                <template slot-scope="scope">
                <el-tag
                :key="index"
                v-for="(item,index) in scope.row.attr_vals"
                closable @close="handleClose(index,scope.row)">
                {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态或静态属性 -->
    <el-dialog
      :title="'添加'+this.titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改属性 -->
    <el-dialog
      :title="'修改'+this.titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      // 存储商品分类列表
      cateList:[],
      // 级联选择框配置对象
      cateProps:{
        value:'cat_id',
        children:'children',
        label:'cat_name'
      },
      // 级联选择器双向绑定的数组
      selectedCateKeys:[],
      // 被激活的页签的名称
      activeName:'many',
      // 储存dong态属性
      manyTableData:[],
      // 储存静态属性
      onlyTableData:[],
      addDialogVisible:false,
      // 表单数据
      addForm:{
        attr_name:''
      },
      addFormRules:{
        attr_name:[{
          required:true,message:"请输入参数名称",trigger:'blur'
        }]
      },
      editDialogVisible:false,
      // 修改的表单对象
      editForm:{},
      editFormRules:{
        attr_name:[{
          required:true,message:"请输入参数名称",trigger:'blur'
        }]
      },
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){
      const {data:res}=await this.$http.get('/categories')
      // console.log(res.data);
        if(res.meta.status!==200)return this.$Message.error('获取商品分类失败')
        this.cateList=res.data
    },
    handleChanged(){
     this.getParamsData()
    },
    async getParamsData(){
      if(this.selectedCateKeys.length!==3){
        this.selectedCateKeys=[]
        this.manyTableData=[]
        this.onlyTableData=[]
        return
      }else{
        // 根据级联选择器选的请求数据
        const {data:res}=await this.$http.get('categories/'+ this.cateId +'/attributes',{params:{sel:this.activeName}})
        if(res.meta.status!==200)return this.$Message.error('获取参数列表失败')
        // console.log(res.data);
        res.data.forEach(item => {
          // 控制文本框的显示与隐藏
          item.inputVisible=false
          // 文本框输入的值
          item.inputValue=''
          if(item.attr_vals!==''){
            item.attr_vals=item.attr_vals.split(' ')
          }else{
            item.attr_vals=[]
          }
        });
        if(this.activeName==='many'){
          this.manyTableData=res.data
        }else{
          this.onlyTableData=res.data
        }
      }
    },
    // tab点击事件触发
    handelTabClick(){
       this.getParamsData()
    },
    addDialogClosed(){
        this.$refs.addFormRef.resetFields()
    },
    addParams(){
      this.$refs.addFormRef.validate(async valid=>{
        // console.log(valid);
        if(valid){
          const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name:this.addForm.attr_name,
            attr_sel:this.activeName,
          })
          if(res.meta.status!==201)return this.$Message.error('添加参数失败')
          this.$Message.success('添加参数成功')
            this.addDialogVisible = false
            this.getParamsData()
        }
      })
    },
    // 点击按钮展示修改的对话框
    async showEditDialog(attr_id){
     const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
        params:{
         attr_sel:this.activeName 
        }
      })
    if(res.meta.status!==200)return this.$Message.error('获取参数信息失败')
    this.editForm=res.data
      this.editDialogVisible = true
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定按钮修改参数信息
    editParams(){
     this.$refs.editFormRef.validate(async valid=>{
      //  console.log(valid);
      if(valid){
        const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
          attr_name:this.editForm.attr_name,attr_sel:this.activeName
        })
      if(res.meta.status!==200)return this.$Message.error('修改参数失败')
      this.$Message.success('修改参数成功')
      this.getParamsData()
      this.editDialogVisible=false
      }
     })
    },
    // 根据id删除属性
    removeParams(attr_id){
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
          if(res.meta.status!==200)return this.$Message.error('删除参数失败')
          this.getParamsData()
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
    // 文本框失去焦点或回车触发此函数
    async handleInputConfirm(row){
      // 输入内容为空格的时候的处理
      if(row.inputValue.trim().length===0){
        row.inputValue=''
        row.inputVisible=false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue=''
      row.inputVisible=false
      // 发起请求保存这次操作
      const { data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_vals:row.attr_vals.join(' '),
        attr_sel:row.attr_sel,
      })
      if(res.meta.status!==200)return this.$Message.error('修改参数失败')
      this.$Message.success('修改参数成功')
    },
      // 点击按钮展示文本框
    showInput(row){
      row.inputVisible=true
      // 让文本框自动获取焦点
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
    },
    async handleClose(index,row){
      row.attr_vals.splice(index,1)
      const { data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_vals:row.attr_vals.join(' '),
        attr_sel:row.attr_sel,
      })
      if(res.meta.status!==200)return this.$Message.error('修改参数失败')
      this.$Message.success('修改参数成功')
    }
  },
  computed:{
    ischoose(){
      return this.selectedCateKeys.length!==3
    },
      // 获取当前分类的id
    cateId(){
      if(this.selectedCateKeys.length==3){
        return this.selectedCateKeys[2]
      } 
      return null
    },
    titleText(){
      if(this.activeName==='many'){
        return '动态参数'
      }
      return '静态参数'
    }
  },

}
</script>

<style lang="less" scoped>
.rows{
  margin-top: 15px;
}
.el-tag{
  margin: 0 10px;
}
.input-new-tag{
  width: 120px;
}
</style>