<template>
  <div id="planStructuralDetail" :style="style">
    <el-page-header @back="goBack" content="预案结构化详情" style="margin-top:10px;margin-bottom: 20px;color: white"></el-page-header>
    <div class="planTabs">
      <div style="height: 35px;display: flex;align-items: center;">
        <div
          @click="showTab('first')"
          :class="{ 'selected': activeName === 'first' }"
          style="margin-left: 500px;width:120px;height: 35px;float: left;display: flex"
        >
        <img
          style="width: 30px;height: 30px;float: left"
          :src="activeName === 'first' ? require('@/assets/images/detail/basicInfo-select.png') : require('@/assets/images/detail/basicInfo.png')"
          alt=""/>
          <div style="float: left">基本信息</div>
      </div>
        <div
          @click="showTab('second')"
          :class="{ 'selected': activeName === 'second' }"
          style="margin-left: 20px;width:120px;height: 35px;float: left;display: flex">
          <img
            style="width: 30px;height: 30px;float: left"
            :src="activeName === 'second' ? require('@/assets/images/detail/planContent-select.png') : require('@/assets/images/detail/planContent.png')"
            alt=""/>
          <div style="float: left">预案全文</div>
        </div>
        <div
          @click="showTab('third')"
          :class="{ 'selected': activeName === 'third' }"
          style="margin-left: 20px;width:120px;height: 35px;float: left;display: flex"
        >
        <img
          style="width: 30px;height: 30px;float: left"
          :src="activeName === 'third' ? require('@/assets/images/detail/warning-select.png') : require('@/assets/images/detail/warning.png')"
          alt=""/>
          <div style="float: left">监测预警</div>
      </div>
        <div
          @click="showTab('fourth')"
          :class="{ 'selected': activeName === 'fourth' }"
          style="margin-left: 20px;width:120px;height: 35px;float: left;display: flex"
        >
        <img
          style="width: 30px;height: 30px;float: left"
          :src="activeName === 'fourth' ? require('@/assets/images/detail/response-select.png') : require('@/assets/images/detail/response.png')"
          alt=""/>
          <div style="float: left">应急响应</div>
      </div>
      </div>

      <plan-content-detail v-show="activeName === 'second'" ref="planContentDetail" :planId="planInfo.planId" :planName="planInfo.planName"/>
      <basic-structural-detail v-show="activeName === 'first'" :planInfo="planInfo" v-if="planInfo.planId" :recordData="recordData"></basic-structural-detail>
      <warn-structural-detail v-show="activeName === 'third'" :planId="planInfo.planId" v-if="planInfo.planId"></warn-structural-detail>
      <answer-structural-detail v-show="activeName === 'fourth'" :planId="planInfo.planId" v-if="planInfo.planId"></answer-structural-detail>
    </div>
  </div>
</template>
<script>
import WarnStructuralDetail from "./warnStructuralDetail";
import AnswerStructuralDetail from "./answerStructuralDetail";
import PlanContentDetail from "@/views/plans/planFiling/audit/planContentDetail.vue";
import BasicStructuralDetail from "./basicStructuralDetail";

export default {
  name: "planStructuralDetail",
  components: {PlanContentDetail, WarnStructuralDetail, AnswerStructuralDetail, BasicStructuralDetail},
  data() {
    return {
      activeName: 'first',
      planInfo: {},
      recordData: {},
      style:{}
    };
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init(data, recordData,style) {
      this.planInfo = data;
      this.recordData = recordData
      this.style = style;
    },
    showTab(tabName) {
      this.activeName = tabName;
    },
  },
}
</script>

<style scoped lang="scss">
#planStructuralDetail {
  background-image: url("../../../../assets/images/bg.png");
  color: white;
  background-size: cover; /* 保持图片比例并覆盖整个容器 */
  background-position: center; /* 图片居中 */
  height: 87vh; /* 100% 视口高度 */
  overflow: hidden; /* 隐藏溢出内容 */
  #planTabs{
    .selected {
      color: orange; /* 橙色文字 */
    }
  }

}
</style>
