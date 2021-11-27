<template>
  <div class="swipermain">
    <swiper :options="swiperOptions" class="swiperss">
      <swiper-slide v-for="item in imglist" :key="item.id"><img :src="item.imgUrl" alt=""></swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
 name:'SwiperMine',
 data(){
  return{
    swiperOptions:{
      // pagination:'.swiper-pagination',
      loop:true,
      autoplay:5000,
    },
    imglist:[
      {
        id:'1',
        imgUrl:require('../assets/2.jpg')
      },
      {
        id:'2',
        imgUrl:require('../assets/1.jpg')
      },{
        id:'3',
        imgUrl:require('../assets/3.jpg')
      }
    ]
  }
 }
}
</script>

<style lang="less" scoped>
.swipermain{
 overflow: hidden;
 width: 100%;
 height: calc(100vh - 70px);
}
.swiperss{
  width: 100%;
  height: 100%;
}
 img{
   width: 100%;
  //  height: 100%;
 }
//  .swiper-pagination{
//    bottom: 60px;
//  }
</style>