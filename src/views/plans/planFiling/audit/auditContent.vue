<!--备案审核-->
<template>
  <div id="auditDetail">
    <div v-if="!planStructralDetaillVisible">
      <el-page-header @back="goBack" :content="handleType===1?'备案详情':'备案审核'"
                      style="margin-bottom: 20px"></el-page-header>
      <div class="recordInfo">
        <el-descriptions style="margin-left: 20px">
          <el-descriptions-item label="预案名称">{{ planInfo.planName }}</el-descriptions-item>
          <el-descriptions-item label="编制单位">{{ planInfo.preparationDeptName }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ recordData.contactName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ recordData.contactPhone }}</el-descriptions-item>
          <el-descriptions-item label="受理部门">{{ recordData.reportingDeptName }}</el-descriptions-item>
          <el-descriptions-item label="发布单位">{{ planInfo.publishDeptName }}</el-descriptions-item>
          <el-descriptions-item label="发布文号">{{ planInfo.documentNumber }}</el-descriptions-item>
          <el-descriptions-item label="发布日期">{{ parseTime(planInfo.publishTime, '{y}-{m}-{d}') }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="bottom-card">
        <el-tabs type="card" v-if="planInfo.planId" v-model="activeName">
          <el-tab-pane name="one">
            <span slot="label"><i class="el-icon-tickets"></i> 基本资料</span>
            <data-preview ref="dataPreview" :recordData="recordData"></data-preview>
          </el-tab-pane>
          <el-tab-pane name="tow" v-if="handleType===1&&(recordData.status==='reviewed'||recordData.status==='returned')">
            <span slot="label"><i class="el-icon-user"></i> 备案审核意见</span>
            <audit-details ref="auditDetails" :auditData="recordData"></audit-details>
          </el-tab-pane>
          <el-tab-pane v-if="handleType===2" name="three">
            <span slot="label"><i class="el-icon-user"></i> 备案审核</span>
            <audit-submit ref="auditSubmit" @goBack="goBack"  :deptOptions="deptData" :recordId="recordId" :planInfo="planInfo"></audit-submit>
          </el-tab-pane>
          <div class="right-button" v-if="activeName=='one'">
            <el-button type="primary" icon="el-icon-tickets" plain @click="structuralDetailHandle">
              <b>结&nbsp;构&nbsp;化&nbsp;详&nbsp;情</b></el-button>
          </div>
        </el-tabs>
      </div>
    </div>
    <plan-structural-detail ref="planStructuralDetail" v-if="planStructralDetaillVisible" @goBack="()=>{this.planStructralDetaillVisible=false}"/>
  </div>
</template>

<script>
import dataPreview from "../declare/dataPreview";
import planConnection from "../declare/planConnection";
import startingCondition from "../declare/startingCondition";
import relatedFile from "../declare/relatedFile";
import auditDetails from "../declare/auditDetails";
import auditSubmit from "./auditSubmit";
import {listDeptTree} from "@/api/system/dept";
import orgTree from "../declare/orgTree";
import PlanStructuralDetail from "@/views/plans/planFiling/audit/planStructuralDetail";

export default {
  name: "auditDetail",
  props: {},
  components: {
    PlanStructuralDetail,
    dataPreview,
    planConnection,
    startingCondition,
    relatedFile,
    auditDetails,
    auditSubmit,
    orgTree
  },
  data() {
    return {
      activeName:'one',
      planInfo: {},
      deptData: [],
      recordId: '',
      recordData: {},
      planStructralDetaillVisible: false,
      handleType: 1,
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
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init(data, type) {
      this.getDeptData()
      this.recordData = data
      this.recordData.sealedRecordFormFileInfo = data.sealedRecordFormFileInfo ? JSON.parse(data.sealedRecordFormFileInfo) : [];
      this.planInfo = data.planInfo
      this.recordId = data.recordId
      this.handleType = type
    },
    /** 查询单位 */
    getDeptData() {
      listDeptTree().then(response => {
        this.deptData = response.data;
      });
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
    //查看预案结构化详情
    structuralDetailHandle() {
      this.planStructralDetaillVisible = true;
      this.$nextTick(() => {
        this.$refs.planStructuralDetail.init(this.planInfo,this.recordData);
      });
    },
  }
}
</script>

<style lang="scss">
#auditDetail {
  .recordInfo {
    .el-descriptions-item__label:not(.is-bordered-label) {
      margin-right: 10px;
      font-weight: bold;
    }
  }

  .bottom-card {
    position: relative;

    .right-button {
      position: absolute;
      top: 10px;
      right: 1px;
    }
  }
}

</style>
