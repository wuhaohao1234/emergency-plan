<!--备案审核意见详情-->
<template>
  <div id="auditDetails">
    <el-row>
      <el-col :span="12">
        <div style="margin-left: 20px;font-size: 14px;line-height: 40px">
          <div v-for="(item,index) in dataList" :key="index" class="fileCheckbox">
            <el-checkbox disabled v-model="auditData.status==='reviewed'" style="margin-right: 10px"></el-checkbox>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <el-form :model="auditData" ref="queryForm" size="small" :inline="true">
          <el-row>
            <el-col :span="24">
              <el-form-item label="经办人" prop="planName">
                {{ auditData.agentName }}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="联系电话" prop="planName">
                {{ auditData.agentPhone }}
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="审核结论" prop="planName">
                <el-tag v-if="auditData.status==='reviewed'" type="success">审核通过</el-tag>
                <el-tag v-if="auditData.status==='returned'" type="danger">退回</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="auditData.status==='reviewed'">
              <el-form-item label="抄送部门" prop="sendDeptName">
                <span>{{auditData.sendDeptName}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="auditData.status==='returned'">
              <el-form-item label="退回意见" prop="reason">
                <span>{{ auditData.reason }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <download-file v-if="auditData.sealedRecordFormFileInfo" v-for="file in auditData.sealedRecordFormFileInfo" :key="file.fileKey"
                             :fileName="file.fileName" buttonDescText="备案登记表下载" :fileKey="file.fileKey"></download-file>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "auditDetails",
  props: {
    auditData: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      dataList: [
        {isConform: false, name: '应急预案文本（含电子文本）'},
        {isConform: false, name: '风险评估报告'},
        {isConform: false, name: '应急资源调查报告'},
        {isConform: false, name: '应急预案征求意见和采纳意见情况说明、分歧意见的处理依据和结果'},
        {isConform: false, name: '专家评审或论证意见'},
        {isConform: false, name: '需要说明的其他事项'},
      ],
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.fileCheckbox {
  .el-checkbox__input.is-disabled + .el-checkbox__label {
    color: white !important;
  }

  .el-checkbox__input.is-disabled.is-checked + .el-checkbox__label {
    color: #1890ff !important;
  }

  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #1890ff !important;
    border-color: #1890ff !important;
  }

  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: white;
    border-color: #DCDFE6;
    cursor: not-allowed;
  }

  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: white;
  }
}
</style>
