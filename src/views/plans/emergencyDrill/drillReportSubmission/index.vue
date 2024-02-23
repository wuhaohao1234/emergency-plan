<template>
  <div class="app-container">
    <div class="search-container" >
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="承办单位" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="请输入承办单位"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="演练形式" prop="exerciseFormatFullPath">
          <el-select v-model="queryParams.exerciseFormatFullPath" placeholder="请选择演练形式" clearable>
            <el-option
              v-for="dict in dict.type[24]"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="演练规模" prop="exerciseScaleFullPath">
          <el-select v-model="queryParams.exerciseScaleFullPath" placeholder="请选择演练规模" clearable>
            <el-option
              v-for="dict in dict.type[25]"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="演练依据" prop="planId">-->
<!--          <el-select v-model="queryParams.planId" placeholder="请选择演练规模">-->
<!--            <el-option-->
<!--              v-for="item in plans"-->
<!--              :key="item.planId"-->
<!--              :label="item.planName"-->
<!--              :value="item.planId"-->
<!--              @keyup.enter.native="handleQuery">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" style="margin-left: 20px" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>
    </div>

    <!--列表-->
    <div class="list-container">
      <el-table :data="typeList" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column label="承办单位" min-width="180" :show-overflow-tooltip="true" align="left" prop="deptName" />
        <el-table-column label="演练依据" width="180" :show-overflow-tooltip="true" align="left" prop="planName" />
        <el-table-column label="受理部门" width="200" :show-overflow-tooltip="true" align="left" prop="reportingDeptNames"/>
        <el-table-column label="演练形式" width="120" align="center" prop="exerciseFormat.dictName">
          <template slot-scope="scope">
            <dict-tag :options="dict.type[24]" :value="scope.row.exerciseFormatFullPath"/>
          </template>
        </el-table-column>
        <el-table-column label="演练规模" width="120" align="center" prop="exerciseScale.dictName">
          <template slot-scope="scope">
            <dict-tag :options="dict.type[25]" :value="scope.row.exerciseScaleFullPath"/>
          </template>
        </el-table-column>
        <el-table-column label="报告移交时间" align="center" :show-overflow-tooltip="true" width="180" prop="reportTime"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetails(scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="getList"/>
    </div>

    <!--详情-->
    <el-dialog :title="title" :visible.sync="details" append-to-body width="70%">
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            承办单位
          </template>
          {{data.deptName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            演练形式
          </template>
          <dict-tag :options="dict.type[24]" :value="data.exerciseFormatFullPath"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            演练规模
          </template>
          <dict-tag :options="dict.type[25]" :value="data.exerciseScaleFullPath"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            演练时间
          </template>
          {{ data.exerciseStartTime }} - {{ data.exerciseEndTime }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练依据
          </template>
          {{data.planName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            联系人
          </template>
          {{data.contactName}}-{{data.contactPhone}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            联系电话
          </template>
          {{data.contactPhone}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            受理部门
          </template>
          {{data.reportingDeptNames}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            报告提交时间
          </template>
          {{data.reportTime}}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练内容
          </template>
          {{ data.content }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练脚本
          </template>
          <download-file v-if="data.planFileInfo1" v-for="item in data.planFileInfo1" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练方案
          </template>
          <download-file v-if="data.planFileInfo2" v-for="item in data.planFileInfo2" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练评估报告
          </template>
          <download-file v-if="data.planFileInfo3" v-for="item in data.planFileInfo3" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练总结
          </template>
          <download-file v-if="data.planFileInfo4" v-for="item in data.planFileInfo4" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            其他（请示报告、通知等）
          </template>
          <download-file v-if="data.planFileInfo5" v-for="item in data.planFileInfo5" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="details=false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { drillInfoList, getType,enDrillReportPage,enDrillReportInfo,drillReportExport,enDrillReportExport} from "@/api/plans/drillInfo";
import { recordQuery } from "@/api/plans/planRecord";
import fileDownload from "js-file-download";
import {listDeptTree} from "@/api/system/dept";
export default {
  name: "Dict",
  dicts: ["24","25","28"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 计划表格数据
      typeList: [],
      //演练形式
      exerciseFormat: [],
      //演练规模
      exerciseScale: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //详情弹出
      details: false,
      // 日期范围
      dateRange: [],
      //演练报告依据
      plans: [],
      //受理部门
      deptTree: [],
      //接收参数
      data:{
        assessmentReportFileInfo:"",
        contactName:"",
        contactPhone:"",
        content:"",
        deptName:"",
        drillId:null,
        exerciseEndTime:"",
        exerciseFormat:{
          dictName:"",
          dictNameFullPath:"",
          fullPath:""
        },
        exerciseScale:{
          dictName:"",
          dictNameFullPath:"",
          fullPath:""
        },
        reportSource:{
          dictName:"",
          dictNameFullPath:"",
          fullPath:""
        },
        exerciseStartTime:"",
        isPlan:"",
        otherFileInfo:"",
        planId:null,
        planName:"",
        programmeFileInfo:"",
        reportStatus:"",
        reportTime:"",
        reportingDeptIds:[],
        reportingDeptNames:[],
        scriptFileInfo:"",
        status:"",
        summaryFileInfo:""
      },
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        deptName: undefined,
        plan:{
          id:null
        },
        planDocumentNumber:undefined,
        exerciseFormatFullPath: undefined,
        exerciseScaleFullPath: undefined,
        reportSourceFullPath:undefined,
        contactPhone: undefined,
        contactName: undefined,
        finishTime: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      businessType:1
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询计划类型列表 */
    getList() {
      this.loading = true;
      this.businessType=sessionStorage.getItem('BUSINESS_TYPE');
      (this.businessType==1?drillInfoList:enDrillReportPage)(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = response.data.content;
          this.total = response.data.totalElements
          this.getCurrentDept();
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        drillId: undefined,
        drillPlanName: undefined,
        documentNumber: undefined,
        status: "draft",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 取消按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      const drillId = row.drillId || this.ids;
      (this.businessType==1?getType:enDrillReportInfo)(drillId).then(response => {
        this.data = response.data;
        this.data.reportingDeptNames = response.data.reportingDeptNames[0];
        this.details = true;
        this.title = "演练报告详情";
      });
    },
    /** 查询所有部门*/
    getAllDepartment(){
      listDeptTree().then(response => {
        this.deptTree=response.data;
      })
    },
    /** 查询所有演练报告依据*/
    getCurrentDept(){
      recordQuery().then(response => {
        this.plans=response.data;
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      (this.businessType==1?drillReportExport:enDrillReportExport)(this.addDateRange(this.queryParams, this.dateRange)).then(res=>{
        fileDownload(res, '演练报告.xlsx')
      })
    },
  }
};
</script>
