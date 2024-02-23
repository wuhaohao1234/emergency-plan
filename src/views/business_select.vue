<!--登录后业务选择-->
<template>
  <div id="businessChange" v-loading="loading">
    <div class="left">
      <select-left style="width: 70%;margin-left: 100px"/>
    </div>
    <div class="right">
      <div class="system-name">
        <img :src="logo" class="top-logo" alt=""/>
        <span class="top-title">欢迎您登录{{ title }} </span>
      </div>
      <!--      地球-->
      <div class="right-earth">
        <Earth/>
      </div>
    </div>
  </div>
</template>

<script>
import logoImg from '@/assets/logo/logo.png'
import {filterDynamicRoutes, filterAsyncRouter} from "@/store/modules/permission";
import router, {constantRoutes, dynamicRoutes} from '@/router'
import {getRouters} from '@/api/menu'
import Earth from '@/components/Earth'
import SelectLeft from '@/components/SelectLeft'
export default {
  name: "businessChange",
  components: {
    Earth,
    SelectLeft
  },
  data() {
    return {
      businessList: [
        {
          type: 1,
          name: '政府机关预案管理',
          menus: []
        }, {
          type: 2,
          name: '企事业单位预案管理',
          menus: []
        },
      ],
      organBusiness: [],
      deptBusiness: [],
      title: process.env.VUE_APP_TITLE,
      logo: logoImg,
      loading:false,
    };
  },
  mounted() {
    this.getMenus()
  },
  methods: {
    //获取业务快捷菜单
    getMenus() {
      this.loading=true
      this.businessList[0].menus = []
      let allMenus = JSON.parse(sessionStorage.getItem('ALL_MENU'));
      let menus = allMenus.filter(item => item.name !== 'System')
      menus.forEach(item => {
        item.children.forEach(c => {
          c.parent = item
        })
        this.businessList[0].menus = this.businessList[0].menus.concat([...item.children])
      })
      this.loading=false
      this.businessList[1].menus = this.businessList[0].menus.filter(item => item.businessType.includes('2'))
    },
    //菜单跳转操作
    menuJumpHandle(type, data) {
      this.loading=true
      this.closeAllTags()
      sessionStorage.setItem('BUSINESS_TYPE', type)
      // 向后端请求路由数据
      getRouters(type).then(res => {
        const sdata = JSON.parse(JSON.stringify(res.data))
        const rdata = JSON.parse(JSON.stringify(res.data))
        const sidebarRoutes = filterAsyncRouter(sdata)
        const rewriteRoutes = filterAsyncRouter(rdata, false, true)
        const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
        rewriteRoutes.push({path: '*', redirect: '/404', hidden: true})
        router.addRoutes(asyncRoutes);
        this.$store.commit('SET_ROUTES', rewriteRoutes)
        this.$store.commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
        this.$store.commit('SET_DEFAULT_ROUTES', sidebarRoutes)
        this.$store.commit('SET_TOPBAR_ROUTES', sidebarRoutes)
        if(data){
          let path = data.parent.path + '/' + data.path
          this.$router.push({path})
        }else {
          this.$router.push({ path:"/" }).catch(()=>{});
        }
        this.loading=false
      })
    },
    //退出系统 退出登录
    async logout() {
      sessionStorage.removeItem('BUSINESS_TYPE')
      sessionStorage.removeItem('ALL_MENU')
      this.$store.dispatch('LogOut').then(() => {
        location.href = '/index';
      })
    },
    //关闭菜单
    closeAllTags() {
      this.$tab.closeAllPage().then(({ visitedViews }) => {})
    },
  },
};
</script>

<style scoped>
#businessChange {
  height: 100vh;
  background-image: url("../assets/images/background.png");
  background-size: 100% 100%;
  display: flex;
  .left{
    width: 55%;
    float: left;
    text-align: center;
  }
  .right{
    width: 45%;
    float: left;
    .system-name {
      display: flex;
      float: right;
      margin: 20px;
      height: 47px;
      .top-logo {
        width: 80px;
        height: 47px;
      }

      .top-title {
        font-size: 25px;
        color: white;
        margin: 8px 10px 0px -10px;
      }
    }
    .right-earth{
      position: fixed;
      margin-left: -100px;
      bottom: -60px;
    }
  }
}
</style>

