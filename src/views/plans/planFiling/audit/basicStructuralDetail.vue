<!--基本信息结构化详情-->
<template>
  <div id="basicStructuralDetail">
    <div class="left-content">
      <div style="margin-top: 30px;font-size: 20px">
        <div @click="showTab('one')" style="margin-top: 200px" :class="{ 'selected': activeName === 'one', 'left-button': activeName !== 'one'}">
          <span style="position: absolute;top: 35%;left: 30%;">事件级别</span>
        </div>
        <div @click="showTab('two')" style="margin-top: 80px" :class="{ 'selected': activeName === 'two', 'left-button': activeName !== 'two' }">
          <span style="position: absolute;top: 35%;left: 30%;">预案衔接</span>
        </div>
      </div>
    </div>
    <div class="right-content">
      <div class="right-top">
        <el-descriptions class="descriptions-style" style="margin-left: 80px;padding-top:20px;width: 90%;font-size: 16px;">
          <el-descriptions-item label="预案名称">{{ planInfo.planName }}</el-descriptions-item>
          <el-descriptions-item label="编制单位">{{ planInfo.preparationDeptName }}</el-descriptions-item>
          <el-descriptions-item label="发布单位">{{ planInfo.publishDeptName }}</el-descriptions-item>
          <el-descriptions-item label="发布日期">{{ parseTime(planInfo.publishTime, '{y}-{m}-{d}') }}</el-descriptions-item>
          <el-descriptions-item label="演练周期">{{ getCycle(recordData.drillCycle) }}{{getNum(recordData.drillNum) }}</el-descriptions-item>
          <el-descriptions-item label="评估周期">{{ getCycle(recordData.evaluationCycle) }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="right-bottom">
        <div v-if="activeName === 'one'" style="width: 90%;margin-left: 40px;padding-top: 50px;">
          <el-table :data="levelList" style="color: white;background:none;max-height:450px;overflow: auto;">
            <el-table-column prop="label" label="级别" width="100"></el-table-column>
            <el-table-column prop="levelName" label="级别名称" width="200"></el-table-column>
            <el-table-column prop="levelContent" label="级别描述"></el-table-column>
          </el-table>
        </div>
        <div v-if="activeName === 'two'" style="margin-left: 20px;padding-top: 50px">
          <plan-connection
            ref="planConnection"
            :handleType="1"
            :recordId="recordData.recordId"
            v-if="recordData">
          </plan-connection>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {findLevelInfo,enFindLevelInfo} from "@/api/plans/planLevel"
import planConnection from "../declare/planConnection";
export default {
  name: "basicStructuralDetail",
  components: {planConnection},
  props: {
    planInfo: {
      type: Object,
      default: {}
    },
    recordData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      levelList: [],
      activeName: "one",
      yearList: [
        {label: '半年', value: 0},
        {label: '一年', value: 1},
        {label: '两年', value: 2},
        {label: '三年', value: 3},
        {label: '四年', value: 4},
        {label: '五年', value: 5}],
      numList: [
        {label: '一次', value: 0},
        {label: '两次', value: 1},
        {label: '三次', value: 2},
        {label: '四次', value: 3},
        {label: '五次', value: 4}],
      contentStyle: {
        color:"white"
      },
      businessType:1,
    }
  },
  created() {
    this.findBasicStructuralInfo()
    this.businessType = sessionStorage.getItem('BUSINESS_TYPE');//业务类型
  },
  methods: {
    /**
     * 查询基本信息结构化信息
     */
    findBasicStructuralInfo() {
      (this.businessType == 1 ? findLevelInfo : enFindLevelInfo)(this.planInfo.planId, 1).then(res => {
        if (res.data && res.data.length) {
          this.levelList = res.data
          this.levelList.forEach(item => {
            switch (item.level) {
              case 1:
                item.label = 'I级'
                break;
              case 2:
                item.label = 'II级'
                break;
              case 3:
                item.label = 'III级'
                break;
              case 4:
                item.label = 'IV级'
                break;
            }
          })
        }
      })
    },
    showTab(tabName) {
      this.activeName = tabName;
    },
    //获取周期
    getCycle(val) {
      let arr = this.yearList.filter(item => item.value == val)
      return arr.length ? arr[0].label : ''
    },
    //获取次数
    getNum(val) {
      let arr = this.numList.filter(item => item.value == val)
      return arr.length ? arr[0].label : ''
    },

  }
}
</script>

<style lang="scss">
#basicStructuralDetail {
  color: white;
  display: flex;
  .left-content {
    width: 278px;
    height: 700px;
    background-image: url("../../../../assets/images/detail/left.png"); /* 替换为你的图片路径 */
    background-size: 278px 700px;
    background-repeat: no-repeat;
    background-position: center; /* 或者根据需要调整背景图的位置 */
    float: left;

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
    float: left;
    width: 1250px;
    height: 700px;
    margin-left: 45px;

    .right-top {
      width: 1250px;
      height: 120px;
      background-size: 1250px 120px;
      background-repeat: no-repeat;
      background-position: center; /* 或者根据需要调整背景图的位置 */
      background-image: url("../../../../assets/images/detail/level-bg.png");

      .descriptions-style ::v-deep .el-descriptions {
        background-color: #5ee4f5; /* 设置背景颜色为你想要的颜色 */
        color: white; /* 设置文字颜色为你想要的颜色 */
      }
    }
    .right-bottom{
      width: 1200px;
      height: 580px;
      margin-left: 45px;
      background-size: 1200px 580px;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("../../../../assets/images/detail/content.png");

    }
  }
  .el-table {
    background-image: linear-gradient(0deg, #46A2EE 100%, #1F57C6 0%);
    th.el-table__cell {
      background-image: linear-gradient(0deg, #46A2EE 0%, #1F57C6 100%);
      opacity: 0.8;
      color: white; //表头字体
    }

    .el-table__body tr { //tbody部分背景色和字体色
      background-image: linear-gradient(0deg, #46A2EE 0%, #1F57C6 100%);
      color: white;
    }

    .el-table__empty-block {
      background-image: linear-gradient(0deg, #46A2EE 0%, #1F57C6 100%);

      .el-table__empty-text {
        color: white;
      }
    }
  }
  .el-descriptions{
    .el-descriptions__body{
      background: none;
      color: white;
    }
  }
  .el-form{
    .el-form-item__label{
      color: white;
    }
    .el-input__inner{
      background: none;
    }
  }
  .el-table__body-wrapper tbody tr:hover>td{
    background: #5face8;
  }
}
</style>
