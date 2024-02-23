<template>
  <div class="app-container">
    <div class="search-container">
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
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" style="margin-left: 20px" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          style="margin-bottom: 10px"
        >计划外演练报告
        </el-button>
      </el-col>
    </div>

    <!--列表-->
    <div class="list-container">
      <el-table :data="typeList" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column label="承办单位" min-width="180" :show-overflow-tooltip="true" align="left" prop="deptName"/>
        <el-table-column label="演练依据" width="180" :show-overflow-tooltip="true" align="left" prop="planName"/>
        <el-table-column label="受理部门" width="180" :show-overflow-tooltip="true" align="left" prop="reportingDeptNames"/>
        <el-table-column label="演练形式" width="150" :show-overflow-tooltip="true" align="center" prop="exerciseFormat.dictName">
          <template slot-scope="scope">
            <dict-tag :options="dict.type[24]" :value="scope.row.exerciseFormatFullPath"/>
          </template>
        </el-table-column>
        <el-table-column label="演练规模" width="140" :show-overflow-tooltip="true" align="center" prop="exerciseScale.dictName">
          <template slot-scope="scope">
            <dict-tag :options="dict.type[25]" :value="scope.row.exerciseScaleFullPath"/>
          </template>
        </el-table-column>
        <el-table-column label="报告移交时间" width="150" :show-overflow-tooltip="true" align="center" prop="reportTime"/>
        <el-table-column label="上报状态" width="120" :show-overflow-tooltip="true" align="center" prop="reportStatus">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.reportStatus == 'reported'" type="success">已上报</el-tag>
            <el-tag v-if="scope.row.reportStatus == 'draft'">草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              :disabled="scope.row.reportStatus =='reported'"
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
              :disabled="scope.row.reportStatus =='reported'"
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

    <!--新增修改-->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="承办单位" prop="deptName">
              <el-input
                v-model="this.$store.state.user.deptName"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="演练形式" prop="exerciseFormatFullPath">
              <el-select v-model="form.exerciseFormatFullPath" placeholder="请选择演练形式" style="width: 100%">
                <el-option
                  v-for="dict in dict.type['24']"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="演练规模" prop="exerciseScaleFullPath">
              <el-select v-model="form.exerciseScaleFullPath" placeholder="请选择演练规模" style="width: 100%">
                <el-option
                  v-for="dict in dict.type['25']"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="演练依据" prop="planId">
              <el-select v-model="form.planId" placeholder="请选择演练演练依据" multiple style="width: 100%">
                <el-option
                  v-for="item in plans"
                  :key="item.planId"
                  :label="item.planName"
                  :value="item.planId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="演练开始时间" prop="exerciseStartTime">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="form.exerciseStartTime"
                :picker-options="pickerStartOptions"
                style="width: 100%"
                type="date"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="演练结束时间" prop="exerciseEndTime">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="form.exerciseEndTime"
                :picker-options="pickerEndOptions"
                style="width: 100%"
                type="date"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系人" prop="contactName">
              <el-input
                v-model="form.contactName"
                placeholder="请输入联系人"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input
                v-model="form.contactPhone"
                placeholder="请输入联系电话"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="受理部门" prop="reportingDeptIds">
                <el-cascader v-model="form.reportingDeptIds"
                             :options="deptTree"
                             :props="{
							   checkStrictly: true,
							   emitPath: false,
							   label:'deptName',
							   value:'deptId'
							}" style="width: 100%" @keyup.enter.native="handleQuery" clearable>
                </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="演练内容" prop="content">
              <el-input v-model="form.content"
                        type="textarea"
                        placeholder="请输入内容"
                        clearable
                        :rows="2">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="演练脚本" prop="planFileInfo1">
              <file-upload style="margin-left: 50px" :fileType="['docx','doc','pdf']" :value="form.planFileInfo1"
                           @input="getFile1"></file-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="演练方案" prop="planFileInfo2">
              <file-upload style="margin-left: 50px" :fileType="['docx','doc','pdf']" :value="form.planFileInfo2"
                           @input="getFile2"></file-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="演练评估报告" prop="assessmentReportFileInfo">
              <file-upload style="margin-left: 50px" :fileType="['docx','doc','pdf']" :value="form.planFileInfo3"
                           @input="getFile3"></file-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="演练总结" prop="planFileInfo4">
              <file-upload style="margin-left: 50px" :fileType="['docx','doc','pdf']" :value="form.planFileInfo4"
                           @input="getFile4"></file-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="其他（请示报告、通知等）" prop="planFileInfo5">
              <file-upload style="margin-left: 50px" :fileType="['docx','doc','pdf']" :value="form.planFileInfo5"
                           @input="getFile5"></file-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px;">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button type="primary" @click="escalation">上 报</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--详情-->
    <el-dialog :title="title" :visible.sync="details" width="70%" append-to-body>
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            承办单位
          </template>
          {{ this.$store.state.user.deptName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            演练形式
          </template>
          <dict-tag :options="dict.type['24']" :value="form.exerciseFormatFullPath"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            演练规模
          </template>
          <dict-tag :options="dict.type['25']" :value="form.exerciseScaleFullPath"/>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练依据
          </template>
          {{ form.planName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            演练时间
          </template>
          {{ form.exerciseStartTime }} - {{ form.exerciseEndTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            联系人
          </template>
          {{ form.contactName }} - {{ form.contactPhone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            受理部门
          </template>
          {{ form.reportingDeptNames }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练内容
          </template>
          {{ form.content }}
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练脚本
          </template>
          <download-file v-if="form.planFileInfo1" v-for="item in form.planFileInfo1" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练方案
          </template>
          <download-file v-if="form.planFileInfo2" v-for="item in form.planFileInfo2" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练评估报告
          </template>
          <download-file v-if="form.planFileInfo3" v-for="item in form.planFileInfo3" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            演练总结
          </template>
          <download-file v-if="form.planFileInfo4" v-for="item in form.planFileInfo4" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            其他（请示报告、通知等）
          </template>
          <download-file v-if="form.planFileInfo5" v-for="item in form.planFileInfo5" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import {plansList, getType, updateType, addType, delType, reportType} from "@/api/plans/drillInfo";
import {recordQuery} from "@/api/plans/planRecord";
import {listDeptTree} from "@/api/system/dept";
import {currentDept} from "@/api/plans/preplanRevision";

export default {
  name: "Dict",
  dicts: ["24", "25", "28"],
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
      data: {
        assessmentReportFileInfo: [],
        contactName: "",
        contactPhone: "",
        content: "",
        deptName: "",
        drillId: null,
        exerciseEndTime: "",
        exerciseFormat: {
          dictName: "",
          dictNameFullPath: "",
          fullPath: ""
        },
        exerciseScale: {
          dictName: "",
          dictNameFullPath: "",
          fullPath: ""
        },
        reportSource: {
          dictName: "",
          dictNameFullPath: "",
          fullPath: ""
        },
        exerciseStartTime: "",
        isPlan: "",
        otherFileInfo: "",
        planId: null,
        planName: "",
        programmeFileInfo: [],
        reportStatus: "",
        reportTime: "",
        reportingDeptIds: [],
        reportingDeptNames: [],
        scriptFileInfo: [],
        status: "",
        summaryFileInfo: []
      },
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        deptName: undefined,
        planName: undefined,
        planDocumentNumber: undefined,
        exerciseFormatFullPath: undefined,
        exerciseScaleFullPath: undefined,
        reportSourceFullPath: undefined,
        contactPhone: undefined,
        contactName: undefined,
        exerciseStartTime: undefined,
        exerciseEndTime: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        drillName: [
          {required: true, message: "演练名称不能为空", trigger: "blur"}
        ],
        exerciseFormatFullPath: [
          {required: true, message: "演练形式不能为空", trigger: "blur"}
        ],
        exerciseScaleFullPath: [
          {required: true, message: "演练规模不能为空", trigger: "blur"}
        ],
        planId: [
          {required: true, message: "演练依据不能为空", trigger: "blur"}
        ],
        reportSourceFullPath: [
          {required: true, message: "计划来源不能为空", trigger: "blur"}
        ],
        exerciseStartTime: [
          {required: true, message: "演练开始时间不能为空", trigger: "blur"}
        ],
        exerciseEndTime: [
          {required: true, message: "演练结束时间不能为空", trigger: "blur"}
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
        content: [
          {required: true, message: "演练内容不能为空", trigger: "blur"}
        ],
        assessmentReportFileInfo: [
          {required: true, message: "演练评估报告不能为空", trigger: "blur"}
        ]
      },
      // 选择的开始日期
      pickerStartOptions: {
        disabledDate: (time) => {
          if (this.form.exerciseEndTime) {
            return time.getTime() > new Date(this.form.exerciseEndTime + ' 23:59:59').getTime()
          }
        }
      },
      // 选择的结束日期
      pickerEndOptions: {
        disabledDate: (time) => {
          if (this.form.exerciseStartTime) {
            return time.getTime() < new Date(this.form.exerciseStartTime + ' 00:00:00').getTime()
          }
        }
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询计划类型列表 */
    getList() {
      this.loading = true;
      plansList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = response.data.content;
          this.total = response.data.totalElements
          this.getAllDepartment();
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
        exerciseFormatFullPath: undefined,
        exerciseScaleFullPath: undefined,
        planId: undefined,
        exerciseStartTime: undefined,
        exerciseEndTime: undefined,
        contactName: undefined,
        contactPhone: undefined,
        reportingDeptIds: [],
        content: undefined,
        programmeFileInfo: [],
        assessmentReportFileInfo: [],
        summaryFileInfo: [],
        otherFileInfo: [],
        planFileInfo1: [],
        planFileInfo2: [],
        planFileInfo3: [],
        planFileInfo4: [],
        planFileInfo5: [],
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
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
      this.reset();
      this.open = true;
      this.title = "添加演练报告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const drillId = row.drillId || this.ids
      getType(drillId).then(response => {
        this.form = response.data;
        let plan = [];
        response.data.planId.split(',').forEach(item => {
          plan.push(+item);
        });
        this.form.planId = plan;
        this.form.reportingDeptIds = response.data.reportingDeptIds[0];
        this.form.exerciseFormatFullPath = +response.data.exerciseFormat.fullPath
        this.form.exerciseScaleFullPath = +response.data.exerciseScale.fullPath
        this.form.planFileInfo1 = response.data.scriptFileInfo ? JSON.parse(response.data.scriptFileInfo) : undefined
        this.form.planFileInfo2 = response.data.programmeFileInfo ? JSON.parse(response.data.programmeFileInfo) : undefined
        this.form.planFileInfo3 = response.data.assessmentReportFileInfo ? JSON.parse(response.data.assessmentReportFileInfo) : undefined
        this.form.planFileInfo4 = response.data.summaryFileInfo ? JSON.parse(response.data.summaryFileInfo) : undefined
        this.form.planFileInfo5 = response.data.otherFileInfo ? JSON.parse(response.data.otherFileInfo) : undefined
        this.open = true;
        this.title = "修改演练报告";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      let plan = "";
      plan = this.form.planId.join(',');
      this.form.planId = plan;
      let depet = [];
      depet.push(this.form.reportingDeptIds);
      this.form.reportingDeptIds = depet;
      this.form.deptName = this.$store.state.user.deptName
      this.form.scriptFileInfo = this.form.planFileInfo1 ? JSON.stringify(this.form.planFileInfo1) : ''
      this.form.programmeFileInfo = this.form.planFileInfo2 ? JSON.stringify(this.form.planFileInfo2) : ''
      this.form.assessmentReportFileInfo = this.form.planFileInfo3 ? JSON.stringify(this.form.planFileInfo3) : ''
      this.form.summaryFileInfo = this.form.planFileInfo4 ? JSON.stringify(this.form.planFileInfo4) : ''
      this.form.otherFileInfo = this.form.planFileInfo5 ? JSON.stringify(this.form.planFileInfo5) : ''
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.drillId != undefined) {
            addType(this.form).then(response => {
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
      const drillIds = row.drillId || this.ids;
      this.$modal.confirm('是否确认删除演练报告编号为"' + drillIds + '"的数据项？').then(function () {
        return delType(drillIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      this.reset();
      const drillId = row.drillId || this.ids
      getType(drillId).then(response => {
        this.form = response.data;
        this.form.reportingDeptNames = response.data.reportingDeptNames[0];
        this.form.exerciseFormatFullPath = +response.data.exerciseFormat.fullPath
        this.form.exerciseScaleFullPath = +response.data.exerciseScale.fullPath
        this.form.planFileInfo1 = response.data.scriptFileInfo ? JSON.parse(response.data.scriptFileInfo) : undefined
        this.form.planFileInfo2 = response.data.programmeFileInfo ? JSON.parse(response.data.programmeFileInfo) : undefined
        this.form.planFileInfo3 = response.data.assessmentReportFileInfo ? JSON.parse(response.data.assessmentReportFileInfo) : undefined
        this.form.planFileInfo4 = response.data.summaryFileInfo ? JSON.parse(response.data.summaryFileInfo) : undefined
        this.form.planFileInfo5 = response.data.otherFileInfo ? JSON.parse(response.data.otherFileInfo) : undefined
        this.details = true;
        this.title = "演练报告详情";
      });
    },
    /** 上报按钮操作 */
    escalation() {
      this.$refs["form"].validate(valid => {
        let plan = "";
        plan = this.form.planId.join(',');
        this.form.planId = plan;
        let depet = [];
        depet.push(this.form.reportingDeptIds);
        this.form.reportingDeptIds = depet;
        this.form.deptName = this.$store.state.user.deptName
        this.form.scriptFileInfo = this.form.planFileInfo1 ? JSON.stringify(this.form.planFileInfo1) : ''
        this.form.programmeFileInfo = this.form.planFileInfo2 ? JSON.stringify(this.form.planFileInfo2) : ''
        this.form.assessmentReportFileInfo = this.form.planFileInfo3 ? JSON.stringify(this.form.planFileInfo3) : ''
        this.form.summaryFileInfo = this.form.planFileInfo4 ? JSON.stringify(this.form.planFileInfo4) : ''
        this.form.otherFileInfo = this.form.planFileInfo5 ? JSON.stringify(this.form.planFileInfo5) : ''
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
    /** 查询所有演练报告依据*/
    getCurrentDept() {
      // recordQuery().then(response => {
      currentDept().then(response => {
        this.plans = response.data;
      })
    },
    getFile1(file) {
      this.form.planFileInfo1 = file
    },
    getFile2(file) {
      this.form.planFileInfo2 = file
    },
    getFile3(file) {
      this.form.planFileInfo3 = file
    },
    getFile4(file) {
      this.form.planFileInfo4 = file
    },
    getFile5(file) {
      this.form.planFileInfo5 = file
    }
  }
};
</script>
