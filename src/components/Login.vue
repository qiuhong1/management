<template>
  <div class="login">
    <div class="login_header">
      <div class="w">
        <div class="left">
          <img src="../assets/logo.png" alt="">
          <div class="box">中文邮箱第一品牌</div>
        </div>
        <div class="right">
          <a>VIP</a>
          <a>会员</a>
          <a>企业邮箱</a>
          <a>海外登录</a>
          <a>帮助</a>
          <a>反馈</a>
          <a>修复公式</a>
        </div>
      </div>
    </div>
    <swiper-mine></swiper-mine>
    <div class="formbox">
      <p>隐私政策更新</p>
      <h2>邮箱账号登录</h2>
       <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
            <el-input placeholder="请输入用户名"
              prefix-icon="el-icon-user-solid"
              v-model="loginForm.username">
             </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
             <el-input placeholder="请输入密码"
              prefix-icon="el-icon-goods"
              show-password
               v-model="loginForm.password">
             </el-input>
        </el-form-item>
        <!-- 登录注册按钮 -->
        <el-form-item class="mybtn">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="resetClick">重置</el-button>
        </el-form-item> 
      </el-form>
    </div>
  </div>
</template>
<script>
    import SwiperMine from './SwiperMine.vue'
    import {getLogin} from '../network/index'
    export default {
        name: 'Login',
        components: {
            SwiperMine
        },
        data(){
          return{
            loginForm:{
               username:'admin',
               password:'123456'
            },
            rules:{
              // 验证用户名是否合法
              username:[
              {required:true,message:"请输入用户名",tigger:'blur'},
              {min:3,max:5,message:'长度为3到5个字符',tigger:'blur'}
              ],
              // 验证密码是否合法
              password:[
              {required:true,message:'请输入密码',tigger:'blur'},
              {min:3,max:8,message:'长度为3到8个字符',tigger:'blur'}
              ]
            }
          }
        },
        methods:{
          resetClick(){
            this.$refs.loginFormRef.resetFields()
          },
          loginClick(){
            // 表单预验证
            this.$refs.loginFormRef.validate(valid=>{
            if(!valid) return;
            else{
              getLogin(this.loginForm).then(res=>{
                console.log(res);
                if(res.meta.status!==200){
                  this.$Message.error('仔细看看,你登陆失败了，哈哈')
                }else{
                 this.$Message.success('登陆成功嘞')
                sessionStorage.setItem('token',res.data.token)
                 this.$router.push('/home')
                }
              })
             }
            })
          }
        }
    }
</script>
<style lang="less" scoped>
    .login {
        height: 100vh;
    }
    
    .login_header {
        height: 70px;
        .w {
            height: 100%;
            margin: 0 50px;
            display: flex;
            justify-content: space-between;
            .left {
                display: flex;
                align-items: center;
                img {
                    margin-right: 15px;
                }
                .box {
                    height: 30px;
                    border-left: 1px solid #666;
                    padding-left: 15px;
                    font-size: 18px;
                    font-weight: 300;
                    line-height: 30px;
                    color: #666;
                }
            }
            .right {
                display: flex;
                align-items: center;
                cursor: pointer;
                a {
                    // height: 12px;
                    font-size: 12px;
                    color: #666;
                    padding: 0 8px;
                }
                a:nth-child(4)::after {
                    content: '';
                    display: inline-block;
                    width: 1px;
                    background-color: #666;
                    height: 10px;
                    margin-left: 7px;
                }
            }
        }
    }
    
    .formbox {
        padding: 0 20px;
        text-align: center;
        border-radius: 20px;
        width: 400px;
        height: 400px;
        position: absolute;
        top: 200px;
        right: 60px;
        background-color: #fff;
        z-index: 999;
        p {
            font-size: 14px;
            color: #666;
        }
        h2 {
            font-size: 18px;
        }
    }
    
    .mybtn {
        display: flex;
        justify-content: center;
    }
</style>