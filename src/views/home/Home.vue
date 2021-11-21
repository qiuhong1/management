<template>
  <div>
    <el-button @click="tuichuClick" type="info">退出</el-button>
  </div>
</template>

<script>
export default {
name:'Home',
methods:{
  tuichuClick(){
    sessionStorage.clear()
    this.$router.push('/login')
  }
}
}
</script>

<style>

</style>