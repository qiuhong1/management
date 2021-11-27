<template>
    <el-container class="main-container">
      <!-- 头部区域 -->
      <el-header>
        <div class="left">
          <img src="../../assets/hlogo.png" alt="">
          电商后台管理系统
        </div>
        <el-button @click="tuichuClick" type="info">退出</el-button>
      </el-header>
      <!-- 页面主体区 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="choose? '64px' : '200px'">
          <!-- 折叠样式 -->
          <div class="zhedie" @click="zhedieClick">折叠</div>
          <!-- 侧边栏菜单 -->
          <el-menu
            :default-active="activePath"
            background-color="#333945"
            text-color="#fff"
            active-text-color="pink"
            :unique-opened="true"
            :collapse="choose"
            :collapse-transition="false"
            :router="true">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''"  v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconList[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+a.path"  v-for="a in item.children" :key="a.id" @click="elItemClick('/'+a.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{a.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import { getLeftMenu } from '../../network/index.js'

import Welcome from '../../components/Welcome.vue'
export default {
  name:'Home',
  components:{
    Welcome
  },
  data(){
   return{
     menuList:[],
     iconList:{
       '125':'iconfont icon-user',
       '103':'iconfont icon-tijikongjian',
       '101':'iconfont icon-shangpin',
       '102':'iconfont icon-danju',
       '145':'iconfont icon-baobiao',
     },
     choose:false,
    //  被激活的链接地址
     activePath:''
   }
  },
  created(){
     this.getLeftMenu(); 
     this.activePath=window.sessionStorage.getItem('activePath')  
  },
  methods:{
    // 退出按钮
    tuichuClick(){
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单
    getLeftMenu(){
      getLeftMenu().then(res=>{
        // console.log(res);
        if(res.meta.status!==200){
          this.$Message.error(res.meta.msg)
        }else{
           this.menuList=res.data
          //  console.log(this.menuList);
        }
      })
    },
    zhedieClick(){
      // console.log(111);
      this.choose=!this.choose
    },
    // 把当前活跃的菜单路由储存
    elItemClick(activePath){
      window.sessionStorage.setItem('activePath',activePath)
    },
  }
  }
</script>

<style lang="less" scoped>
.main-container{
  height: 100vh;
}
.el-header{
  font-size: 20px;
  background-color: #353B3E;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  img{
    vertical-align: middle;
    margin-right: 20px;
  }
}

.el-aside{
  background-color: #333945;
    .el-menu {
    border-right: none;
  }
}
.el-main{
 background-color: #E5EAED;
}
.iconfont{
  margin-right: 10px;
}
.zhedie{
  background-color: #495365;
  font-size: 14px;
  color: #fff;
  height: 30px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}

</style>