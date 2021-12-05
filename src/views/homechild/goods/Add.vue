<template>
  <div>
     <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品提示信息"
        type="info"
        show-icon
        center :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
           <el-tab-pane label="商品信息" name="0">
             <el-form-item label="商品名称" prop="goods_name">
               <el-input v-model="addForm.goods_name"></el-input>
             </el-form-item>
             <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label='商品分类' prop="goods_cat">
                <el-cascader
                 v-model="addForm.goods_cat"
                 :options="cateList"
                 :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id'}"
                 @change="handleChange">
                 </el-cascader>
              </el-form-item>
           </el-tab-pane>
           <el-tab-pane label="商品参数" name="1">
             <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox border :label="a" v-for="(a,index) in item.attr_vals" :key="index"></el-checkbox>
                </el-checkbox-group>
             </el-form-item>
           </el-tab-pane>
           <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
             </el-form-item>
           </el-tab-pane>
           <el-tab-pane label="商品图片" name="3">
              <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
           </el-tab-pane>
           <el-tab-pane label="商品内容" name="4">
               <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"/>
               <el-button type="primary" @click="add">添加商品</el-button>
                          <!-- :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)" -->
           </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%">
        <img :src="previewPath" alt="" class="imgs">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {Deepclone} from '../../../assets/css/Deepclone'
export default {
  data(){
    return {
      activeIndex:'0',
      // 添加商品的表单数据对象
      addForm:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        // 商品所属的分类数组
        goods_cat:[],
        // 上传图片的数组
        pics:[],
        // 商品的详情描述
        goods_introduce:'',
        attrs:[]

      },
      // 表单验证规则
      addFormRules:{
        goods_name:[{
          required:true,message:"请输入商品名称",trigger:"blur"
        }],
        goods_price:[{
          required:true,message:"请输入商品价格",trigger:"blur"
        }],
        goods_weight:[{
          required:true,message:"请输入商品重量",trigger:"blur"
        }],
        goods_number:[{
          required:true,message:"请输入商品数量",trigger:"blur"
        }],
        goods_cat:[{
          required:true,message:"请选择商品分类",trigger:"blur"
        }]
      },
      // 保存分类数据
      cateList:[],
      // 保存动态参数列表
      manyTableData:[],
      onlyTableData:[],
      // 图片上传组建的headers请求头对象
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 预览图片的url
      previewPath:'',
      previewVisible:false,
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){
      const {data:res}=await this.$http.get('categories')
      if(res.meta.status!==200)return this.$Message.error('获取商品分类失败')
      this.cateList=res.data
    },
    handleChange(){
      //  console.log(this.addForm.goods_cat);
      if(this.addForm.goods_cat.length===3)return
      this.addForm.goods_cat=[]
    },
    beforeTabLeave(activeIndex,oldactiveIndex){
      if(oldactiveIndex==='0'&&this.addForm.goods_cat.length !== 3){
        this.$Message.error('请先选择商品分类')
        return false
      }
      return true
    },
    async tabClicked(){
      // console.log(this.activeIndex);
      if(this.activeIndex=='1'){
        const {data:res}=await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{
          params:{
              sel:'many'
          }
        })
      if(res.meta.status!==200)return this.$Message.error('获取动态参数列表失败')
      res.data.forEach(item => {
        item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(' ')
      });
      this.manyTableData=res.data

      }else if(this.activeIndex=='2'){
        const {data:res}=await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{
          params:{
              sel:'only'
          }
        })
      if(res.meta.status!==200)return this.$Message.error('获取静态参数列表失败')
      // console.log(res.data);
      this.onlyTableData=res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file){
      // console.log(file);
      this.previewPath=file.response.data.url
      this.previewVisible=true
    },
    // 处理移除图片的操作
    handleRemove(file){
      // console.log(file);
      const filePath=file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      // console.log(this.addForm)
    },
    // 图片上传成功的操作
    handleSuccess(response){
      // console.log(response);
      const picsInfo={
        pic:response.data.tmp_path
      }
      this.addForm.pics.push(picsInfo)
      // console.log(this.addForm);
    },
    // 添加商品
    add(){
      // console.log(this.addForm);
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid)return this.$Message.error('请填写必要的表单项')
        let newAddForm={}
         newAddForm=Deepclone(newAddForm,this.addForm)
        //  console.log(newAddForm);
        newAddForm.goods_cat=newAddForm.goods_cat.join(',')
        // 处理动态属性
        this.manyTableData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理jing态属性
        this.onlyTableData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        newAddForm.attrs=this.addForm.attrs
        console.log(newAddForm);
        const {data:res}=await this.$http.post('goods',newAddForm)
        if(res.meta.status!==201)return this.$Message.error('添加商品失败!')
        this.$Message.success('添加商品成功')
        this.$router.push('/goods')
        console.log(res);
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox{
  margin: 0 10px 0 0!important;
}
.imgs{
  width: 100%;
}
</style>