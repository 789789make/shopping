w<template>
  <div id="app">
    <!-- <keep-alive> -->
    <page-header></page-header>
    <!-- </keep-alive> -->
    <router-view/>
    <page-footer></page-footer>
  </div>
</template>

<script>
import pageHeader from '@/components/header'
import pageFooter from '@/components/footer'
export default {
  name: 'App',
  data(){
    return {
      hasLogin:false,
      loginName:'',
      ifTip:true,
      ifAddTip:true,
      ifReomveTip:false,
      ifLoginTip:false
    }
  },
  components:{
    pageHeader,
    pageFooter
  },
}

</script>

<style>
*{
  margin:0;
  padding:0;
}
#app{
  min-width:730px;
  overflow:hidden;
}
.toRed:hover{
  background:rgba(209,67,74,.2)
}


</style>
