<template>
  <div class="app-container">
    <div class="search-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="编制单位" prop="preparationDeptName">
          <el-input
            v-model="queryParams.preparationDeptName"
            placeholder="请输入编制单位"
            clearable
            style="width: 210px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="预案名称" prop="planName">
          <el-input
            v-model="queryParams.planName"
            placeholder="请输入预案名称"
            clearable
            style="width: 210px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="事件类别" prop="emergencyTypeList">
          <el-cascader
            collapse-tags
            v-model="queryParams.emergencyTypeList"
            style="width: 300px;"
            :options="options"
            :props="props"
            placeholder="请选择事件类别"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="行政级别" prop="planSystemFullPath">
          <el-select v-model="queryParams.planSystemFullPath" placeholder="请选择行政级别" clearable>
            <el-option
              v-for="dict in (businessType==1 ?dict.type['26']:dict.type['525'])"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报告来源" prop="reportSourceFullPath">
          <el-select v-model="queryParams.reportSourceFullPath" placeholder="请选择报告来源" clearable>
            <el-option
              v-for="dict in dict.type[28]"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" style="margin-left: 20px" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--列表-->
    <div class="list-container">
      <el-table :data="typeList" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column label="预案名称" min-width="180" align="left" :show-overflow-tooltip="true"
                         prop="planInfo.planName"/>
        <el-table-column label="事件类别" width="180" align="left" prop="planInfo.emergencyTypeFullPath"
                         :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tag style="margin-right: 10px"
                    v-for="(item,index) in buildTypeLabel(scope.row.planInfo.emergencyTypeFullPath)" :key="index">
              <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
              <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])"
                                              :value="item[1]"/></span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="行政级别" width="180" align="left" :show-overflow-tooltip="true"
                         prop="planInfo.planSystemFullPath">
          <template slot-scope="scope">
            <dict-tag :options="(businessType==1?dict.type['26']:dict.type['525'])"
                      :value="scope.row.planInfo.planSystemFullPath"/>
          </template>
        </el-table-column>
        <el-table-column label="编制单位" width="180" align="left" :show-overflow-tooltip="true"
                         prop="planInfo.preparationDeptName">
          <template slot-scope="scope">
            <span>{{scope.row.planInfo.preparationDeptName||scope.row.deptName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" align="left" prop="submitTime" width="180"/>
        <el-table-column label="状态" align="center" width="120" prop="assessStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.confirmTime!=null">
              <el-tag type="success">已确定</el-tag>
            </span>
            <span v-else>
            <el-tag v-if="scope.row.assessStatus == 'adviced'" type="success">已建议</el-tag>
            <el-tag v-if="scope.row.assessStatus == 'draft'">未建议</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetails(scope.row)"
            >详情
            </el-button>
            <el-button size="mini" type="text"
                       :disabled="scope.row.confirmTime!=null||scope.row.assessStatus =='adviced'"
                       @click="confirmHandle(scope.row)">确认
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="advice(scope.row)"
              :disabled="scope.row.assessStatus =='adviced'||scope.row.confirmTime!=null"
            >建议
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

    <!--评估详情-->
    <el-dialog :title="title" :visible.sync="details" width="70%" append-to-body>
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            预案名称
          </template>
          {{ form.planName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            事件类别
          </template>
          <el-tag v-if="form.emergencyTypeFullPath" style="margin-right: 10px"
                  v-for="(item,index) in buildTypeLabel(form.emergencyTypeFullPath)" :key="index">
            <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
            <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])"
                                            :value="item[1]"/></span>
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            行政级别
          </template>
          <dict-tag :options="(businessType==1?dict.type['26']:dict.type['525'])" :value="form.planSystemFullPath"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            编制单位
          </template>
          {{ this.$store.state.user.deptName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            提交部门
          </template>
          {{ form.reportingDeptName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            联系人
          </template>
          {{ form.contactName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            联系电话
          </template>
          {{ form.contactPhone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            评估报告
          </template>
          <download-file v-if="form.planFileInfo" v-for="item in form.planFileInfo" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
      </el-descriptions>
      <br><span>(一) 有关法律法规、标准、上级预案内容发生变化</span><br/>
      <el-row>
        <el-col :span="18">
          <p><b>简要说明:</b><span style="margin-left: 10px">{{ form.change1 }}</span></p>
        </el-col>
        <el-col :span="6">
          <span><b>判定结果:</b></span>
          <el-tag v-if="form.decide1==0" type="success">是</el-tag>
          <el-tag v-if="form.decide1==1" type="danger">否</el-tag>
        </el-col>
      </el-row>
      <br><span>(二) 应急指挥机构及其职责发生重大调整</span><br/>
      <el-row>
        <el-col :span="18">
          <p><b>简要说明:</b><span style="margin-left: 10px">{{ form.change2 }}</span></p>
        </el-col>
        <el-col :span="6">
          <span><b>判定结果:</b></span>
          <el-tag v-if="form.decide2==0" type="success">是</el-tag>
          <el-tag v-if="form.decide2==1" type="danger">否</el-tag>
        </el-col>
      </el-row>
      <br><span>(三) 面临的风险发生重大变化</span><br/>
      <el-row>
        <el-col :span="18">
          <p><b>简要说明:</b><span style="margin-left: 10px">{{ form.change3 }}</span></p>
        </el-col>
        <el-col :span="6">
          <span><b>判定结果:</b></span>
          <el-tag v-if="form.decide3==0" type="success">是</el-tag>
          <el-tag v-if="form.decide3==1" type="danger">否</el-tag>
        </el-col>
      </el-row>
      <br><span>(四) 重要应急资源发生重大变化</span><br/>
      <el-row>
        <el-col :span="18">
          <p><b>简要说明:</b><span style="margin-left: 10px">{{ form.change4 }}</span></p>
        </el-col>
        <el-col :span="6">
          <span><b>判定结果:</b></span>
          <el-tag v-if="form.decide4==0" type="success">是</el-tag>
          <el-tag v-if="form.decide4==1" type="danger">否</el-tag>
        </el-col>
      </el-row>
      <br><span>(五) 预案中的其他重要信息发生变化</span><br/>
      <el-row>
        <el-col :span="18">
          <p><b>简要说明:</b><span style="margin-left: 10px">{{ form.change5 }}</span></p>
        </el-col>
        <el-col :span="6">
          <span><b>判定结果:</b></span>
          <el-tag v-if="form.decide5==0" type="success">是</el-tag>
          <el-tag v-if="form.decide5==1" type="danger">否</el-tag>
        </el-col>
      </el-row>
      <br><span>(六) 在突发事件实际应对和应急演练中发现问题需要做出重大调整</span><br/>
      <el-row>
        <el-col :span="18">
          <p><b>简要说明:</b><span style="margin-left: 10px">{{ form.change6 }}</span></p>
        </el-col>
        <el-col :span="6">
          <span><b>判定结果:</b></span>
          <el-tag v-if="form.decide6==0" type="success">是</el-tag>
          <el-tag v-if="form.decide6==1" type="danger">否</el-tag>
        </el-col>
      </el-row>
      <br><span>(七) 应急预案编制单位认为应修订的其他情况</span><br/>
      <el-row>
        <el-col :span="18">
          <p><b>简要说明:</b><span style="margin-left: 10px">{{ form.change7 }}</span></p>
        </el-col>
        <el-col :span="6">
          <span><b>判定结果:</b></span>
          <el-tag v-if="form.decide7==0" type="success">是</el-tag>
          <el-tag v-if="form.decide7==1" type="danger">否</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <download-file v-if="form.planDrillFile" v-for="item in form.planDrillFile" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span><b>评估结论:</b></span>
          <el-tag v-if="form.conclusion==0">暂不修订</el-tag>
          <el-tag v-if="form.conclusion==1">重新修订</el-tag>
          <!--          <el-tag v-if="form.conclusion==2">重新修订不审核</el-tag>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span><b>修订完成时间:</b><span style="margin-left: 10px">{{ form.assessTime }}</span></span>
        </el-col>
        <el-col :span="12">
          <span><b>建议部门:</b></span>
          <el-tag v-show="form.assessDeptName">{{ form.assessDeptName }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p><b>评估建议:</b><span style="margin-left: 10px">{{ form.assess }}</span></p>
        </el-col>
      </el-row>
    </el-dialog>

    <!--建议-->
    <el-dialog :title="title" :visible.sync="advise" append-to-body width="70%">
      <el-form :model="form" :rules="rules" ref="form" size="small" :inline="true" label-width="120px">
        <el-form-item label="预案名称:" prop="planId">
          <el-select v-model="form.planId" placeholder="请选择预案" disabled>
            <el-option
              v-for="item in plans"
              :key="item.planId"
              :label="item.planName"
              :value="item.planId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件类别" prop="emergencyTypeFullPath">
          <el-cascader
            v-model="form.emergencyTypeFullPath"
            style="width: 100%;"
            :options="options"
            :props="props"
            placeholder="请选择事件类别"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="行政级别" prop="planSystemFullPath">
          <el-select v-model="form.planSystemFullPath" placeholder="请选择行政级别" disabled>
            <el-option
              v-for="dict in (businessType==1?dict.type['26']:dict.type['525'])"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="编制单位:" prop="preparedBy">
          <el-input
            v-model="form.preparedBy"
            placeholder="请输入修编单位"
            disabled
            style="width: 210px"
          />
        </el-form-item>
        <el-form-item label="提交部门:" prop="reportingDeptId">
          <el-cascader v-model="form.reportingDeptId"
                       :options="deptTree"
                       :props="{
							   checkStrictly: true,
							   emitPath: false,
							   label:'deptName',
							   value:'deptId'
							}" style="width: 210px" disabled>
          </el-cascader>
        </el-form-item>
        <el-form-item label="联系人:" prop="contactName">
          <el-input
            v-model="form.contactName"
            placeholder="请输入联系人"
            disabled
            style="width: 210px"
          />
        </el-form-item>
        <el-form-item label="联系电话:" prop="contactPhone">
          <el-input
            v-model="form.contactPhone"
            placeholder="请输入联系电话"
            disabled
            style="width: 210px"
          />
        </el-form-item>
        <el-form-item label="评估报告:" prop="assessReportFileInfo">
          <file-upload :value="form.planFileInfo" :fileType="['doc','pdf']" @input="getFile" disabled>
          </file-upload>
        </el-form-item>
        <el-form-item label="评估建议" prop="content">
          <el-input v-model="form.assess"
                    type="textarea"
                    style="width: 580px"
                    placeholder="请输入内容">
          </el-input>
        </el-form-item>
        <el-form-item label="受理部门:" prop="assessDeptId">
          <el-input
            v-model="this.$store.state.user.deptName"
            placeholder="请输入修编单位"
            style="width: 210px"
          />
        </el-form-item>
        <div class="buttons" style="margin-top: 20px; text-align:center;">
          <el-button type="primary" @click="submitForm">提交建议</el-button>
          <el-button type="primary" style="margin-left: 150px" @click="cancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<style>
.el-upload-list {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 900px;
}
</style>
<script>
import {
  assessList,
  getType,
  plansList,
  adviceType,
  confirmAssess,
  enConfirmAssess,
  enAssessPage,
  enAssessInfo,
  enAssessAdvice
} from "@/api/plans/assess";
import {listDeptTree} from "@/api/system/dept";
import {recordQuery} from "@/api/plans/planRecord";
import {getDicts} from "@/api/system/dict/data";

export default {
  name: "Dict",
  dicts: ["4", "26", "525", "28", '601', '608', '611', '622','662'],
  data() {
    return {
      radio: '1',
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
      exerciseFormats: undefined,

      plans: [],
      // 总条数
      total: 0,
      // 预案表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      rule: false,
      //建议弹出
      advise: false,
      //详情弹出
      details: false,
      // 事件类别
      emergencyTypes: [],
      // 行政级别
      planSystemTypes: [],
      // 报告来源
      reportSources: [],
      // 日期范围
      dateRange: [],
      //受理部门
      deptTree: [],
      //接收参数
      data: {
        assessId: null,
        assess: "",
        assessDeptName: "",
        assessReportFileInfo: "",
        assessTime: "",
        conclusion: "",
        contactName: "",
        contactPhone: "",
        change1: "",
        change2: "",
        change3: "",
        change4: "",
        change5: "",
        change6: "",
        change7: "",
        decide1: "",
        decide2: "",
        decide3: "",
        decide4: "",
        decide5: "",
        decide6: "",
        decide7: "",
        isConfirm: "",
        planInfo: {
          documentNumber: "",
          emergencyType: {
            dicId: null,
            dictName: "",
            dictNameFullPath: "",
            fullPath: ""
          },
          planId: "",
          planLevel: "",
          planName: "",
          planSystemType: {
            dicId: null,
            dictName: "",
            dictNameFullPath: "",
            fullPath: ""
          },
          preparationDeptId: "",
          preparationDeptName: "",
          recordStatus: "",
          recordedTime: ""
        },
        preparedBy: "",
        recordedDay: "",
        status: ""
      },
      options: [],
      props: {multiple: true},
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        preparedBy: undefined,
        planName: undefined,
        emergencyTypeFullPath: undefined,
        planSystemFullPath: undefined,
        reportSourceFullPath: undefined,
        reportingDeptId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        assess: [
          {required: true, message: "评估建议不能为空", trigger: "blur"}
        ]
      },
      businessType: 1
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询预案类型列表 */
    getList() {
      this.loading = true;
      this.businessType = sessionStorage.getItem('BUSINESS_TYPE');
      (this.businessType == 1 ? assessList : enAssessPage)(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = response.data.content;
          this.getAllDepartment()
          this.getCurrentDept()
          this.buildOptions();
          this.total = response.data.totalElements
          this.loading = false;
        }
      );
    },
    /**
     *构建事件类别
     */
    buildOptions() {
      getDicts(4).then(res => {
        this.options = res.data
        this.options.forEach(item => {
          item.label = item.dictName
          item.value = item.dictId
          switch (item.dictId) {
            case 274:
              item.children = Object.values(this.dict.type['601'])
              break;
            case 275:
              item.children = Object.values(this.dict.type['608'])
              break;
            case 276:
              item.children = Object.values(this.dict.type['611'])
              break;
            case 277:
              item.children = Object.values(this.dict.type['622'])
              break;
            case 661:
              item.children = Object.values(this.dict.type['662'])
              break;
          }
        })
      })
    },
    /**
     * 构建类型信息
     */
    buildTypeLabel(val) {
      if (val) {
        let pType = val.split(';');
        let typeList = []
        pType.filter(Boolean).forEach(item => {
          let arr = item.split(',')
          typeList.push(arr.map(Number));
        })
        return typeList;
      }
    },
    /**
     * 获取对应字典
     * @param val
     */
    getOptions(val) {
      let options = undefined
      switch (val) {
        case 274:
          options = this.dict.type['601']
          break;
        case 275:
          options = this.dict.type['608']
          break;
        case 276:
          options = this.dict.type['611']
          break;
        case 277:
          options = this.dict.type['622']
          break;
        case 661:
          options = this.dict.type['662']
          break;
      }
      return options;
    },
    // 取消按钮
    cancel() {
      this.advise = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        planId: undefined,
        emergencyTypeFullPath: undefined,
        planSystemFullPath: undefined,
        preparedBy: undefined,
        reportingDeptId: undefined,
        contactName: undefined,
        contactPhone: undefined,
        assessReportFileInfo: [],
        change1: undefined,
        change2: undefined,
        change3: undefined,
        change4: undefined,
        change5: undefined,
        change6: undefined,
        change7: undefined,
        decide1: undefined,
        decide2: undefined,
        decide3: undefined,
        decide4: undefined,
        decide5: undefined,
        decide6: undefined,
        decide7: undefined,
        conclusion: undefined,
        assessTime: undefined,
        scriptFileInfo: [],
        drillReportFiles: undefined
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
    /** 修改按钮操作 */
    advice(row) {
      this.reset();
      (this.businessType == 1 ? getType : enAssessInfo)(row.assessId).then(response => {
        let typeStr = response.data.planInfo.emergencyTypeFullPath;
        let pType = typeStr.split(';');
        this.form.emergencyTypeFullPath = []
        pType.filter(Boolean).forEach(item => {
          let arr = item.split(',')
          this.form.emergencyTypeFullPath.push(arr.map(Number));
        })
        this.form = response.data;
        this.form.planId = +response.data.planInfo.planId
        this.form.planSystemFullPath = +response.data.planInfo.planSystemFullPath
        this.form.planFileInfo = response.data.assessReportFileInfo ? JSON.parse(response.data.assessReportFileInfo) : undefined
        this.form.planFileInfo = response.data.assessReportFileInfo ? JSON.parse(response.data.assessReportFileInfo) : undefined;
        this.advise = true;
        this.title = "修改预案评估";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        this.form.assessDeptId = this.$store.state.user.deptId
        if (valid) {
          let str = "";
          this.form.emergencyTypeFullPath.forEach(item => {
            str += item.join(',') + ';'
          })
          this.form.emergencyTypeFullPath = str;
          if (this.form.assessId != undefined) {
            (this.businessType == 1 ? adviceType : enAssessAdvice)(this.form).then(response => {
              this.$modal.msgSuccess("建议成功");
              this.advise = false;
              this.getList();
            });
          } else {
            (this.businessType == 1 ? adviceType : enAssessAdvice)(this.form).then(response => {
              this.$modal.msgSuccess("建议成功");
              this.advise = false;
              this.getList();
            });
          }
        }
      });
    },

    /** 详情按钮操作 */
    handleDetails(row) {
      const assessId = row.assessId || this.ids;
      (this.businessType == 1 ? getType : enAssessInfo)(assessId).then(response => {
        this.form = response.data;
        this.deptTree.forEach(item => {
          if (item.deptId == response.data.reportingDeptId) {
            this.form.reportingDeptName = item.deptName
          } else if (item.children) {
            item.children.forEach(child => {
              if (child.deptId == response.data.reportingDeptId) {
                this.form.reportingDeptName = child.deptName
              }
            })
          }
        })
        this.form.emergencyTypeFullPath = response.data.planInfo.emergencyTypeFullPath;
        this.form.planSystemFullPath = +response.data.planInfo.planSystemFullPath
        this.form.planName = response.data.planInfo.planName
        this.form.planFileInfo = response.data.assessReportFileInfo ? JSON.parse(response.data.assessReportFileInfo) : undefined
        this.form.planFileInfo = response.data.assessReportFileInfo ? JSON.parse(response.data.assessReportFileInfo) : undefined;
        this.details = true;
        this.title = "预案评估详情";
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
      recordQuery().then(response => {
        this.plans = response.data;
      })
    },
    getFile(file) {
      this.form.planFileInfo = file
    },
    getDrillsFile(file) {
      this.form.planDrillFile = file
    },
    /**
     * 确认操作
     * @param row
     */
    confirmHandle(row) {
      this.$modal.confirm('是否对当前评估报告进行确认操作？').then(() => {
        (this.businessType == 1 ? confirmAssess : enConfirmAssess)(row).then(response => {
          this.$modal.msgSuccess("操作成功");
          this.getList();
        });
      }).catch(() => {

      });
    }
  }
};
</script>
