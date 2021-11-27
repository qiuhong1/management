<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
       <el-row :gutter="20">
         <el-col :span="8">
            <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          </el-col>
       </el-row>
    </el-card>
    <el-table
      :data="userList"
      border
      stripe
      style="width: 100%">
      <el-table-column
      type="index">       
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="role_name"
        label="角色">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态">
       <template slot-scope="scope">
          <!-- {{scope.row}} -->
        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
       </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
        <!-- <template> -->
          <el-tooltip placement="top" content="分配角色" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" @click="editUsers(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="分配角色" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip placement="top" content="分配角色" :enterable="false">
            <el-button type="warning" icon="el-icon-setting"></el-button>
          </el-tooltip>
       </template>
      </el-table-column>
    </el-table>
    <!-- 分页效果 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 3, 4, 5]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose">
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
       <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
       <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
          {{editForm}}
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>          
import {getUserList,userStateChange,addUsers,queryID,editUser} from '../../network/index'
export default {
  data(){
    //自定义校验规则  验证邮箱的校验规则
    var checkEmail=(rule,value,callback)=>{
      // 验证邮箱的正则
      const regEmail =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)){
        return callback()
      }else{
        callback(new Error('请输入合法的邮箱'))
      }
    }
    //自定义校验规则  验证手机号的校验规则
    var checkMobile=(rule,value,callback)=>{
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
     if(regMobile.test(value)){
        return callback()
      }else{
        callback(new Error('请输入合法的手机号'))
      }
    }
    return {
      // 获取用户列表的参数
      queryInfo:{ 
        query:'',
        // 当前的页数
        pagenum:1,
        //当前每页显示多少条数据
        pagesize:2
      },
      userList:[],
      total:0,
      // 控制对话框的显示与隐藏
      dialogVisible:false,
      // 添加用户的表单数据
      addForm:{
        username:'qiuhong',
        password:'qh786843361',
        mobile:'15244444444',
        email:'15244444444@qq.com'
      },
      // 添加表单验证
      addFormrules:{
        username:[
          {required:true,message:"请输入用户名",trigger:'blur'},
          {min:3,max:10,message:'长度为3~10个字符',trigger:'blur'}
        ],
        password:[
          {required:true,message:"请输入密码",trigger:'blur'},
          {min:6,max:15,message:'长度为6~15个字符',trigger:'blur'}
        ],
        mobile:[
          {required:true,message:"请输入手机",trigger:'blur'},
          {validator:checkMobile,trigger:'blur'}
        ],
        email:[
          {required:true,message:"请输入邮箱",trigger:'blur'},
          {validator:checkEmail,trigger:'blur'}
        ]
      },
      //修改表单的表单验证
      editFormRules:{
        mobile:[
          {required:true,message:"请输入手机",trigger:'blur'},
          {validator:checkMobile,trigger:'blur'}],
        email:[
          {required:true,message:"请输入邮箱",trigger:'blur'},
          {validator:checkEmail,trigger:'blur'}
        ]
      },
      // 修改用户的对话框显示与隐藏属性
      editDialogVisible:false,
      // 查询到的用户信息
      editForm:{}
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    getUserList(){
      getUserList(this.queryInfo).then(res=>{
        // console.log(res);
        if(res.meta.status!==200){
           this.$Message.error('获取用户列表失败')
        }else{
          this.userList=res.data.users
          this.total=res.data.total
          //  this.$Message.success(res.meta.msg)
        }
      })
    },
    // 监听pagesize改变的事件
    handleSizeChange(newpage){
      // console.log(newpage);
      this.queryInfo.pagesize=newpage
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newpage){
      // console.log(newpage);
     this.queryInfo.pagenum=newpage;
     this.getUserList()
    },
    // 监听switch状态的改变
    userStateChange(userInfo){
      // console.log(userInfo);
      userStateChange(userInfo).then(res=>{
        // console.log(res);
        if(res.meta.status!==200){
          userInfo.mg_state=!userInfo.mg_state
          this.$Message.error('更新失败')
        }else{
         this.$Message.success('更新页面状态成功')
        }
      })
    },
    dialogClose(){
      this.$refs.addFormRef.resetFields()
    },
    addUser(){
      // dialogVisible = false;
      this.$refs.addFormRef.validate((vaild)=>{
      //  console.log(vaild);   vaild为false或者true
      if(!vaild)return;
       addUsers(this.addForm).then(res=>{
        //  console.log(res);
        if(res.meta.status!==201) return this.$Message.error('添加失败')
        this.$Message.success('添加用户成功')
        this.dialogVisible=false
        this.getUserList()
       })
      })
    },
    // 修改用户
    editUsers(id){  
      // console.log(id);

      queryID(id).then(res=>{
        // console.log(res);
        if(res.meta.status!==200)return this.$Message.error('修改用户请求失败')
        this.editForm=res.data
        this.editDialogVisible=true;
        // console.log(this.editForm);
      })
    },
    // 修改用户关闭对话框的回调
    editDialogClosed(){
      // 重置表单
         this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    // editUserInfo(){
    //   this.$refs.editFormRef.validate(vaild=>{
    //     if(!vaild)return
    //     // console.log(vaild);
    //     console.log(this.editForm);
    //     editUser(this.editForm).then(res=>{
    //       // console.log(res);       
    //       if(res.meta.status!==200){
    //         return this.$Message.error('更新用户失败')
    //       }
    //      this.editDialogVisible = false
    //       this.getUserList()
    //       this.$Message.success('更新用户成功')
    //     })
    //   })
    // },
   editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        console.log(this.editForm)
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$Message.success('更新用户信息成功！')
      })
    },
    // 根据id删除对应的用户
    removeUserById(id){
      // console.log(id);
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res=>{
          // console.log(res);
          this.$http.delete('users/'+id).then(res=>{
            console.log(res);
            if(res.data.meta.status!==200&&res.data.meta.status!==400){
              this.$Message.error('删除失败')
            }else if(res.data.meta.status==400){
              this.$Message.error('这是管理员账户，删不掉的qaq')
            }else{
              this.getUserList()
              this.$Message.success('删除成功')
            }
            
          })
        }).catch(err=>{
          console.log(err);
          this.$Message.info('已取消删除')
        })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
