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
            />
          </el-select>
        </el-form-item>
        <el-form-item label="演练规模" prop="documentNumber">
          <el-select v-model="queryParams.exerciseScaleFullPath" placeholder="请选择演练规模" clearable>
            <el-option
              v-for="dict in dict.type[25]"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
<!--        <el-form-item label="演练依据" prop="plan">-->
<!--          <el-select v-model="queryParams.plan.planName" placeholder="演练依据">-->
<!--            <el-option-->
<!--              v-for="item in plans"-->
<!--              :key="item.planId"-->
<!--              :label="item.planName"-->
<!--              :value="item.planId">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="开始时间" prop="exerciseStartTime">-->
<!--          <el-date-picker-->
<!--            value-format="yyyy-MM-dd"-->
<!--            v-model="queryParams.exerciseStartTime"-->
<!--            type="date"-->
<!--            placeholder="请选择日期" @keyup.enter.native="handleQuery">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="结束时间" prop="exerciseEndTime">-->
<!--          <el-date-picker-->
<!--            value-format="yyyy-MM-dd"-->
<!--            v-model="queryParams.exerciseEndTime"-->
<!--            type="date"-->
<!--            placeholder="请选择日期" @keyup.enter.native="handleQuery">-->
<!--          </el-date-picker>-->
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
            @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="list-container">
      <!--列表-->
      <el-table :data="typeList" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column label="承办单位" align="left" prop="deptName" />
        <el-table-column label="演练依据" align="left" prop="planName" />
        <el-table-column label="受理部门" align="left" prop="reportingDeptNames"/>
        <el-table-column label="演练形式" align="center" prop="exerciseFormat.dictName">
          <template slot-scope="scope">
            <dict-tag :options="dict.type[24]" :value="scope.row.exerciseFormatFullPath"/>
          </template>
        </el-table-column>
        <el-table-column label="演练规模" align="center" prop="exerciseScale.dictName">
          <template slot-scope="scope">
            <dict-tag :options="dict.type[25]" :value="scope.row.exerciseScaleFullPath"/>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" align="center" prop="submitTime">
        </el-table-column>
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
    <el-dialog :title="title" :visible.sync="details" append-to-body  width="70%">
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            责任单位
          </template>
          {{data.deptName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            演练名称
          </template>
          {{data.drillName}}
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
            演练依据
          </template>
          {{data.planName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            开始时间
          </template>
          {{data.exerciseStartTime}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            结束时间
          </template>
          {{data.exerciseEndTime}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            联系人
          </template>
          {{data.contactName}}
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
          <span v-if="data.reportingDeptNames" v-for="(item,index) in data.reportingDeptNames">
            {{item}}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            演练内容
          </template>
          {{data.content}}
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="details=false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { plansDrillList,getType,enDrillPage,enDrillInfo,drillExport,enDrillExport} from "@/api/plans/drill";
import { currentDept } from "@/api/plans/preplanRevision";
import { listDeptTree } from "@/api/system/dept";
import fileDownload from "js-file-download";
export default {
  name: "Dict",
  dicts: ["3","24","25"],
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
      exerciseFormats: [],
      //演练规模
      exerciseScales: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //详情弹出
      details: false,
      // 日期范围
      dateRange: [],
      //预案依据
      plans: [],
      //受理部门
      deptTree: [],
      //接收参数
      data:{
        contactName:"",
        contactPhone:"",
        content:"",
        deptName:"",
        drillId:null,
        drillName:"",
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
        exerciseStartTime:"",
        planDocumentNumber:"",
        planId:null,
        reportingDeptIds:[],
        reportingDeptNames:[],
        status:"",
      },
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        deptName: undefined,
        exerciseFormatFullPath:undefined,
        exerciseScaleFullPath:undefined,
        planDocumentNumber:undefined,
        content:undefined,
        contactName:undefined,
        contactPhone:undefined,
        reportingDeptIds:undefined,
        exerciseStartTime:undefined,
        exerciseEndTime:undefined,
        plan:{
          id:null,
          planName:undefined
        },
      },
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
      (this.businessType==1?plansDrillList:enDrillPage)(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = response.data.content;
          this.total = response.data.totalElements
          this.getAllDepartment();
          this.getCurrentDept();
          this.loading = false;
        }
      );
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      const drillId = row.drillId || this.ids;
      (this.businessType==1?getType:enDrillInfo)(drillId).then(response => {
        this.data = response.data;
        this.details = true;
        this.title = "演练计划详情";
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
    /** 导出按钮操作 */
    handleExport() {
      (this.businessType==1?drillExport:enDrillExport)(this.addDateRange(this.queryParams, this.dateRange)).then(res=>{
        fileDownload(res, '演练计划.xlsx')
      })
    },
    /** 查询所有部门*/
    getAllDepartment(){
      listDeptTree().then(response => {
        this.deptTree=response.data;
      })
    },
    /** 查询所有预案依据*/
    getCurrentDept(){
      currentDept().then(response => {
        this.plans=response.data;
      })
    },
  }
};
</script>
