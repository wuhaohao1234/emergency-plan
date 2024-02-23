<template>
  <div>
    <div class="top">
      <div class="top-left" @click="changeType(businessList[0].type)">
        <!-- 它撑开 -->
        <div class="top-inner" :class="{ active: isActive == 1 }" @click="isActive = 1">
          <p class="text-2xl text-white text-center mt-49 top-class" @click="menuJumpHandle(businessList[0].type)">{{ businessList[0].name }}</p>
          <div class="grid col-3 row-2 mt-28">

            <div class="mx-auto" v-for="(item, index) in serviceJgList" :key="index">
              <p class="text-white text-center text-xl top-class">{{ item.number }}</p>
              <p class="text-base text-center text-white top-class">{{ item.name }}</p>
            </div>
            <img class="mx-auto" src="../../assets/images/data.png"  alt=""/>
            <img class="mx-auto" src="../../assets/images/data.png"  alt=""/>
            <img class="mx-auto" src="../../assets/images/data.png"  alt=""/>
          </div>
        </div>
        <!-- 它定位 -->
        <img v-if="isActive ==1" class="top-img" src="../../assets/images/qy.png"  alt=""/>
        <img v-else class="top-img" src="../../assets/images/jg.png"  alt=""/>
      </div>


      <div class="top-left" @click="changeType(businessList[1].type)">
        <!-- 它撑开 -->
        <div class="top-inner" :class="{ active: isActive == 2 }" @click="isActive = 2">
          <p class="text-2xl text-white text-center mt-49 top-class" @click="menuJumpHandle(businessList[1].type)">{{ businessList[1].name }}</p>
          <div class="grid col-3 row-2 mt-28">
            <div class="mx-auto" v-for="(item, index) in serviceQyList" :key="index">
              <p class="text-white text-center text-xl top-class">{{ item.number }}</p>
              <p class="text-base text-center text-white top-class">{{ item.name }}</p>
            </div>
            <img class="mx-auto" src="../../assets/images/data.png"  alt=""/>
            <img class="mx-auto" src="../../assets/images/data.png"  alt=""/>
            <img class="mx-auto" src="../../assets/images/data.png"  alt=""/>
          </div>
        </div>
        <!-- 它定位 -->
        <img v-if="isActive ==2" class="top-img" src="../../assets/images/qy.png"  alt=""/>
        <img v-else class="top-img" src="../../assets/images/jg.png"  alt=""/>
      </div>

    </div>

    <!--属性 id 为swiper最外层容器设置css样式-->
    <swiper :options="swiperOption" ref="mySwiper" id="mySwiper">

      <!--必须的组件-->
      <!--每页幻灯片使用swiper-slide标签-->
      <!--幻灯片组件生成的标签自带.swiper-slide的类名，但单类名选择器设置的部分css(如宽高)将被覆盖-->
      <swiper-slide>
        <div class="w-full bg-zuhe"
             style=" margin-top: 100px; min-height: 120px; display: flex; justify-content: space-around;width: 90%;margin-left: 5%">
          <div class="item-footer relative" v-if="swiperList[0] && swiperList[0].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[0])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[0].meta.title}}</p>
            <svg-icon :iconClass="swiperList[0].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[1] && swiperList[1].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[1])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[1].meta.title}}</p>
            <svg-icon :iconClass="swiperList[1].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[2] && swiperList[3].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[2])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[2].meta.title}}</p>
            <svg-icon :iconClass="swiperList[2].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[3] && swiperList[3].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[3])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[3].meta.title}}</p>
            <svg-icon :iconClass="swiperList[3].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[4] && swiperList[4].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[4])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[4].meta.title}}</p>
            <svg-icon :iconClass="swiperList[4].meta.icon" class="icon-color"></svg-icon>
          </div>
        </div>

        <div class="w-full bg-zuhe"
             style=" margin-top: 100px; min-height: 120px; display: flex; justify-content: space-around;width: 90%;margin-left: 5%">
          <div class="item-footer relative" v-if="swiperList[5] && swiperList[5].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[5])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[5].meta.title}}</p>
            <svg-icon :iconClass="swiperList[5].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[6] && swiperList[6].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[6])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[6].meta.title}}</p>
            <svg-icon :iconClass="swiperList[6].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[7] && swiperList[7].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[7])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[7].meta.title}}</p>
            <svg-icon :iconClass="swiperList[7].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[8] && swiperList[8].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[8])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[8].meta.title}}</p>
            <svg-icon :iconClass="swiperList[8].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[9] && swiperList[9].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[9])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[9].meta.title}}</p>
            <svg-icon :iconClass="swiperList[9].meta.icon" class="icon-color"></svg-icon>
          </div>
        </div>
      </swiper-slide>

      <swiper-slide v-if="isActive==1">
        <div class="w-full bg-zuhe"
             style=" margin-top: 100px; min-height: 120px; display: flex; justify-content: space-around;width: 85%;margin-left: 7%">
          <div class="item-footer relative" v-if="swiperList[10] && swiperList[10].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[10])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[10].meta.title}}</p>
            <svg-icon :iconClass="swiperList[10].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[11] && swiperList[11].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[11])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[11].meta.title}}</p>
            <svg-icon :iconClass="swiperList[11].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[12] && swiperList[12].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[12])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[12].meta.title}}</p>
            <svg-icon :iconClass="swiperList[12].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[13] && swiperList[13].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[13])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[13].meta.title}}</p>
            <svg-icon :iconClass="swiperList[13].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[14] && swiperList[14].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[14])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[14].meta.title}}</p>
            <svg-icon :iconClass="swiperList[14].meta.icon" class="icon-color"></svg-icon>
          </div>
        </div>

        <div class="w-full bg-zuhe"
             style=" margin-top: 100px; min-height: 120px; display: flex; justify-content: space-around;width: 90%;margin-left: 5%">
          <div class="item-footer relative" v-if="swiperList[15] && swiperList[15].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[15])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[15].meta.title}}</p>
            <svg-icon :iconClass="swiperList[15].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[16] && swiperList[16].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[16])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[16].meta.title}}</p>
            <svg-icon :iconClass="swiperList[16].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[17] && swiperList[17].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[17])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[17].meta.title}}</p>
            <svg-icon :iconClass="swiperList[17].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[18] && swiperList[18].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[18])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[18].meta.title}}</p>
            <svg-icon :iconClass="swiperList[18].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[19] && swiperList[19].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[19])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[19].meta.title}}</p>
            <svg-icon :iconClass="swiperList[19].meta.icon" class="icon-color"></svg-icon>
          </div>
          <div class="item-footer relative" v-if="swiperList[20] && swiperList[20].meta" @click.stop="menuJumpHandle(swiperList.type,swiperList[20])">
            <p class="text-lanse text-center text-lg absolutepos-x-center text-base">{{swiperList[20].meta.title}}</p>
            <svg-icon :iconClass="swiperList[20].meta.icon" class="icon-color"></svg-icon>
          </div>
        </div>
      </swiper-slide>

      <!-- 可选的控件 -->
      <!--分页器-->
      <div class="swiper-pagination" slot="pagination"></div>
      <!--滚动条-->
      <div class="swiper-scrollbar" slot="scrollbar"></div>
      <!--前进后退按钮-->
      <div class="swiper-button-prev2" slot="button-prev" v-show="isActive==1">
        <img src="../../assets/images/toleft.png"/>
      </div>
      <div class="swiper-button-next2" slot="button-next" v-show="isActive==1">
        <img src="../../assets/images/toright.png"/>
      </div>
    </swiper>

    <!--配置自定义的页面跳转按钮，to(page)为自定义方法，其内调用了swiper的内置方法-->
  </div>
</template>

<script>
import {filterDynamicRoutes, filterAsyncRouter} from "@/store/modules/permission";
import router, {constantRoutes, dynamicRoutes} from '@/router'
import {getRouters} from '@/api/menu'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css'
import {getmonthDrillNum, getmonthDrillQyNum} from "@/api/plans/drill";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  //计算属性
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  //设置自定义的按钮，点击后将前往目标也页
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
      swiperOption: {

        //幻灯片放映方向

        //分页器配置项
        pagination: {
          el: ".swiper-pagination", //分页器的类名
          clickable: true, // 点击分页器跳切换到相应的幻灯片
          type: 'bullets', //小圆点|进度条|数字页码
          dynamicBullets: true,  //动态小圆点(type:'bullets'时)
        },

        //前进后退按钮
        navigation: {
          prevEl: '.swiper-button-prev2',
          nextEl: '.swiper-button-next2',
        },


        //幻灯片播放配置项
        loop: true, //是否循环播放
        speed: 1000, // 发生页面切换动画时，动画的切换速度
        on: {
          init: function () {
            console.log('Swiper 初始化完成');
          },
          slideChangeTransitionEnd: function () {
            console.log(this.activeIndex); //每次切换结束时，在控制台打印现在是第几个slide
          },
        },
      },
      isActive: 1,
      swiperList: [],
      serviceQyList: [
        {
          number: 0,
          name: "预案报审数",
        },
        {
          number: 0,
          name: "备案报审数",
        },
        {
          number: 0,
          name: "评估报告数",
        }
      ],
      serviceJgList: [
        {
          number: 0,
          name: "预案报审数",
        },
        {
          number: 0,
          name: "备案报审数",
        },
        {
          number: 0,
          name: "评估报告数",
        }
      ]
    }
  },
  watch: {
    swiperList(newSwiperList) {
      console.log('swiperList 发生变化：', newSwiperList);
    },
  },
  mounted() {
    this.getMenus();
    this.getDrillNum();
    this.changeType(this.isActive);
  },
  methods: {
    to(index) {
      this.swiper.slideTo(index)
      console.log(this.swiper);
    },
    //获取统计数量
    getDrillNum() {
      getmonthDrillNum().then(res => {
        this.serviceJgList[0].number = res.data.submitAuditNum
        this.serviceJgList[1].number = res.data.recordReportNum
        this.serviceJgList[2].number = res.data.submitAuditNum
      });
      getmonthDrillQyNum().then(response => {
        this.serviceQyList[0].number = response.data.submitAuditNum
        this.serviceQyList[1].number = response.data.recordReportNum
        this.serviceQyList[2].number = response.data.assessNum
      })
    },
    //切换菜单
    changeType(type)
    {
      this.$nextTick(() => {
        this.isActive = type;
        if(type===1){
          this.swiperList=[]
          this.swiperList = this.businessList[0].menus
          this.swiperList.type = this.businessList[0].type
        }else {
          this.swiperList = []
          this.swiperList = this.businessList[1].menus
          this.swiperList.type = this.businessList[1].type
        }
        // 手动更新 Swiper
        this.$nextTick(() => {
          this.swiper.update();
        });
      })
      console.log("列表",this.swiperList)
    },
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
      console.log("监管端菜单",this.businessList[0].menus);
      console.log("企业端菜单",this.businessList[1].menus);
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
    //关闭菜单
    closeAllTags() {
      this.$tab.closeAllPage().then(({ visitedViews }) => {})
    },
  },
}
</script>

<style>
<!--容器样式-->
#mySwiper{
  width: 500px;
  height: 100px;
  background-color: aquamarine;
}
<!--幻灯片样式-->
    .swiper-slide.swiper_slide_item{
      background-color:aliceblue;
    }
<!--自定义分页器样式-->
    #mySwiper /deep/ .swiper-pagination-bullet-custom.swiper-pagination-bullet{
      width: 15px !important;
      height: 15px !important;
    }
.top-class{
  margin-block-start: 0;
  margin-block-end: 0;
}
.item-footer {
  width: 84px;
  bottom: 33px;
  background-position-y: -20px;
  background-image: url('../../assets/images/lansezhu.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
}
.item-footer:hover{
  background-image: url('../../assets/images/chengsezhu.png');
}

.item-footer:hover p {
  color: #FFC300;
}

.item-footer:hover .icon-color {
  color: #FFC300;
}
.top {
  display: flex;
  margin-top: 100px;
}

.top .top-left {

  margin: 0px 20px;
  flex: 1;
  position: relative;
}

.bg-zuhe {
  background-image: url('../../assets/images/底座1.png'), url('../../assets/images/底座2.png');
  background-size: contain;
  background-position: top left, center right;
  background-repeat: no-repeat, no-repeat;
  /* 可选，防止重复 */

}

.top .top-left .top-inner {
  border-radius: 30px;
  position: relative;
  left: 0;
  top: 0;
  padding: 20px 40px;
//background-color: #072b79;
  background-image: linear-gradient(0deg, #08379E 100%, #092359 0%);
}

.top .top-left .top-inner.active {
  background-image: linear-gradient(0deg, #1473D8 0%, #4cc6f3 100%);
  border: 2px solid #F9CA4F;
}

.top .top-left .top-img {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -100px;
}

.text-xl {
  font-size: 22px;
}

.text-lg {
  font-size: 18px;
}

.text-2xl {
  font-size: 25px;
}

.text-base {
  font-size: 14px;
}

.text-white {
  color: white;
}

.icon-color{
  color: #30FDFF
}

.footer-img {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.mx-auto {
  margin-right: auto;
  margin-left: auto;
}

.text-center {
  text-align: center;
}

.grid {
  display: grid;
}

.row-3 {
  grid-template-rows: 3;
}
.swiper-button-prev2,.swiper-button-next2{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
}
.swiper-button-prev2{
  left: 0;
}
.swiper-button-next2{
  height: 65px;
  right: 0;
}
.pos-x-center {
  left: 50%;
  transform: translateX(-50%);
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.row-2 {
  grid-template-rows: repeat(2, 1fr);
}

.col-3 {
  grid-template-columns: repeat(3, 1fr);
}

.w-full {
  width: 100%;
}

.mt-20 {
  margin-top: 20px;
}

.mt-21 {
  margin-top: 21px;
}

.mt-22 {
  margin-top: 22px;
}

.mt-23 {
  margin-top: 23px;
}

.mt-24 {
  margin-top: 24px;
}

.mt-25 {
  margin-top: 25px;
}

.mt-26 {
  margin-top: 26px;
}

.mt-27 {
  margin-top: 27px;
}

.mt-28 {
  margin-top: 28px;
}

.mt-29 {
  margin-top: 29px;
}

.mt-40 {
  margin-top: 40px;
}

.mt-49 {
  margin-top: 49px;
}

.text-lanse {
  color: #32c0e8;
}


/* 添加响应式媒体查询 */
@media screen and (max-width: 768px) {
  .top .top-left {
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 20px;
  }
  .top .top-left .top-inner {
    width: 100%;
    padding: 20px;
  }
  .top .top-left .top-inner .grid {
    grid-template-columns: repeat(1, 1fr);
  }
  .swiper-slide {
    width: 100%;
    overflow-x: scroll;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .swiper-slide .w-full {
    width: auto;
    display: flex;
    justify-content: flex-start;
  }
  .swiper-button-prev2, .swiper-button-next2 {
    display: none;
  }
}

@media screen and (min-width: 769px) and (max-width: 1024px) {
  /* 调整平板电脑的样式 */
}

@media screen and (min-width: 1025px) {
  /* 调整较大屏幕的样式 */
}
</style>
