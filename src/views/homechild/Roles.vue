<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRolesDialog = true">添加角色</el-button>
      <el-table  stripe border :data="roleList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item,index) in scope.row.children" :key="item.id" 
            :class="['bordert',index===0?'btop':'','center']">
              <!-- 一级权限 -->
              <el-col :span="5" >
                <el-tag>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row v-for="(two,index) in item.children" :key="two.id"
                :class="[index===0?'':'btop']">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success">{{two.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                    <!-- 三级权限 -->
                  <el-col :span="18">
                      <el-tag closable v-for="a in two.children" 
                      :key="a.id" @close="removeTagById(scope.row,a.id)">{{a.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="level" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="getRoleById(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialog"
      width="50%"
      @close="dialogClosed">
      <el-form ref="addRolesFrom" :model="addRoleForm" :rules="addRoelsrules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="50%">
      <el-form ref="editRolesFrom" :model="idForm" :rules="addRoelsrules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="idForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="idForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleChange">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 权限树 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed">
      <el-tree :data="rightsList" :props="defaultProps" ref="treeRef" show-checkbox 
      node-key="id" :default-expand-all="true" :default-checked-keys="defaultKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allorRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
 import {getRolesList,addRoles,editRoles,getRoleById,deleteRole,deleteRoleRright,setRoleRights} from '../../network/rights'
export default {
  data(){
    return {
      roleList:[],
      // 要添加的角色
      addRoleForm:{},
      // 验证规则
      addRoelsrules:{
        roleName:[{required:true,message:'请填写角色名称',trigger:'blur'},
          {min:2,max:8,message:'长度为2~8个字符',trigger:'blur'}
          ]
      },
      // 添加用户
      addRolesDialog:false,
      // 修改用户
      editdialogVisible:false,
      // 保存根据id获取的数据
      idForm:{},
      // 分配权限对话框
      setRightDialogVisible:false,
      // 所有权限列表
      rightsList:[],
      defaultProps: {
       children: 'children',
       label: 'authName'
      },
      // 默认选中节点的id值
      defaultKeys:[],
      // 当前即将分配权限的ID
      roleID:''
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    getRolesList(){
      getRolesList().then(res=>{
        // console.log(res);
        if(res.meta.status!==200)return this.$Message.error('获取角色失败')
        this.roleList=res.data
        // console.log(this.roleList);
      })
    },
       // 重置表单
    dialogClosed(){
      this.$refs.addRolesFrom.resetFields()
    },
    // 添加角色
    addRoles(){
      this.$refs.addRolesFrom.validate((vaild)=>{
      //  console.log(vaild);   vaild为false或者true
      if(!vaild)return;
       addRoles(this.addRoleForm).then(res=>{
        //  console.log(res);
        if(res.meta.status!==201) return this.$Message.error('添加角色失败')
        this.$Message.success('添加角色成功')
        this.addRolesDialog=false
        this.getRolesList()
       })
      })
    },
    // 根据id保存数据
    getRoleById(id){
      getRoleById(id).then(res=>{
        // console.log(res);
        if(res.meta.status!==200)return this.$Message.error('获取角色失败')
          this.idForm=res.data
          this.editdialogVisible=true
      })
    },
    // 修改角色
    editRoleChange(){
      editRoles(this.idForm).then(res=>{
        if(res.meta.status!==200)return this.$Messge.error('修改失败')
        this. getRolesList()
        this.editdialogVisible = false  
      })
    },
    // 删除角色
    deleteRole(id){
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(id).then(res=>{
           if(res.meta.status!==200)return this.$Messge.error('修改失败')
             this. getRolesList()
           })
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
    // 根据id删除对应的标签权限 参数分别为角色id和权限id
    removeTagById(role,rightid){
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const roleid=role.id
          deleteRoleRright(roleid,rightid).then(res=>{
            if(res.meta.status!==200)return
            // this.getRolesList()
            role.children=res.data
            this.$Message({type: 'success', message: '删除成功!'
          })          
          });
        }).catch(() => {
          this.$Message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 分配权限
    showSetRightDialog(role){
      this.roleID=role.id
      // 获取所有权限
      this.$http.get('rights/tree').then(res=>{
        // console.log(res);
        if(res.data.meta.status!==200)return this.$Message.error('获取权限列表失败')
        this.rightsList=res.data.data
      })
      // 递归获取三级节点的所有id
      this.getLeftKeys(role,this.defaultKeys)
      this.setRightDialogVisible = true 
    },
    // 通过递归保存三级权限下所有id并保存到defaultKey中
    getLeftKeys(node,arr){
      // 如果当前节点不包含children属性则是三级节点
       if(!node.children){
         return arr.push(node.id)
       }
       node.children.forEach(item => {
         this.getLeftKeys(item,arr)       
       });
    },
    setRightDialogClosed(){
      this.defaultKeys=[]
    },
    allorRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys);
      const idStr=keys.join(',')
      setRoleRights(this.roleID,idStr).then(res=>{
        // console.log(res);
        if(res.meta.status!==200){
          return this.$Message.error('更新权限失败')
        }else{
          this.$Message.success('更新权限成功')
          this.getRolesList()
          this.setRightDialogVisible= false
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px 0 7px 20px;
}
.bordert{
  border-bottom: 1px solid #eee;
}
.btop{
  border-top: 1px solid #eee;
} 
.center{
  display: flex;
  align-items: center;
}
</style>