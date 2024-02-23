<template>
  <div class="app-container">
    <div class="search-container" >
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="编制单位" prop="preparationDeptName">
          <el-input
            v-model="queryParams.preparedBy"
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
              v-for="dict in (type==='1'?dict.type['26']:dict.type['525'])"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          style="margin-bottom: 10px"
        >新增报告</el-button>
      </el-col>
    </div>
    <!--列表-->
    <div class="list-container">
      <el-table :data="typeList" highlight-current-row v-loading="loading" style="width: 100%;">
        <el-table-column label="预案名称" min-width="180" align="left" :show-overflow-tooltip="true" prop="planInfo.planName" />
        <el-table-column label="事件类别" :show-overflow-tooltip="true" width="220" align="left">
          <template slot-scope="scope">
            <el-tag style="margin-right: 10px" v-for="(item,index) in buildTypeLabel(scope.row.planInfo.emergencyTypeFullPath)" :key="index">
              <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
              <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])" :value="item[1]"/></span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="行政级别" width="180" :show-overflow-tooltip="true" align="left">
          <template slot-scope="scope">
            <dict-tag :options="(type==='1'?dict.type['26']:dict.type['525'])" :value="scope.row.planInfo.planSystemFullPath"/>
          </template>
        </el-table-column>
        <el-table-column label="编制单位" width="180" :show-overflow-tooltip="true" align="left" prop="deptName" />
        <el-table-column label="上报状态" width="120" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 'submitted'" type="success">已提交</el-tag>
            <el-tag v-if="scope.row.status == 'draft'">草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDetails(scope.row)"
            >详情</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
              :disabled="scope.row.status =='submitted'"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
              :disabled="scope.row.status =='submitted'"
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

    <!--新增修改评估-->
    <el-dialog :title="title" :visible.sync="open" width=70% append-to-body>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="预案名称:" prop="planId">
              <el-select v-model="form.planId" placeholder="请选择预案" @change="getHistoryPlanDrillFile" style="width: 100%">
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
            <el-form-item label="编制单位:" prop="preparedBy">
              <el-input
                v-model="this.$store.state.user.deptName"
                placeholder="请输入修编单位"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="受理部门:" prop="reportingDeptId">
              <el-cascader v-model="form.reportingDeptId"
                           :options="deptTree"
                           :props="{
							   checkStrictly: true,
							   emitPath: false,
							   label:'deptName',
							   value:'deptId'
							}" style="width: 100%" clearable>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人:" prop="contactName">
              <el-input
                v-model="form.contactName"
                placeholder="请输入联系人"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话:" prop="contactPhone">
              <el-input
                v-model="form.contactPhone"
                placeholder="请输入联系电话"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评估报告:" prop="assessReportFileInfo">
              <file-upload  :value="form.planFileInfo" :fileType="['docx','doc','pdf']" @input="getFile">
              </file-upload>
            </el-form-item >
          </el-col>
        </el-row>
        <br><span>(一) 有关法律法规、标准、上级预案内容发生变化</span><br/>
        <el-row>
          <el-col :span="18">
            <el-form-item style="margin-left: -50px" label="简要说明:" prop="change1">
              <el-input
                v-model="form.change1"
                placeholder="请输入内容"
                clearable
                style="width: 600px;"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="判定结果" prop="decide1">
              <el-radio-group v-model="form.decide1">
                <el-radio :label="0" @change="isDisabled">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <br><span>(二) 应急指挥机构及其职责发生重大调整</span><br/>
        <el-row>
          <el-col :span="18">
            <el-form-item style="margin-left: -50px" label="简要说明:" prop="change2">
              <el-input
                v-model="form.change2"
                placeholder="请输入内容"
                clearable
                style="width: 600px;"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="判定结果" prop="decide2">
              <el-radio-group v-model="form.decide2">
                <el-radio :label="0" @change="isDisabled">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <br><span>(三) 面临的风险发生重大变化</span><br/>
        <el-row>
          <el-col :span="18">
            <el-form-item style="margin-left: -50px" label="简要说明:" prop="change3">
              <el-input
                v-model="form.change3"
                placeholder="请输入内容"
                clearable
                style="width: 600px;"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="判定结果" prop="decide3">
              <el-radio-group v-model="form.decide3">
                <el-radio :label="0" @change="isDisabled">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <br><span>(四) 重要应急资源发生重大变化</span><br/>
        <el-row>
          <el-col :span="18">
            <el-form-item style="margin-left: -50px" label="简要说明:" prop="change4">
              <el-input
                v-model="form.change4"
                placeholder="请输入内容"
                clearable
                style="width: 600px;"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="判定结果" prop="decide4">
              <el-radio-group v-model="form.decide4">
                <el-radio :label="0" @change="isDisabled">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <br><span>(五) 预案中的其他重要信息发生变化</span><br/>
        <el-row>
          <el-col :span="18">
            <el-form-item style="margin-left: -50px" label="简要说明:" prop="change5">
              <el-input
                v-model="form.change5"
                placeholder="请输入内容"
                clearable
                style="width: 600px;"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="判定结果" prop="decide5">
              <el-radio-group v-model="form.decide5">
                <el-radio :label="0" @change="isDisabled">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <br><span>(六) 在突发事件实际应对和应急演练中发现问题需要做出重大调整</span><br/>
        <el-row>
          <el-col :span="18">
            <el-form-item style="margin-left: -50px" label="简要说明:" prop="change6">
              <el-input
                v-model="form.change6"
                placeholder="请输入内容"
                clearable
                style="width: 600px;"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="判定结果" prop="decide6">
              <el-radio-group v-model="form.decide6">
                <el-radio :label="0" @change="isDisabled">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <br><span>(七) 应急预案编制单位认为应修订的其他情况</span><br/>
        <el-row>
          <el-col :span="18">
            <el-form-item style="margin-left: -50px" label="简要说明:" prop="change7">
              <el-input
                v-model="form.change7"
                placeholder="请输入内容"
                clearable
                style="width: 600px;"
                type="textarea"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="判定结果" prop="decide7">
              <el-radio-group v-model="form.decide7">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="历次演练报告:">
          <file-upload :fileType="['doc','pdf','docx']" :value="form.planDrillFile" @input="getDrillsFile">
          </file-upload>
        </el-form-item>
        <br>
        <el-form-item style="margin-left: -30px" label="评估结论:" prop="conclusion">
          <el-radio-group v-model="form.conclusion">
            <el-radio style="margin-right: 15px" :label="0" :disabled="isConclusionDisabled">暂不修订</el-radio>
            <el-radio style="margin-right: 15px" :label="1">重新修订</el-radio>
<!--            <el-radio :label="2">重新修订不审核</el-radio>-->
          </el-radio-group>
        </el-form-item>
        <br>
        <el-form-item label="修订完成时间:" prop="assessTime">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.assessTime"
            type="date"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px;">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button type="primary" @click="escalation">上报</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>

    <!--评估详情-->
    <el-dialog :title="title" :visible.sync="details" width=70% append-to-body>
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            预案名称
          </template>
          {{ form.planName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            编制单位
          </template>
          {{ this.$store.state.user.deptName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            受理部门
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
          <p><b>简要说明:</b><span style="margin-left: 10px">{{form.change1}}</span></p>
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
          <p><b>简要说明:</b><span style="margin-left: 10px">{{form.change2}}</span></p>
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
          <p><b>简要说明:</b><span style="margin-left: 10px">{{form.change3}}</span></p>
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
          <p><b>简要说明:</b><span style="margin-left: 10px">{{form.change4}}</span></p>
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
          <p><b>简要说明:</b><span style="margin-left: 10px">{{form.change5}}</span></p>
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
          <p><b>简要说明:</b><span style="margin-left: 10px">{{form.change6}}</span></p>
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
          <p><b>简要说明:</b><span style="margin-left: 10px">{{form.change7}}</span></p>
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
          <span><b>修订完成时间:</b><span style="margin-left: 10px">{{form.assessTime}}</span></span>
        </el-col>
        <el-col :span="12">
          <span><b>建议部门:</b></span>
          <el-tag v-show="form.assessDeptName">{{form.assessDeptName}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p><b>评估建议:</b><span style="margin-left: 10px">{{form.assess}}</span></p>
        </el-col>
      </el-row>
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
  import { plansList , getType, delType, updateType, addType, getDrillInfoFile, reportType } from "@/api/plans/assess";
  import { listDeptTree } from "@/api/system/dept";
  import { recordQuery } from "@/api/plans/planRecord";
  import {currentAuditDept} from "@/api/plans/preplanRevision";
  import {getDicts} from "@/api/system/dict/data";
  export default {
    name: "Dict",
    dicts: ['4','26','525','28','601','608','611','622','662'],
    data() {
      return {
        showBtnDealImg:false,
        noneBtnImg:false,
        radio: '1',
        conclusion: '1',
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        plans:[],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        exerciseFormats:undefined,

        // 总条数
        total: 0,
        type: "1",
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
        data:{
          assessId:null,
          assess:"",
          assessDeptName:"",
          assessReportFileInfo:"",
          assessTime:"",
          conclusion:"",
          contactName:"",
          contactPhone:"",
          change1:"",
          change2:"",
          change3:"",
          change4:"",
          change5:"",
          change6:"",
          change7:"",
          decide1:"",
          decide2:"",
          decide3:"",
          decide4:"",
          decide5:"",
          decide6:"",
          decide7:"",
          isConfirm:"",
          planInfo:{
            documentNumber:"",
            emergencyType: {
              dicId: null,
              dictName:"",
              dictNameFullPath:"",
              fullPath:""
            },
            planId:"",
            planLevel:"",
            planName:"",
            planSystemType:{
              dicId: null,
              dictName:"",
              dictNameFullPath:"",
              fullPath:""
            },
            preparationDeptId:"",
            preparationDeptName:"",
            recordStatus:"",
            recordedTime:""
          },
          preparedBy:"",
          recordedDay:"",
          status:"",
          drillReportFiles:""
        },
        options: [],
        props: {multiple: true},
        // 查询参数
        queryParams: {
          page: 1,
          size: 10,
          preparedBy:undefined,
          planName:undefined,
          emergencyTypeFullPath:undefined,
          planSystemFullPath:undefined,
          reportSourceFullPath:undefined,
          reportingDeptId:undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          planId: [
            { required: true, message: "预案名称不能为空", trigger: "blur" }
          ],
          emergencyTypeFullPath: [
            { required: true, message: "事件类别不能为空", trigger: "blur" }
          ],
          planSystemFullPath: [
            { required: true, message: "行政级别不能为空", trigger: "blur" }
          ],
          reportingDeptId: [
            { required: true, message: "提交部门不能为空", trigger: "blur" }
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
          assessReportFileInfo: [
            { required: true, message: "评估报告不能为空", trigger: "blur" }
          ],
          decide1: [
            { required: true, message: "判定结果不能为空", trigger: "blur" }
          ],
          decide2: [
            { required: true, message: "判定结果不能为空", trigger: "blur" }
          ],
          decide3: [
            { required: true, message: "判定结果不能为空", trigger: "blur" }
          ],
          decide4: [
            { required: true, message: "判定结果不能为空", trigger: "blur" }
          ],
          decide5: [
            { required: true, message: "判定结果不能为空", trigger: "blur" }
          ],
          decide6: [
            { required: true, message: "判定结果不能为空", trigger: "blur" }
          ],
          conclusion: [
            { required: true, message: "评估结论不能为空", trigger: "blur" }
          ],
          assessTime: [
            { required: true, message: "修订完成时间不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.type = sessionStorage.getItem('BUSINESS_TYPE')
      this.getList();
      this.buildOptions();
    },
    computed: {
      isConclusionDisabled() {
        return this.form.decide1 === 0 || this.form.decide2 === 0 || this.form.decide3 === 0 || this.form.decide4 === 0 || this.form.decide5 === 0 || this.form.decide6 === 0;
      },
    },
    methods: {
      /** 查询预案类型列表 */
      getList() {
        this.loading = true;
        plansList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.typeList = response.data.content;
            this.total = response.data.totalElements
            this.getAllDepartment()
            this.getCurrentDept()
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
        if(val){
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
      isDisabled() {
        if (this.form.decide1 === 0 || this.form.decide2 === 0 || this.form.decide3 === 0 || this.form.decide4 === 0 || this.form.decide5 === 0 || this.form.decide6 === 0) {
          this.form.conclusion = null;
        }
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      getHistoryPlanDrillFile() {
        getDrillInfoFile(this.form.planId).then(response => {
          const newPlanDrillFile = response.data.drillReportFiles ? JSON.parse(response.data.drillReportFiles) : undefined;
          this.$set(this.form, 'planDrillFile', newPlanDrillFile);
        });
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
          drillReportFiles:undefined,
          scriptFileInfo: []
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
      /** 新增评估按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加预案评估";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        getType(row.assessId).then(response => {
          this.form = response.data;
          let typeStr = response.data.planInfo.emergencyTypeFullPath;
          let pType = typeStr.split(';');
          this.form.emergencyTypeFullPath = []
          pType.filter(Boolean).forEach(item => {
            let arr = item.split(',')
            this.form.emergencyTypeFullPath.push(arr.map(Number));
          })
          this.form.planSystemFullPath = +response.data.planInfo.planSystemFullPath
          this.form.planId= +response.data.planInfo.planId
          this.form.planFileInfo=response.data.assessReportFileInfo?JSON.parse(response.data.assessReportFileInfo):undefined
          // this.form.planDrillFile=response.data.drillReportFiles?JSON.parse(response.data.drillReportFiles):undefined
          this.open = true;
          this.title = "修改预案评估";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.form.deptName=this.$store.state.user.deptName
        this.form.assessReportFileInfo=this.form.planFileInfo?JSON.stringify(this.form.planFileInfo):''
        this.form.preparedBy=this.$store.state.user.deptName
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.assessId != undefined) {
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
        this.$modal.confirm('是否确认删除演练报告编号为"' + row.assessId + '"的数据项？').then(function() {
          return delType(row.assessId);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 详情按钮操作 */
      handleDetails(row) {
        const assessId = row.assessId || this.ids
        getType(assessId).then(response => {
          this.form = response.data;
          this.form.emergencyTypeFullPath = response.data.planInfo.emergencyTypeFullPath
          this.form.planSystemFullPath = +response.data.planInfo.planSystemFullPath
          this.form.planName= response.data.planInfo.planName
          this.form.planFileInfo=response.data.assessReportFileInfo?JSON.parse(response.data.assessReportFileInfo):undefined
          // this.form.planDrillFile=response.data.drillReportFiles?JSON.parse(response.data.drillReportFiles):undefined
          this.details = true;
          this.title = "预案评估详情";
        });
      },
      /** 上报按钮操作 */
      escalation() {
        this.$refs["form"].validate(valid => {
          this.form.deptName=this.$store.state.user.deptName
          this.form.assessReportFileInfo=this.form.planFileInfo?JSON.stringify(this.form.planFileInfo):''
          this.form.preparedBy=this.$store.state.user.deptName
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
      getFile(file) {
        this.form.planFileInfo = file
      },
      getDrillsFile(file) {
        this.form.planDrillFile = file
      },
      /** 查询所有演练报告依据*/
      getCurrentDept(){
        // recordQuery().then(response => {
        currentAuditDept().then(response => {
          this.plans=response.data;
        })
      },
    }
  };
</script>
