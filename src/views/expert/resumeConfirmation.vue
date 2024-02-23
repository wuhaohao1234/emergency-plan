<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="专家姓名" prop="expertName">
        <el-input v-model="queryParams.expertName" placeholder="请输入专家姓名" clearable style="width: 240px"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini"  icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button style="margin-left: 20px" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
      <el-table :data="typeList" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column label="专家姓名" width="150" align="left" prop="expertName">
          <template slot-scope="scope">
            {{scope.row.expertInfo.expertName}}
          </template>
        </el-table-column>
        <el-table-column label="工作内容及成果" min-width="180" align="left" prop="achievement" />
        <el-table-column label="工作时间" width="200"  prop="workStartTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.workStartTime,pattern)  + '\xa0至\xa0' +  parseTime(scope.row.workEndTime,pattern) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否确认" width="120" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status=='confirmed'" type="success">已确认</el-tag>
            <el-tag v-if="scope.row.status=='confirming'" type="info">未确认</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetails(scope.row)">详情</el-button>
            <el-button size="mini" type="text" v-if="scope.row.status=='confirming'" @click="confirmHandle(scope.row)">确认</el-button>
            <el-button size="mini" type="text" v-if="scope.row.status=='confirmed'" @click="cancelConfirmHandle(scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.size"
        @pagination="getList" />
    <!--详情-->
    <el-dialog :title="title" :visible.sync="details" width="70%" append-to-body :close-on-click-modal="false">
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            专家姓名
          </template>
          {{ form.expertInfo?form.expertInfo.expertName:'' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            专家电话
          </template>
          {{ form.expertInfo?form.expertInfo.phoneNumber:'' }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            工作内容及成果
          </template>
          {{ form.achievement }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            工作时间
          </template>
          {{ parseTime(form.workStartTime,pattern) + '\xa0至\xa0' + parseTime(form.workEndTime,pattern)}}
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="details = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
</style>

<script>
  import {
    enExpertResumeInfo,enExpertResumePage,enExpertResumeConfirm
  } from "@/api/expert/authentication";

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
        // 计划表格数据
        typeList: [],
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
        // 查询参数
        queryParams: {
          page: 1,
          size: 10,
          expertName: undefined,
          status: undefined
        },
        // 表单参数
        form: {
          exportInfo:{}
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询专家列表 */
      getList() {
        this.loading = true;
        enExpertResumePage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = response.data.content;
          this.total = response.data.totalElements
          this.loading = false;
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
      /** 详情按钮操作 */
      handleDetails(row) {
        const expertResumeId = row.expertResumeId
        enExpertResumeInfo(expertResumeId).then(response => {
          this.form = response.data;
          this.details = true;
          this.title = "专家履历详情";
        });
      },
      handleSizeChange(val) {
        this.query.size = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.query.page = val;
        this.getList()
      },
      //确认
      confirmHandle(row){
        this.$confirm('是否对当前专家履历进行确认？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          enExpertResumeConfirm(row.expertResumeId,1).then(res=>{
           this.$modal.msgSuccess('确认履历成功')
            this.getList()
          })
        }).catch(() => {
        });
      },
      //取消确认
      cancelConfirmHandle(row){
        this.$confirm('是否取消确认当前专家履历？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          enExpertResumeConfirm(row.expertResumeId,2).then(res=>{
            this.$modal.msgSuccess('取消确认成功')
            this.getList()
          })
        }).catch(() => {
        });
      }
    }
  };
</script>
