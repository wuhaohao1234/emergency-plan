<template>
  <div class="app-container">
    <div class="search-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="修编单位" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="请输入修编单位"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="预案名称" label-width="80px" prop="revisionPlanName">
          <el-input
            v-model="queryParams.revisionPlanName"
            placeholder="请输入预案名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="文号" prop="documentNumber">
          <el-input
            v-model="queryParams.documentNumber"
            placeholder="请输入发布文号"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增计划
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!--列表-->
    <div class="list-container">
      <el-table :data="typeList" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column label="修编单位" align="left" :show-overflow-tooltip="true" prop="deptName"/>
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
        <el-table-column label="完成时间" align="center" prop="finishTime" width="180">
        </el-table-column>
        <el-table-column label="上报状态" align="center" width="100" prop="status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 'reported'">已上报</el-tag>
            <el-tag v-if="scope.row.status == 'draft'">草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              :disabled="scope.row.status =='reported'"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDetails(scope.row)"
            >详情
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              :disabled="scope.row.status =='reported'"
            >删除
            </el-button>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
          <el-form-item label="修编分类" prop="revisionType">
            <el-select v-model="form.revisionType" @change="changeTypeHandle" style="width: 100%"
                       placeholder="请选择修编分类" clearable
            >
              <el-option label="新增预案" value="1"/>
              <el-option label="预案修定" value="2"/>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修编单位">
              <el-input v-model="this.$store.state.user.deptName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预案名称" prop="revisionPlanName" v-if="form.revisionType==1">
              <el-input v-model="form.revisionPlanName" placeholder="请输入预案名称"/>
            </el-form-item>
            <el-form-item label="预案名称" prop="planId" v-if="form.revisionType==2">
              <el-select v-model="form.planId" style="width: 100%" placeholder="请选择预案名称" @change="changePlanHandle"
                         clearable
              >
                <el-option v-for="(item,index) in planList" :key="index" :label="item.planName" :value="item.planId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文号" prop="documentNumber">
              <el-input v-model="form.documentNumber" :disabled="form.revisionType==2" placeholder="请输入文号"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="完成时间" prop="finishTime">
              <el-date-picker
                style="width: 100%"
                value-format="yyyy-MM-dd"
                v-model="form.finishTime"
                type="date"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="form.contactName" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="受理部门" prop="reportingDeptIds">
              <el-cascader v-model="form.reportingDeptIds"
                           style="width: 100%"
                           :options="deptTree"
                           :props="{
							   checkStrictly: true,
							   emitPath: false,
							   label:'deptName',
							   value:'deptId'
							}"
                           clearable>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button type="primary" @click="escalation">上 报</el-button>
      </div>
    </el-dialog>

    <!--详情-->
    <el-dialog :title="title" :visible.sync="details" width="70%" append-to-body>
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            修编分类
          </template>
          {{ data.revisionType=='1'?'新增预案':'预案修定' }}
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
          {{ data.reportingDeptNames }}
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
import {plansList, getType, delType, addType, updateType, reportType} from "@/api/plans/revision";
import {listDeptTree} from "@/api/system/dept";
import { unReportPlans } from '@/api/plans/preplanRevision'

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
      // 修编计划表格数据
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
      data: {
        contactName: "",
        contactPhone: "",
        deptName: "",
        documentNumber: "",
        finishTime: "",
        remark: "",
        reportingDeptIds: [],
        reportingDeptNames: [],
        revisionId: null,
        revisionPlanName: "",
        status: ""
      },
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        deptName: undefined,
        revisionPlanName: undefined,
        documentNumber: undefined,
        contactPhone: undefined,
        contactName: undefined,
        finishTime: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        revisionPlanName: [
          {required: true, message: "预案名称不能为空", trigger: "blur"}
        ],
        // documentNumber: [
        //   {required: true, message: "文号不能为空", trigger: "blur"}
        // ],
        finishTime: [
          {required: true, message: "完成时间不能为空", trigger: "blur"}
        ],
        contactName: [
          {required: true, message: "联系人不能为空", trigger: "blur"}
        ],
        contactPhone: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        reportingDeptIds: [
          {required: true, message: "受理部门不能为空", trigger: "blur"}
        ],
        revisionType: [
          { required: true, message: '修编分类不能为空', trigger: 'blur' }
        ],
        planId: [
          { required: true, message: '预案名称不能为空', trigger: 'blur' }
        ],
      },
      planList: [],
      planInfo:{}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询修编计划类型列表 */
    getList() {
      this.loading = true;
      plansList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = response.data.content;
          this.total = response.data.totalElements
          this.getAllDepartment();
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
        revisionPlanName: undefined,
        documentNumber: undefined,
        finishTime: undefined,
        contactName: undefined,
        contactPhone: undefined,
        reportingDeptIds: undefined,
        remark: undefined,
        revisionType: '1',
        planId: undefined
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
    /** 新增按钮操作 */
    handleAdd() {
      this.getPlanList()
      this.reset();
      this.open = true;
      this.title = "添加修编计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.getPlanList(row.planInfo.planId)
      const revisionId = row.revisionId || this.ids
      getType(revisionId).then(response => {
        this.form = response.data;
        this.form.reportingDeptIds=response.data.reportingDeptIds[0]
        this.form.planId=response.data.planInfo.planId
        this.form.revisionPlanName = response.data.planInfo.planName
        this.form.documentNumber = response.data.planInfo.documentNumber
        this.open = true;
        this.title = "修改修编计划";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.form.deptName = this.$store.state.user.deptName
      this.form.reportingDeptIds=[this.form.reportingDeptIds]
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.revisionId != undefined) {
            updateType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const revisionIds = row.revisionId || this.ids;
      this.$modal.confirm('是否确认删除修编计划名称为"' + row.planInfo.planName + '"的数据项？').then(function () {
        return delType(revisionIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      const revisionId = row.revisionId || this.ids
      getType(revisionId).then(response => {
        this.data = response.data;
        this.planInfo=response.data.planInfo
        this.data.reportingDeptNames = this.data.reportingDeptNames.join(" ,")
        this.details = true;
        this.title = "修编计划详情";
      });
    },
    /** 上报按钮操作 */
    escalation() {
      this.form.deptName = this.$store.state.user.deptName
      this.form.reportingDeptIds=[this.form.reportingDeptIds]
      this.$refs["form"].validate(valid => {
        if (valid) {
          reportType(this.form).then(response => {
            this.$modal.msgSuccess("上报成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 查询所有部门*/
    getAllDepartment() {
      listDeptTree().then(response => {
        this.deptTree = response.data;
      })
    },
    /**
     * 获取未进行修编计划上报的预案
     */
    getPlanList(planId) {
      unReportPlans(planId).then(res => {
        this.planList = res.data
      })
    },
    /**
     * 修编类型改变
     */
    changeTypeHandle() {
      if (this.form.revisionType == '1') {
        this.form.revisionPlanName = ''
        this.form.planId = undefined
        this.form.documentNumber = undefined
      } else {
        this.form.revisionPlanName = ''
        this.form.planId = undefined
        this.form.documentNumber = undefined
      }
    },
    /**
     *选择预案
     */
    changePlanHandle() {
      if (this.form.planId) {
        let plan = this.planList.filter(item => item.planId == this.form.planId)
        this.form.revisionPlanName = plan.planName
        this.form.documentNumber = plan.documentNumber
      } else {
        this.form.revisionPlanName = ''
        this.form.documentNumber = undefined
      }
    }
  }
};
</script>
<style scoped lang="scss">
.plan-dialog-form {
  .el-input, .el-textarea {
    width: 220px;
  }
}
</style>
