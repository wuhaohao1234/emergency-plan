<template>
  <div id="existPlanRecord">
    <el-page-header @back="goBack" content="已有预案备案" style="margin-bottom: 20px"></el-page-header>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane name="zero">
        <span slot="label"><i class="el-icon-tickets"></i> 预案信息</span>
          <el-row>
            <el-col :span="12">
              <el-form-item label="预案名称" prop="planName">
                <el-input v-model="form.planName" placeholder="请输入预案名称" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预案体系" prop="planTypeFullPath">
                <el-select v-model="form.planTypeFullPath" style="width: 100%" placeholder="请选择预案体系" clearable>
                  <el-option
                    v-for="dict in dict.type['632']"
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
              <el-form-item label="事件类别" prop="emergencyTypeFullPath">
                <el-cascader
                  v-model="form.emergencyTypeFullPath"
                  style="width: 100%;"
                  :options="options"
                  :props="props"
                  placeholder="请选择事件类别"
                  clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政级别" prop="planSystemFullPath">
                <el-select v-model="form.planSystemFullPath" style="width: 100%" placeholder="请选择行政级别" clearable>
                  <el-option
                    v-for="dict in (type==='1'?dict.type['26']:dict.type['525'])"
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
            <el-form-item label="编制单位" prop="preparationDeptId">
              <el-input v-model="this.$store.state.user.deptName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactName">
              <el-input v-model="form.contactName" placeholder="请输入联系人" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="contactPhone">
                <el-input v-model="form.contactPhone" placeholder="请输入联系电话" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="reportingDeptId" label="受理部门">
                <treeselect no-results-text="无部门数据" v-model="form.reportingDeptId" :options="deptData" :normalizer="normalizer"
                            :show-count="true"
                            placeholder="选择受理部门"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="deptAddress" label="单位地址">
                <el-input v-model="form.deptAddress" placeholder="请输入单位地址" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="recordDeptId" label="备案部门">
                <treeselect no-results-text="无部门数据"
                  v-model="form.recordDeptId"
                  :options="deptData"
                  :normalizer="normalizer"
                  :show-count="true"
                  placeholder="选择备案部门"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="publishDeptId" label="发布单位">
                <treeselect no-results-text="无部门数据" v-model="form.publishDeptId" :options="deptData" :normalizer="normalizer" :show-count="true"
                            placeholder="选择发布单位"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="documentNumber" label="发布文号">
                <el-input v-model="form.documentNumber" placeholder="请输入发布文号"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="publishTime" label="发布日期">
                <el-date-picker style="width: 100%" v-model="form.publishTime" type="date" value-format="yyyy-MM-dd"
                                placeholder="选择发布日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="planFileInfo" label="预案正文">
                <file-upload :value="form.planFile" :limit="1" :fileSize="10" :fileType="['doc', 'docx', 'pdf']"
                             @input="getFile"></file-upload>
              </el-form-item>
            </el-col>
          </el-row>
      </el-tab-pane>
      <el-tab-pane name="first">
        <span slot="label"><i class="el-icon-tickets"></i> 基本资料</span>
        <div style="margin-left: 20px;font-size: 14px">
          <div v-for="item in fileList" :key="item.type" class="fileCheckbox">
            <el-checkbox v-model="item.isHas" disabled style="margin-right: 10px"></el-checkbox>
            <span>{{ item.name }}</span>
            <span v-if="item.isRequired" style="color: red;font-size: 15px;">&emsp;*</span>
            <el-button @click="downloadRecordDeclareHandle" style="margin-left: 10px"
                       size="mini" type="primary" v-if="item.type==1">申请表模板下载</el-button>
            <el-button @click="downloadSubmissionFormHandle" style="margin-left: 10px"
                       size="mini" type="primary" v-if="item.type==0">送审稿模板下载</el-button>
            <div style="display: inline-block;margin: 0 8px">
              <file-upload :fileType="['doc','docx','pdf','png','jpeg','jpg']" :isShowTip="false" :buttonType="'svg'"
                           :showList="false" @input="getFileData($event,item)" :value=item.files></file-upload>
            </div>
            <span style="color:red;font-size: 10px" v-if="item.showTips">请上传当前文件</span>
            <br>
            <el-tag style="margin-right: 5px" :key="index" v-for="(tag,index) in item.files" closable
                    :disable-transitions="false" @close="handleClose(tag.fileKey,item)">
              {{ tag.fileName }}
            </el-tag>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    </el-form>
    <div style="position: absolute;bottom: 30px;right: 10px">
      <el-button @click="goBack" :disabled="cancelVisible">取消</el-button>
      <el-button type="primary" @click="saveHandle" :loading="saveLoading" :disabled="saveVisible">保存</el-button>
<!--      <el-button type="primary" @click="submitHandle" :loading="submitLoading" :disabled="submitVisible">备案申报-->
<!--      </el-button>-->
    </div>
  </div>
</template>

<script>
import planConnection from "./existPlanConnection";
import startingCondition from "./existStartingCondition";
import relatedFile from "./existRelatedFile";
import {listDeptTree} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {existPlansRecord, downloadRecordDeclare} from "@/api/plans/planRecord";
import {findAuditById,downloadSubmissionForm} from "@/api/plans/planAudit";
import orgTree from "./existOrgTree";
import {getDicts} from "@/api/system/dict/data";

export default {
  name: "existPlanRecord",
  dicts: ['4', '26','525','601','608','611','622','632','662'],
  components: {
    planConnection,
    startingCondition,
    relatedFile,
    Treeselect,
    orgTree
  },
  data() {
    return {
      subassemblyRes: false, //子组件校验结果
      activeName: 'zero',
      saveVisible: false,
      submitVisible: false,
      saveLoading: false,
      submitLoading: false,
      cancelVisible: false,
      recordId: 0,
      // 表单参数
      form: {
        //演练周期
        drillCycle: 2,
        //演练次数
        drillNum: 1,
        //评估周期
        evaluationCycle: 1
      },
      yearList: [
        {label: "半年", value: 0},
        {label: "一年", value: 1},
        {label: "两年", value: 2},
        {label: "三年", value: 3},
        {label: "四年", value: 4},
        {label: "五年", value: 5},],
      numList: [
        {label: "一次", value: 0},
        {label: "两次", value: 1},
        {label: "三次", value: 2},
        {label: "四次", value: 3},
        {label: "五次", value: 4},],
      // 表单校验
      rules: {
        reportingDeptId: [{
          required: true,
          message: "审核部门不能为空",
          trigger: "blur"
        }],
        recordDeptId: [{required: true, message: "备案部门不能为空", trigger: "blur"}],
        publishDeptId: [{
          required: true,
          message: "发布单位不能为空",
          trigger: "blur"
        }],
        documentNumber: [{
          required: true,
          message: "发布文号不能为空",
          trigger: "blur"
        }],
        publishTime: [{
          required: true,
          message: "发布时间不能为空",
          trigger: "blur"
        }],
        deptAddress: [
          {required: true, message: "单位地址不能为空", trigger: "blur"}
        ],
        planName: [
          {required: true, message: "预案名称不能为空", trigger: "blur"}
        ],
        emergencyTypeFullPath: [
          {required: true, message: "事件类别不能为空", trigger: "blur"}
        ],
        planSystemFullPath: [
          {required: true, message: "行政级别不能为空", trigger: "blur"}
        ],
        planTypeFullPath: [
          {required: true, message: "预案体系不能为空", trigger: "blur"}
        ],
        drillCycle: [
          {required: true, message: "演练周期不能为空", trigger: "blur"}
        ],
        evaluationCycle: [
          {required: true, message: "评估周期不能为空", trigger: "blur"}
        ],
        contactName: [
          {required: true, message: "联系人不能为空", trigger: "blur"}
        ],
        contactPhone: [
          {required: true, message: "联系电话不能为空", trigger: "blur"},
          {pattern: /^1[3456789]\d{9}$/, message: "联系电话格式不正确", trigger: "blur"}
        ],
      },
      deptData: [],
      type: "1",
      options: [],
      props: {multiple: true},
      fileList: [
        {type: 0, isHas: false, showTips: false, name: '应急预案送审稿', isRequired: true, files: []},
        {
          type: 1,
          isHas: false,
          showTips: false,
          name: '应急预案备案申请表',
          isRequired: true,
          files: []
        },
        {
          type: 2,
          isHas: false,
          showTips: false,
          name: '应急预案电子文本或简本',
          isRequired: true,
          files: []
        },
        {
          type: 3,
          isHas: false,
          showTips: false,
          name: '风险评估报告',
          isRequired: true,
          files: []
        },
        {
          type: 4,
          isHas: false,
          showTips: false,
          name: '应急资源调查报告',
          isRequired: true,
          files: []
        },
        {
          type: 5,
          isHas: false,
          showTips: false,
          name: '应急预案征求意见和采纳意见情况说明、分歧意见的处理依据和结果',
          isRequired: true,
          files: []
        },
        {
          type: 6,
          isHas: false,
          showTips: false,
          name: '专家评审意见',
          isRequired: true,
          files: []
        },
        {
          type: 7,
          isHas: false,
          showTips: false,
          name: '上级应急预案、本级相关应急预案等预案文本、有关法律法规清单',
          isRequired: true,
          files: []
        },
        {type: 8, isHas: false, showTips: false, name: '应急修编说明', isRequired: false, files: []},
        {
          type: 9,
          isHas: false,
          showTips: false,
          name: '需要说明的其他事项',
          isRequired: false,
          files: []
        },
        {type: 10, isHas: false, showTips: false, name: '其他补充资料', isRequired: false, files: []},
      ],
      conditionList: [{
        isConform: true,
        name: '应急预案符合有关法律法规要求',
      },
        {
          isConform: true,
          name: '按照本办法规定的程序进行编制',
        },
        {
          isConform: true,
          name: '与上级应急预案、本级政府总体应急预案以及其他有关应急预案有效衔接',
        },
        {
          isConform: true,
          name: '预案主体内容完备',
        },
        {
          isConform: true,
          name: '组织指挥体系责任分工合理明确',
        },
        {
          isConform: true,
          name: '应急响应级别设计合理',
        },
        {
          isConform: true,
          name: '应对措施具体简明、管用可行',
        },
        {
          isConform: true,
          name: '预案各方面达成一致意见',
        },
        {
          isConform: true,
          name: '同意报送政府印发',
        },
        {
          isConform: false,
          name: '退回修改后，再次报送',
        },
      ],
      recordData: {
        //预案基本信息
        addOrEditPlanModel: {},
        //预案审核信息
        editPlanAuditModel: {},
        //预案申报信息
        editPlanRecordModel: {},
        //组织机构信息
        editOrganizationModel: {}
      },
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init() {
      this.type = sessionStorage.getItem('BUSINESS_TYPE')
      this.getDeptData();
      this.buildOptions();
    },
    /** 转换数据结构 */
    normalizer(node) {
      if (!node.children || (node.children && !node.children.length)) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    /** 查询单位 */
    getDeptData() {
      listDeptTree().then(response => {
        this.deptData = response.data;
        this.data = response.data[0];
      });
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
    getFileData(files, data) {
      data.files = files
      if (data.files.length) {
        data.isHas = true
        data.showTips = false
      }
    },
    handleClose(tag, data) {
      data.files = data.files.filter(item => item.fileKey !== tag)
      if (!data.files.length) {
        data.isHas = false
        data.showTips = true
      }
    },
    //保存
    saveHandle() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.saveLoading = true;
          this.cancelVisible = true;
          this.submitVisible = true;
          this.buildData(this.fileList)
          let str = "";
          this.form.emergencyTypeFullPath.forEach(item => {
            str += item.join(',') + ';'
          })
          //预案基本信息
          this.recordData.addOrEditPlanModel.planName = this.form.planName;
          this.recordData.addOrEditPlanModel.emergencyTypeFullPath = str
          this.recordData.addOrEditPlanModel.planSystemFullPath = this.form.planSystemFullPath
          this.recordData.addOrEditPlanModel.planFileInfo = this.form.planFile ? JSON.stringify(this.form.planFile) : ''
          this.recordData.addOrEditPlanModel.preparationDeptId = this.$store.state.user.deptId;
          this.recordData.addOrEditPlanModel.documentNumber = this.form.documentNumber
          this.recordData.addOrEditPlanModel.publishDeptId = this.form.publishDeptId
          this.recordData.addOrEditPlanModel.publishTime = this.form.publishTime
          //预案审核信息
          this.recordData.editPlanAuditModel.reportingDeptId = this.form.reportingDeptId
          this.recordData.editPlanAuditModel.deptAddress = this.form.deptAddress
          this.recordData.editPlanAuditModel.auditItems = JSON.stringify(this.conditionList)
          this.recordData.editPlanAuditModel.contactName = this.form.contactName
          this.recordData.editPlanAuditModel.contactPhone = this.form.contactPhone
          //预案申报信息
          this.recordData.editPlanRecordModel.reportingDeptId = this.form.recordDeptId
          this.recordData.editPlanRecordModel.contactName = this.$store.state.user.name
          this.recordData.editPlanRecordModel.contactPhone = this.$store.state.user.phone
          this.recordData.editPlanRecordModel.status = 'draft'
          this.recordData.editPlanRecordModel.evaluationCycle = this.form.evaluationCycle
          this.recordData.editPlanRecordModel.drillCycle = this.form.drillCycle
          this.recordData.editPlanRecordModel.drillNum = this.form.drillNum
          // //事件情况
          // this.$refs.startingCondition.checkHandle()
          // //组织机构
          // this.$refs.orgTree.getOrgData()
          // //预案衔接
          // this.$refs.planConnection.getConnectionData()
          // //应急文书
          // this.$refs.relatedFile.emergencyDoc()
          // //简明手册
          // this.$refs.relatedFile.conciseManual()
          this.recordData.handleType = 1
          existPlansRecord(this.recordData).then(response => {
            if (response.code === 200) {
              this.$modal.msgSuccess('操作成功！')
            }
          }).finally(() => {
            this.goBack()
          })
        }
      })
    },
    //获取启动条件组件校验结果
    getValidateRes(res, data) {
      this.subassemblyRes = res
      if (res) {
        this.recordData.addOrEditPlanModel.level1 = data.level1
        this.recordData.addOrEditPlanModel.level2 = data.level2
        this.recordData.addOrEditPlanModel.level3 = data.level3
        this.recordData.addOrEditPlanModel.level4 = data.level4
      }
    },
    //提交
    submitHandle() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //预案基本信息
          this.recordData.addOrEditPlanModel.planName = this.form.planName;
          this.recordData.addOrEditPlanModel.emergencyTypeFullPath = this.form.emergencyTypeFullPath
          this.recordData.addOrEditPlanModel.planSystemFullPath = this.form.planSystemFullPath
          this.recordData.addOrEditPlanModel.planFileInfo = this.form.planFile ? JSON.stringify(this.form.planFile) : ''
          this.recordData.addOrEditPlanModel.preparationDeptId = this.$store.state.user.deptId;
          this.recordData.addOrEditPlanModel.documentNumber = this.form.documentNumber
          this.recordData.addOrEditPlanModel.publishDeptId = this.form.publishDeptId
          this.recordData.addOrEditPlanModel.publishTime = this.form.publishTime
          //预案审核信息
          this.recordData.editPlanAuditModel.reportingDeptId = this.form.reportingDeptId
          this.recordData.editPlanAuditModel.deptAddress = this.form.deptAddress
          this.recordData.editPlanAuditModel.auditItems = JSON.stringify(this.conditionList)
          this.recordData.editPlanAuditModel.contactName = this.form.contactName
          this.recordData.editPlanAuditModel.contactPhone = this.form.contactPhone
          //预案申报信息
          this.recordData.editPlanRecordModel.reportingDeptId = this.form.recordDeptId
          this.recordData.editPlanRecordModel.contactName = this.$store.state.user.name
          this.recordData.editPlanRecordModel.contactPhone = this.$store.state.user.phone
          this.recordData.editPlanRecordModel.status = 'auditing'
          this.recordData.editPlanRecordModel.evaluationCycle = this.form.evaluationCycle
          this.recordData.editPlanRecordModel.drillCycle = this.form.drillCycle
          this.recordData.editPlanRecordModel.drillNum = this.form.drillNum
          let visible = true
          //基本资料
          this.fileList.forEach(item => {
            if (item.isRequired && !item.files.length) {
              item.isHas = false
              item.showTips = true
              visible = false
            }
          })
          if (visible) {
            // //事件情况
            // this.$refs.startingCondition.checkHandle()
            // //组织机构
            // this.$refs.orgTree.getOrgData()
            // //预案衔接
            // this.$refs.planConnection.getConnectionData()
            // //应急文书
            // this.$refs.relatedFile.emergencyDoc()
            // //简明手册
            // this.$refs.relatedFile.conciseManual()
            if (!this.subassemblyRes) {
              this.activeName = 'third'
            } else {
              this.submitLoading = true;
              this.cancelVisible = true;
              this.saveVisible = true;
              this.buildData(this.fileList)
              this.recordData.handleType = 2
              existPlansRecord(this.recordData).then(response => {
                if (response.code === 200) {
                  this.$modal.msgSuccess('操作成功！')
                }
              }).finally(() => {
                this.goBack()
              })
            }
          } else {
            this.activeName = 'first'
          }
        }
      })
    },
    //构建资料数据
    buildData(data) {
      //应急预案送审表=========================  (审核相关)
      this.recordData.editPlanAuditModel.submissionFormFileInfo = this.dataToString(data[0].files);
      //应急预案简本
      this.recordData.editPlanAuditModel.simplifiedFileInfo = this.dataToString(data[2].files);
      //风险评估报告
      this.recordData.editPlanAuditModel.riskAssessmentReportFileInfo = this.dataToString(data[3].files);
      //应急资源调查报告
      this.recordData.editPlanAuditModel.resourceSurveyReportFileInfo = this.dataToString(data[4].files);
      //预案征求意见采纳、分歧处理结果
      this.recordData.editPlanAuditModel.differencesOfOpinionFileInfo = this.dataToString(data[5].files);
      //专家评审意见
      this.recordData.editPlanAuditModel.expertReviewOpinionsFileInfo = this.dataToString(data[6].files);
      //上级、本级预案文本法规清单
      this.recordData.editPlanAuditModel.textRegulationsFileInfo = this.dataToString(data[7].files);
      //应急预案修编说明
      this.recordData.editPlanAuditModel.revisionRemark = this.dataToString(data[8].files);
      //其他事项说明
      this.recordData.editPlanAuditModel.otherRemark = this.dataToString(data[9].files);
      //补充资料
      this.recordData.editPlanAuditModel.replenishFileInfo = this.dataToString(data[10].files);

      //预案备案申报表 ===============================(备案相关)
      this.recordData.editPlanRecordModel.declarationFormFileInfo = this.dataToString(data[1].files);
      //应急预案简本
      this.recordData.editPlanRecordModel.simplifiedFileInfo = this.dataToString(data[2].files);
      //风险评估报告
      this.recordData.editPlanRecordModel.riskAssessmentReportFileInfo = this.dataToString(data[3].files);
      //应急资源调查报告
      this.recordData.editPlanRecordModel.resourceSurveyReportFileInfo = this.dataToString(data[4].files);
      //预案征求意见采纳、分歧处理结果
      this.recordData.editPlanRecordModel.differencesOfOpinionFileInfo = this.dataToString(data[5].files);
      //专家评审意见
      this.recordData.editPlanRecordModel.expertReviewOpinionsFileInfo = this.dataToString(data[6].files);
      //上级、本级预案文本法规清单
      this.recordData.editPlanRecordModel.textRegulationsFileInfo = this.dataToString(data[7].files);
      //其他事项说明
      this.recordData.editPlanRecordModel.otherRemark = this.dataToString(data[9].files);
    },
    findAudit(id) {
      findAuditById(id).then(res => {
        if (res.code === 200) {
          this.getDocuments(res.data)
        }
      })
    },
    dataParse(data) {
      return data ? JSON.parse(data) : []
    },
    dataToString(data) {
      return data.length ? JSON.stringify(data) : ''
    },
    //获取预案申报时的文件
    getDocuments(data) {
      this.form.recordId = data.recordId
      //应急预案送审表
      this.fileList[0].files = this.dataParse(data.declarationFormFileInfo)
      this.fileList[0].isHas = !!data.declarationFormFileInfo
      //应急预案简本
      this.fileList[1].files = this.dataParse(data.simplifiedFileInfo)
      this.fileList[1].isHas = !!data.simplifiedFileInfo
      //风险评估报告
      this.fileList[2].files = this.dataParse(data.riskAssessmentReportFileInfo)
      this.fileList[2].isHas = !!data.riskAssessmentReportFileInfo
      //应急资源调查报告
      this.fileList[3].files = this.dataParse(data.resourceSurveyReportFileInfo)
      this.fileList[3].isHas = !!data.resourceSurveyReportFileInfo
      //预案征求意见采纳、分歧处理结果
      this.fileList[4].files = this.dataParse(data.differencesOfOpinionFileInfo)
      this.fileList[4].isHas = !!data.differencesOfOpinionFileInfo
      //专家评审意见
      this.fileList[5].files = this.dataParse(data.expertReviewOpinionsFileInfo)
      this.fileList[5].isHas = !!data.expertReviewOpinionsFileInfo
      //上级、本级预案文本法规清单
      this.fileList[6].files = this.dataParse(data.textRegulationsFileInfo)
      this.fileList[6].isHas = !!data.textRegulationsFileInfo
      //其他补充说明
      this.fileList[7].files = this.dataParse(data.otherRemark)
      this.fileList[7].isHas = !!data.otherRemark
    },
    getFile(file) {
      this.form.planFile = file
    },
    //获取预案衔接数据
    getConnectionData(val) {
      if (val.length > 0) {
        this.recordData.editPlanRecordModel.connectionPlanIds = val.join(',')
      }
    },
    //应急处置简明手册
    getConciseManual(val) {
      this.recordData.editPlanRecordModel.conciseManual = val
    },
    //应急文书
    getEmergencyDoc(val) {
      this.recordData.editPlanRecordModel.emergencyDoc = val
    },
    //组织机构
    getOrgData(val) {
      this.recordData.editOrganizationModel = val
    },
    /**
     * 应急预案备案申请表下载
     */
    downloadRecordDeclareHandle(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          let depts = this.treeToArr(this.deptData)
          let dept = depts.find(item => this.form.reportingDeptId == item.deptId)
          let data = {
            deptAddress: this.form.deptAddress,
            contactName: this.$store.state.user.name,
            contactPhone: this.$store.state.user.phone,
            planName:this.form.planName,
            preparationDeptName:this.$store.state.user.deptName,
            reportingDeptName: dept.deptName
          }
          downloadRecordDeclare(data).then(res=>{
            let fileType = 'application/msword'
            // 转换为 Blob 对象
            const blob = new Blob([res], {type: fileType});
            // 创建临时下载链接
            const downloadUrl = URL.createObjectURL(blob);
            // 创建 <a> 标签
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = '应急预案备案申请表.docx'; // 设置新的文件名及扩展名
            // 手动触发下载
            link.click();
            // 清理临时下载链接
            URL.revokeObjectURL(downloadUrl);
          })
        }else {
          this.activeName='zero'
        }})
    },
    treeToArr(data) {
      const result = [];
      data.forEach(item => {
        const loop = data => {
          result.push({
            deptId: data.deptId,
            deptName: data.deptName,
            parentId: data.parentId
          });
          let child = data.children
          if (child) {
            for (let i = 0; i < child.length; i++) {
              loop(child[i])
            }
          }
        }
        loop(item);
      })
      return result;
    },
    /**
     * 审核送审稿下载
     */
    downloadSubmissionFormHandle() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let depts = this.treeToArr(this.deptData)
          let dept = depts.find(item => this.form.recordDeptId == item.deptId)
          let data = {
            contactName: this.form.contactName,
            contactPhone: this.form.contactPhone,
            deptAddress: this.form.deptAddress,
            planName: this.form.planName,
            preparationDeptName: this.$store.state.user.deptName,
            reportingDeptName: dept.deptName
          }
          downloadSubmissionForm(data).then(res => {
              let fileType = 'application/msword'
              // 转换为 Blob 对象
              const blob = new Blob([res], {type: fileType});
              // 创建临时下载链接
              const downloadUrl = URL.createObjectURL(blob);
              // 创建 <a> 标签
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = '应急预案审核送审稿.docx'; // 设置新的文件名及扩展名
              // 手动触发下载
              link.click();
              // 清理临时下载链接
              URL.revokeObjectURL(downloadUrl);
            }
          )
        }else {
          this.activeName='zero'
        }})
    },
  }
}
</script>


<style lang="scss">
.fileCheckbox {
  .el-checkbox__input.is-disabled + .el-checkbox__label {
    color: white !important;
  }

  .el-checkbox__input.is-disabled.is-checked + .el-checkbox__label {
    color: #1890ff !important;
  }

  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #1890ff !important;
    border-color: #1890ff !important;
  }

  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: white;
    border-color: #DCDFE6;
    cursor: not-allowed;
  }

  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: white;
  }
}
</style>
