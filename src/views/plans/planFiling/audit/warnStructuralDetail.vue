<!--预测预警结构化详情-->
<template>
  <div id="warnStructuralDetail">
    <div  class="warnStructuralDetailDiv" v-if="earlyWarningList.length>0">
      <div class="left-content">
        <div style="margin-top: 30px;font-size: 20px">
          <div @click="showTab('one')" style="margin-top: 100px" :class="{ 'selected': activeName === 'one', 'left-button': activeName !== 'one'}">
            <span style="position: absolute;top: 35%;left: 30%;">预警分级</span>
          </div>
          <div @click="showTab('two')" :class="{ 'selected': activeName === 'two', 'left-button': activeName !== 'two'}">
            <span style="position: absolute;top: 35%;left: 30%;">预警发布</span>
          </div>
          <div @click="showTab('three')" :class="{ 'selected': activeName === 'three', 'left-button': activeName !== 'three' }">
            <span style="position: absolute;top: 35%;left: 30%;">信息报告</span>
          </div>
          <div @click="showTab('four')" :class="{ 'selected': activeName === 'four', 'left-button': activeName !== 'four' }">
            <span style="position: absolute;top: 35%;left: 30%;">预警行动</span>
          </div>
          <div @click="showTab('five')" :class="{ 'selected': activeName === 'five', 'left-button': activeName !== 'five' }">
            <span style="position: absolute;top: 35%;left: 30%;">预警解除</span>
          </div>
          <div @click="showTab('six')" :class="{ 'selected': activeName === 'six', 'left-button': activeName !== 'six' }">
            <span style="position: absolute;top: 35%;left: 20%;">预警发布流程</span>
          </div>
        </div>
      </div>
      <div class="right-content">
        <div class="right-top">
          <div v-if="earlyWarningList.includes(1)" style="margin-top: 20px">
            <div @click="selectLevel(1)" :class="{ 'active': activeButton === 1 }">
              <div style="position: relative;text-align: center;">
                <img src="@/assets/images/detail/firstLevel.png" alt="" class="top-level">
                <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-size: 18px;color: red">I级</div>
              </div>
              <div style="margin-top: -50px">
                <img style="transform: scale(1,0.5)" v-if="activeButton === 1" src="@/assets/images/detail/hong.gif" alt="" class="level-gift">
              </div>
            </div>
          </div>
          <div v-if="earlyWarningList.includes(2)" style="margin-top: 20px">
            <div @click="selectLevel(2)" :class="{ 'active': activeButton === 2 }">
              <div style="position: relative;text-align: center;">
                <img src="@/assets/images/detail/secondLevel.png" alt="" class="top-level">
                <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-size: 18px;color: #FFAA00">II级</div>
              </div>
              <div style="margin-top: -50px">
                <img style="transform: scale(1,0.5)" v-if="activeButton === 2" src="@/assets/images/detail/cheng.gif" alt="" class="level-gift">
              </div>
            </div>
          </div>
          <div v-if="earlyWarningList.includes(3)" style="margin-top: 20px">
            <div @click="selectLevel(3)" :class="{ 'active': activeButton === 3 }">
              <div style="position: relative;text-align: center;">
                <img src="@/assets/images/detail/thirdLevel.png" alt="" class="top-level">
                <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-size: 18px;color: #FFF021">III级</div>
              </div>
              <div style="margin-top: -50px">
                <img style="transform: scale(1,0.5)" v-if="activeButton === 3" src="@/assets/images/detail/huang.gif" alt="" class="level-gift">
              </div>
            </div>
          </div>
          <div v-if="earlyWarningList.includes(4)" style="margin-top: 20px">
            <div @click="selectLevel(4)" :class="{ 'active': activeButton === 4 }">
              <div style="position: relative;text-align: center;">
                <img src="@/assets/images/detail/fourLevel.png" alt="" class="top-level">
                <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);font-size: 18px;color: #00F3FF">IV级</div>
              </div>
              <div style="margin-top: -50px">
                <img style="transform: scale(1,0.5)" v-if="activeButton === 4" src="@/assets/images/detail/lan.gif" alt="" class="level-gift">
              </div>
            </div>
          </div>
        </div>
        <div class="right-bottom">
          <div style="width: 95%;margin-left: 2%;padding-top: 60px">
            <detail-content v-if="activeName === 'one'" :dataList="levelData.earlyWarningClassification"></detail-content>
            <detail-content v-if="activeName === 'two'" :dataList="levelData.earlyWarningPublish"></detail-content>
            <detail-content v-if="activeName === 'three'" :dataList="levelData.infoReport"></detail-content>
            <detail-content v-if="activeName === 'four'" :dataList="levelData.earlyWarningRespond"></detail-content>
            <detail-content v-if="activeName === 'five'" :dataList="levelData.earlyWarningSecure"></detail-content>
            <detail-content v-if="activeName === 'six'" :dataList="levelData.publishFlowChart" :contentType="2"></detail-content>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <el-empty description="暂无预测预警结构化信息"></el-empty>
    </div>

  </div>
</template>

<script>
import {findLevelInfo,enFindLevelInfo} from "@/api/plans/planLevel"
import DetailContent from "./detailContent";

export default {
  name: "warnStructuralDetail",
  components: {DetailContent},
  props: {
    planId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      activeName: "one",
      level: 0,
      earlyWarningList: [],
      levelList: [],
      levelData: {
        earlyWarningClassification: [],
        earlyWarningPublish: [],
        infoReport: [],
        earlyWarningRespond: [],
        earlyWarningSecure: [],
        publishFlowChart: []
      },
      activeButton: null,
      businessType:1,
    }
  },
  watch: {
    level(newVal, oldVal) {
      switch (newVal) {
        case 1:
          this.levelData = this.levelList[0];
          break;
        case 2:
          this.levelData = this.levelList[1];
          break;
        case 3:
          this.levelData = this.levelList[2];
          break;
        case 4:
          this.levelData = this.levelList[3];
          break;
      }
    }
  },
  created() {
    this.findWarnStructuralInfo()
    this.businessType = sessionStorage.getItem('BUSINESS_TYPE');//业务类型
  },
  methods: {
    /**
     * 查询预测预警结构化信息
     */
    findWarnStructuralInfo() {
      (this.businessType == 1 ? findLevelInfo : enFindLevelInfo)(this.planId, 2).then(res => {
        if (res.data && res.data.length) {
          this.earlyWarningList = res.data.map(item => item.level)
          this.level = this.earlyWarningList[0];
          this.activeButton = this.level;
          this.selectLevel(this.level);
          this.levelList = res.data
        }
      })
    },
    showTab(tabName) {
      this.activeName = tabName;
    },
    selectLevel(level) {
      this.level = level;
      this.activeButton = level;
    },
  }
}
</script>

<style lang="scss">
#warnStructuralDetail {
  .warnStructuralDetailDiv {
    display: flex;
  } 
  .left-content {
    width: 278px;
    height: 700px;
    background-image: url("../../../../assets/images/detail/left.png");
    background-size: 278px 700px;
    background-repeat: no-repeat;
    background-position: center; /* 或者根据需要调整背景图的位置 */

    .selected{
      position: relative;
      width: 200px;
      height: 60px;
      margin-left: 40px;
      margin-top: 20px;
      text-align: center;
      background-size: 200px 80px;
      background-repeat: no-repeat;
      background-position: center; /* 或者根据需要调整背景图的位置 */
      background-image: url("../../../../assets/images/detail/botton-item-select.png");
    }

    .left-button{
      position: relative;
      width: 200px;
      height: 60px;
      margin-left: 40px;
      margin-top: 20px;
      text-align: center;
      background-image: url("../../../../assets/images/detail/botton-item.png");
      background-size: 200px 80px;
      background-repeat: no-repeat;
      background-position: center; /* 或者根据需要调整背景图的位置 */
    }
  }
  .right-content {
    // width: 1250px;
    height: 700px;
    margin-left: 45px;
    flex: 1;
    .right-top {
      // width: 1250px;
      height: 200px;
      background-size: 100% 200px;
      background-repeat: no-repeat;
      background-position: center; /* 或者根据需要调整背景图的位置 */
      background-image: url("../../../../assets/images/detail/level-bg.png");
      display: flex;
      justify-content: space-around;
      .top-level {
        width: 115px;
        height: 115px;
      }
      .level-gift {
        margin-top: 10px;
        width: 115px;
        height: 80px;
      }
    }
    .right-bottom{
      // width: 1200px;
      height: 500px;
      margin-left: 45px;
      background-size: 100% 500px;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("../../../../assets/images/detail/content.png");
    }
  }
  .el-empty{
    margin-left: 50%;
  }
}
</style>
