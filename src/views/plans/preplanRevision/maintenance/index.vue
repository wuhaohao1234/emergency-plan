<!--预案维护-->
<template>
  <div class="maintenance">
    <el-page-header @back="goBack" content="预案日常维护"></el-page-header>
    <el-descriptions style="margin-left: 20px;margin-top: 10px">
      <el-descriptions-item label="预案名称">{{ planInfo.planName }}</el-descriptions-item>
      <el-descriptions-item label="编制单位">{{ planInfo.preparationDeptName }}</el-descriptions-item>
      <el-descriptions-item label="联系人">{{ planInfo.contactName }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ planInfo.contactPhone }}</el-descriptions-item>
      <el-descriptions-item label="发布单位">{{ planInfo.publishDeptName }}</el-descriptions-item>
      <el-descriptions-item label="发布文号">{{ planInfo.documentNumber }}</el-descriptions-item>
      <el-descriptions-item label="发布日期">{{ parseTime(planInfo.publishTime, '{y}-{m}-{d}') }}</el-descriptions-item>
    </el-descriptions>
    <el-tabs type="card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-connection"></i> 预案衔接</span>
        <plan-connection ref="planConnection" :recordId="recordId" v-if="recordId" ></plan-connection>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-menu"></i> 应急组织机构</span>
        <org-tree ref="orgTree" :deptData="deptData" :planId="planInfo.planId"
                  v-if="planInfo.planId" :handleType="2"></org-tree>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-reading"></i> 应急处置简明手册</span>
        <related-file ref="relatedFile" :dataType="1" :handleType="2" v-if="recordId" :recordId="recordId"></related-file>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-document"></i> 应急文书</span>
        <related-file ref="relatedFile" :dataType="2" :handleType="2" v-if="recordId" :recordId="recordId"></related-file>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import planConnection from "../../planFiling/declare/planConnection";
import relatedFile from "../../planFiling/declare/relatedFile";
import {listDeptTree} from "@/api/system/dept";
import orgTree from "../../planFiling/declare/orgTree";
export default {
  dicts: ['4', '26'],
  components: {
    planConnection,
    relatedFile,
    orgTree
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格数据
      dataList: [],
      // 单位树选项
      deptData: [],
      // 弹出层标题
      title: "",
      // 表单参数
      form: {},
      // 总条数
      total: 0,
      planInfo: {},
      recordId:''
    };
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init(row) {
      this.recordId=row.recordId
      this.planInfo=row.planInfo
      this.planInfo.contactName=row.contactName
      this.planInfo.contactPhone=row.contactPhone
      this.getDeptData()
    },
    /** 查询单位 */
    getDeptData() {
      listDeptTree().then(response => {
        this.deptData = response.data;
      });
    },
  }
};
</script>
<style lang="scss">
.maintenance{
  .el-descriptions-item__label:not(.is-bordered-label) {
    margin-right: 10px;
    font-weight: bold;
  }
}
</style>
