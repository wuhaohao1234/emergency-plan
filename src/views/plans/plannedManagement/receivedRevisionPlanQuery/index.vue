<template>
  <div class="app-container">
    <div class="search-container" >
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="修编单位" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="请输入承办单位"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="预案名称" prop="revisionPlanName">
          <el-input
            v-model="queryParams.revisionPlanName"
            placeholder="请输入预案名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="发布文号" prop="documentNumber">
          <el-input
            v-model="queryParams.documentNumber"
            placeholder="请输入发布文号"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
<!--        <el-form-item label="完成时间"  >-->
<!--          <el-date-picker-->
<!--            v-model="dateRange"-->
<!--            style="width: 240px"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            type="daterange"-->
<!--            range-separator="-"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--          ></el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="填报部门" prop="deptName">-->
<!--          <el-input-->
<!--            v-model="queryParams.deptName"-->
<!--            placeholder="重庆市应急管理局"-->
<!--            disabled-->
<!--            style="width: 240px"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="联系人" prop="contactName">-->
<!--          <el-input-->
<!--            v-model="queryParams.contactName"-->
<!--            placeholder="请输入联系人"-->
<!--            clearable-->
<!--            style="width: 240px"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="联系电话" prop="contactPhone">-->
<!--          <el-input-->
<!--            v-model="queryParams.contactPhone"-->
<!--            placeholder="请输入联系电话"-->
<!--            clearable-->
<!--            style="width: 240px"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="受理部门" prop="reportingDeptIds">-->
<!--          <el-cascader v-model="queryParams.reportingDeptIds"-->
<!--                       :options="deptTree"-->
<!--                       :props="{-->
<!--							   checkStrictly: true,-->
<!--							   multiple: true,-->
<!--							   label:'deptName',-->
<!--							   value:'deptId'-->
<!--							}" @keyup.enter.native="handleQuery" clearable>-->
<!--          </el-cascader>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="exportHandle"
          >导出
          </el-button>
        </el-col>
      </el-row>
    </div>

    <div class="list-container">
      <!--列表-->
      <el-table :data="typeList" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column label="修编单位" :show-overflow-tooltip="true" align="left" prop="deptName" />
        <el-table-column label="预案名称" align="left" :show-overflow-tooltip="true" prop="revisionPlanName">
          <template slot-scope="scope">
            {{scope.row.planInfo.planName}}
          </template>
        </el-table-column>
        <el-table-column label="受理部门" align="left" :show-overflow-tooltip="true" prop="reportingDeptNames"/>
        <el-table-column label="文号" align="left" prop="documentNumber" width="120">
          <template slot-scope="scope">
            {{scope.row.planInfo.documentNumber}}
          </template>
        </el-table-column>
        <el-table-column label="完成时间" align="center" prop="finishTime" width="180"/>
        <el-table-column label="联系人" align="center" prop="contactName" :show-overflow-tooltip="true" width="120"/>
        <el-table-column label="联系电话" align="center" prop="contactPhone" width="150"/>
        <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
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
    <el-dialog :title="title" :visible.sync="details"  width="70%" append-to-body>
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            修编分类
          </template>
          {{ data.revisionType=='1'?'新增预案':'预案修编' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            修编单位
          </template>
          {{ data.deptName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            预案名称
          </template>
          {{ planInfo.planName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            受理部门
          </template>
          <span v-if="data.reportingDeptNames" v-for="(item,index) in data.reportingDeptNames">
            {{item}}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            文号
          </template>
          {{ planInfo.documentNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            完成时间
          </template>
          {{ data.finishTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            联系人
          </template>
          {{ data.contactName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            联系电话
          </template>
          {{ data.contactPhone }}
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{this.details=false}" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { plansRevisionList,getType,enRevisionPage,enRevisionInfo,revisionExport,enRevisionExport} from "@/api/plans/revision";
import { listDeptTree } from "@/api/system/dept";
import fileDownload from "js-file-download";
export default {
  name: "Dict",
  dicts: ["3"],
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
      // 预案表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //详情弹出
      details: false,
      // 日期范围
      dateRange: [],
      //受理部门
      deptTree: [],
      //接收参数
      data:{
        contactName:"",
        contactPhone:"",
        deptName:"",
        documentNumber:"",
        finishTime:"",
        remark:"",
        reportingDeptIds:[],
        reportingDeptNames:[],
        revisionId:null,
        revisionPlanName:"",
        status:""
      },
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        deptName:undefined,
        revisionPlanName: undefined,
        documentNumber: undefined,
        contactPhone: undefined,
        contactName: undefined,
        finishTime: undefined,
        status: undefined
      },
      businessType:1,
      planInfo:{}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询预案类型列表 */
    getList() {
      this.loading = true;
      this.businessType=sessionStorage.getItem('BUSINESS_TYPE');
      (this.businessType==1?plansRevisionList:enRevisionPage)(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = response.data.content;
          this.total = response.data.totalElements
          this.getAllDepartment();
          this.loading = false;
        }
      );
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      const revisionId = row.revisionId || this.ids;
      (this.businessType==1?getType:enRevisionInfo)(revisionId).then(response => {
        this.data = response.data;
        this.planInfo=response.data.planInfo
        this.details = true;
        this.title = "修编计划详情";
      });
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
    /** 查询所有部门*/
    getAllDepartment(){
      listDeptTree().then(response => {
        this.deptTree=response.data;
      })
    },
  /**
   * 导出
   */
  exportHandle(){
    (this.businessType==1?revisionExport:enRevisionExport)(this.queryParams).then(res=>{
      fileDownload(res, '修编计划.xlsx')
    })
  }
  }
};
</script>
