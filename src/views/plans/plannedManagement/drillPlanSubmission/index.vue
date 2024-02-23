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
<!--        <el-form-item label="演练依据" prop="plan">-->
<!--          <el-select v-model="queryParams.planId" placeholder="演练依据" clearable>-->
<!--            <el-option-->
<!--              v-for="item in plans"-->
<!--              :key="item.planId"-->
<!--              :label="item.planName"-->
<!--              :value="item.planId"-->
<!--              @keyup.enter.native="handleQuery">-->
<!--            </el-option>-->
<!--          </el-select>-->
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
        <el-form-item label="开始时间" prop="exerciseStartTime">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="queryParams.exerciseStartTime"
            type="date"
            placeholder="请选择日期" @keyup.enter.native="handleQuery">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="exerciseEndTime">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="queryParams.exerciseEndTime"
            type="date"
            placeholder="请选择日期" @keyup.enter.native="handleQuery">
          </el-date-picker>
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
          >新增计划</el-button>
        </el-col>
      </el-row>
    </div>

    <!--列表-->
    <div class="list-container">
      <el-table :data="typeList" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column label="承办单位" :show-overflow-tooltip="true" align="left" prop="deptName" />
        <el-table-column label="演练依据" :show-overflow-tooltip="true" align="left" prop="planName" />
        <el-table-column label="受理部门" :show-overflow-tooltip="true" align="left" prop="reportingDeptNames"/>
        <el-table-column label="演练形式" :show-overflow-tooltip="true" align="center" prop="exerciseFormat.dictName">
          <template slot-scope="scope">
            <dict-tag :options="dict.type[24]" :value="scope.row.exerciseFormatFullPath"/>
          </template>
        </el-table-column>
        <el-table-column label="演练规模" :show-overflow-tooltip="true" align="center" prop="exerciseScale.dictName">
          <template slot-scope="scope">
            <dict-tag :options="dict.type[25]" :value="scope.row.exerciseScaleFullPath"/>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" :show-overflow-tooltip="true"  width="200">
          <template slot-scope="scope">
            {{scope.row.exerciseStartTime}}~{{scope.row.exerciseEndTime}}
          </template>
        </el-table-column>
        <el-table-column label="上报状态" align="center" prop="status" width="80">
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
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDetails(scope.row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              :disabled="scope.row.status =='reported'"
            >删除</el-button>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" >
        <el-row>
          <el-col :span="12">
            <el-form-item label="承办单位">
              <el-input v-model="this.$store.state.user.deptName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="演练名称" prop="drillName">
              <el-input v-model="form.drillName" placeholder="请输入计划名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="演练形式" prop="exerciseFormatFullPath">
              <el-select style="width: 100%" v-model="form.exerciseFormatFullPath" placeholder="请选择演练形式" clearable>
                <el-option
                  v-for="dict in dict.type[24]"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="演练规模" prop="exerciseScaleFullPath">
              <el-select style="width: 100%" v-model="form.exerciseScaleFullPath" placeholder="请选择演练规模" clearable>
                <el-option
                  v-for="dict in dict.type[25]"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="exerciseStartTime">
              <el-date-picker
                style="width: 100%"
                value-format="yyyy-MM-dd"
                v-model="form.exerciseStartTime"
                type="date"
                :picker-options="pickerStartOptions"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="exerciseEndTime">
              <el-date-picker
                style="width: 100%"
                value-format="yyyy-MM-dd"
                v-model="form.exerciseEndTime"
                type="date"
                :picker-options="pickerEndOptions"
                placeholder="请选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="form.contactName" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="演练依据" prop="planId">
              <el-select style="width: 100%" v-model="form.planId" placeholder="请选择演练规模">
                <el-option
                  v-for="item in plans"
                  :key="item.planId"
                  :label="item.planName"
                  :value="item.planId">
                </el-option>
              </el-select>
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
							   multiple: true,
							   label:'deptName',
							   value:'deptId'
							}" clearable>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="演练内容" prop="content">
              <el-input v-model="form.content" type="textarea" :rows="1" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button type="primary" @click="escalation">上 报</el-button>
      </div>
    </el-dialog>

    <!--详情-->
    <el-dialog :title="title" :visible.sync="details"  width="70%"  append-to-body>
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
          {{data.reportingDeptNames}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            演练内容
          </template>
          {{data.content}}
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="()=>{this.details=false}" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {plansList, getType, delType, addType, reportType, updateType} from "@/api/plans/drill";
  import { currentDept } from "@/api/plans/preplanRevision";
  import { listDeptTree } from "@/api/system/dept";
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
        //演练计划依据
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
          planName:"",
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
          planId:null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          drillName: [
            { required: true, message: "演练名称不能为空", trigger: "blur" }
          ],
          exerciseFormatFullPath: [
            { required: true, message: "演练形式不能为空", trigger: "blur" }
          ],
          exerciseScaleFullPath: [
            { required: true, message: "演练规模不能为空", trigger: "blur" }
          ],
          exerciseStartTime: [
            { required: true, message: "演练开始时间不能为空", trigger: "blur" }
          ],
          exerciseEndTime: [
            { required: true, message: "演练结束时间不能为空", trigger: "blur" }
          ],
          contactName: [
            { required: true, message: "联系人不能为空", trigger: "blur" }
          ],
          contactPhone: [
            {
              required: true,
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ],
          planId: [
            { required: true, message: "演练计划依据不能为空", trigger: "blur" }
          ],
          reportingDeptIds: [
            { required: true, message: "受理部门不能为空", trigger: "blur" }
          ],
          content: [
            { required: true, message: "演练内容不能为空", trigger: "blur" }
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
            this.getAllDepartment()
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
          drillPlanName: undefined,
          exerciseFormatFullPath: undefined,
          exerciseScaleFullPath: undefined,
          exerciseStartTime: undefined,
          exerciseEndTime: undefined,
          contactName: undefined,
          contactPhone: undefined,
          planId: undefined,
          reportingDeptIds: undefined,
          content: undefined
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
        this.title = "添加计划";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        const drillId = row.drillId || this.ids
        getType(drillId).then(response => {
          this.form = response.data;
          this.form.exerciseFormatFullPath = +response.data.exerciseFormat.fullPath
          this.form.exerciseScaleFullPath = +response.data.exerciseScale.fullPath
          this.open = true;
          this.title = "修改计划";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.form.deptName=this.$store.state.user.deptName
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
        this.$modal.confirm('是否确认删除计划名称为"' + row.drillPlanName + '"的数据项？').then(function() {
          return delType(drillIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 详情按钮操作 */
      handleDetails(row) {
        const drillId = row.drillId || this.ids
        getType(drillId).then(response => {
          this.data = response.data;
          this.data.reportingDeptNames=this.data.reportingDeptNames.join(" ,")
          this.details = true;
          this.title = "演练计划详情";
        });
      },
      /** 上报按钮操作 */
      escalation() {
        this.form.deptName=this.$store.state.user.deptName
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
      getAllDepartment(){
        listDeptTree().then(response => {
          this.deptTree=response.data;
        })
      },
      /** 查询所有预案*/
      getCurrentDept(){
        currentDept().then(response => {
          this.plans=response.data;
        })
      }
    }
  };
</script>
<style scoped lang="scss">
  .plan-dialog-form{
    .el-input,.el-textarea{
      width: 220px;
    }
  }
</style>
