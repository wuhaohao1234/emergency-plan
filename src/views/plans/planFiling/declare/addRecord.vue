<!--添加备案申报-->
<template>
  <div id="addRecord">
    <div v-if="!planStructuralVisible">
      <el-page-header @back="goBack" content="备案申报" style="margin-bottom: 20px"></el-page-header>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="预案名称" prop="planName">
              <el-input v-model="form.planName" disabled placeholder="请输入预案名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编制单位" prop="preparationDeptId">
              <treeselect no-results-text="无部门数据" disabled v-model="form.preparationDeptId" :options="deptData"
                          :normalizer="normalizer"
                          :show-count="true" placeholder="选择编制单位"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="reportingDeptId" label="受理部门">
              <treeselect no-results-text="无部门数据" v-model="form.reportingDeptId" :options="deptData"
                          :normalizer="normalizer"
                          placeholder="选择受理部门"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="pDeptId" label="发布单位">
              <treeselect no-results-text="无部门数据" v-model="form.pDeptId" :options="deptData" :normalizer="normalizer"
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
        <div style="margin-left: 20px;font-size: 14px" class="bottom-file">
          <div v-for="item in fileList" :key="item.type" class="fileCheckbox">
            <el-checkbox v-model="item.isHas" disabled style="margin-right: 10px"></el-checkbox>
            <span>{{ item.name }}</span>
            <span v-if="item.isRequired" style="color: red;font-size: 15px;">&emsp;*</span>
            <el-button @click="downloadRecordDeclareHandle" style="margin-left: 10px"
                       size="mini" type="primary" v-if="item.type==1">申请表模板下载
            </el-button>
            <div style="display: inline-block;margin: 0 8px">
              <file-upload :fileType="['doc','docx','pdf','png','jpeg','jpg']" :isShowTip="false" :buttonType="'svg'"
                           :showList="false" @input="getFileData($event,item)" :value=item.files></file-upload>
            </div>
            <span style="color:red;font-size: 12px" v-if="item.showTips">请上传当前文件</span>
            <br>
            <el-tag style="margin-right: 5px" :key="index" v-for="(tag,index) in item.files" closable
                    :disable-transitions="false" @close="handleClose(tag.fileKey,item)">
              {{ tag.fileName }}
            </el-tag>
          </div>
          <div class="right-button">
            <el-button type="success" icon="el-icon-tickets" @click="structuralHandle">
              <b>预&nbsp;案&nbsp;结&nbsp;构&nbsp;化</b></el-button>
          </div>
        </div>
      </el-form>
      <div style="float: right;margin: 20px 0">
        <el-button @click="goBack" :disabled="cancelVisible">取消</el-button>
        <el-button type="primary" @click="saveHandle" :loading="saveLoading" :disabled="saveVisible">保存</el-button>
        <el-button type="primary" @click="submitHandle" :loading="submitLoading" :disabled="submitVisible">备案申报
        </el-button>
      </div>
    </div>
    <plan-structural ref="planStructural" v-if="planStructuralVisible" @goBack="()=>{ this.planStructuralVisible = false;}"/>
  </div>
</template>

<script>
import {
  listDeptTree
} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  addRecord,
  editRecord,
  recordReport,
  downloadRecordDeclare
} from "@/api/plans/planRecord";
import {
  findByPlanId,
} from "@/api/plans/planAudit";
import PlanStructural from "@/views/plans/planFiling/declare/planStructural.vue";

export default {
  name: "addRecord",
  components: {
    PlanStructural,
    Treeselect,
  },
  data() {
    var validateReportingDeptId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('受理部门不能为空'));
      } else {
        callback();
      }
    };
    var validatePDeptId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('发布单位不能为空'));
      } else {
        callback();
      }
    };
    return {
      subassemblyRes: false, //子组件校验结果
      activeName: 'first',
      saveVisible: false,
      submitVisible: false,
      saveLoading: false,
      submitLoading: false,
      cancelVisible: false,
      planStructuralVisible: false,
      recordId: '',
      form: {
        //演练周期
        drillCycle: 2,
        //演练次数
        drillNum: 1,
        //评估周期
        evaluationCycle: 1,
        reportingDeptId:undefined,
        pDeptId:undefined,
        publishTime:'',
        documentNumber:''
      },
      // 表单校验
      rules: {
        reportingDeptId: [{
          required: true,
          validator: validateReportingDeptId,
          trigger: "change"
        }],
        pDeptId: [{
          required: true,
          validator: validatePDeptId,
          trigger: "change"
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
        drillCycle: [
          {required: true, message: "演练周期不能为空", trigger: "blur,change"}
        ],
        evaluationCycle: [
          {required: true, message: "评估周期不能为空", trigger: "blur,change"}
        ]
      },
      deptData: [],
      fileList: [
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
        {
          type: 8,
          isHas: false,
          showTips: false,
          name: '需要说明的其他事项',
          isRequired: false,
          files: []
        },
      ],
      conditionList: [
        {
          type: 1,
          isHas: false,
          name: '应急预案符合有关法律法规要求',
        },
        {
          type: 2,
          isHas: false,
          name: '按照本办法规定的程序进行编制',
        },
        {
          type: 3,
          isHas: false,
          name: '与上级应急预案、本级政府总体应急预案以及其他有关应急预案有效衔接',
        },
        {
          type: 4,
          isHas: false,
          name: '预案主体内容完备',
        },
        {
          type: 5,
          isHas: false,
          name: '组织指挥体系责任分工合理明确',
        },
        {
          type: 6,
          isHas: false,
          name: '应急响应级别设计合理',
        },
        {
          type: 7,
          isHas: false,
          name: '应对措施具体简明、管用可行',
        },
        {
          type: 8,
          isHas: false,
          name: '预案各方面达成一致意见',
        },
        {
          type: 9,
          isHas: false,
          name: '同意报送政府印发',
        },
        {
          type: 10,
          isHas: false,
          name: '退回修改后，再次报送',
        },
      ]
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init(type, data) {
      if (this.$refs["form"]) this.$refs["form"].resetFields()
      this.getDeptData()
      if (type === 1) {
        addRecord([data.planId]).then(res => {
          this.recordId = res.data[0]
        })
        this.findAudit(data.planId)
        this.form = data
        this.$set(this.form,'pDeptId', data.publishDeptId)
        this.$set(this.form,'reportingDeptId', data.reportingDeptId)
        this.form.publishTime = data.publishTime
        this.form.documentNumber = data.documentNumber
      } else {
        this.form = data.planInfo
        this.$set(this.form,'pDeptId', data.planInfo.publishDeptId)
        this.$set(this.form,'reportingDeptId', data.reportingDeptId ? data.reportingDeptId : undefined)
        this.recordId = data.recordId
        this.form.recordId = data.recordId
        this.form.drillCycle = data.drillCycle
        this.form.drillNum = data.drillNum
        this.form.evaluationCycle = data.evaluationCycle
        this.getDocuments(data)
      }
    },
    structuralHandle() {
      this.planStructuralVisible = true;
      this.$nextTick(() => {
        this.$refs.planStructural.initing(this.form);
      });
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
    saveHandle() {
      this.saveLoading = true;
      this.cancelVisible = true;
      this.submitVisible = true;
      this.buildData(this.fileList)
      this.save()
    },
    //获取子组件校验结果
    getValidateRes(data) {
      this.subassemblyRes = data
    },
    submitHandle() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let visible = true
          this.fileList.forEach(item => {
            if (item.isRequired && !item.files.length) {
              item.isHas = false
              item.showTips = true
              visible = false
            }
          })
          if (visible) {
            this.submitLoading = true;
            this.cancelVisible = true;
            this.saveVisible = true;
            this.buildData(this.fileList)
            this.submit()
          }
        }
      })
    },
    buildData(data) {
      //预案备案申报表
      this.form.declarationFormFileInfo = this.dataToString(data[0].files);
      //应急预案简本
      this.form.simplifiedFileInfo = this.dataToString(data[1].files);
      //风险评估报告
      this.form.riskAssessmentReportFileInfo = this.dataToString(data[2].files);
      //应急资源调查报告
      this.form.resourceSurveyReportFileInfo = this.dataToString(data[3].files);
      //预案征求意见采纳、分歧处理结果
      this.form.differencesOfOpinionFileInfo = this.dataToString(data[4].files);
      //专家评审意见
      this.form.expertReviewOpinionsFileInfo = this.dataToString(data[5].files);
      //上级、本级预案文本法规清单
      this.form.textRegulationsFileInfo = this.dataToString(data[6].files);
      //其他事项说明
      this.form.otherRemark = this.dataToString(data[7].files);
    },
    save() {
      this.form.contactName = this.$store.state.user.name
      this.form.contactPhone = this.$store.state.user.phone
      this.form.recordId = this.recordId
      this.form.publishDeptId = this.form.pDeptId
      editRecord(this.form).then(response => {
        if (response.code === 200) {
          this.$modal.msgSuccess('保存成功！')
        }
      }).finally(() => {
        this.goBack()
      })
    },
    submit() {
      this.form.contactName = this.$store.state.user.name
      this.form.contactPhone = this.$store.state.user.phone
      this.form.recordId = this.recordId
      this.form.publishDeptId = this.form.pDeptId
      recordReport(this.form).then(response => {
        if (response.code === 200) {
          this.$modal.msgSuccess('提交成功！')
        }
      }).finally(() => {
        this.goBack()
      })
    },
    findAudit(planId) {
      findByPlanId(planId).then(res => {
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
    /**
     * 应急预案备案申请表下载
     */
    downloadRecordDeclareHandle() {
      if (this.form.reportingDeptId) {
        let depts = this.treeToArr(this.deptData)
        let dept = depts.find(item => this.form.reportingDeptId == item.deptId)
        let data = {
          planId: this.form.planId,
          contactName: this.$store.state.user.name,
          contactPhone: this.$store.state.user.phone,
          planName: this.form.planName,
          preparationDeptName: this.$store.state.user.deptName,
          reportingDeptName: dept.deptName
        }
        downloadRecordDeclare(data).then(res => {
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
      } else {
        this.$refs["form"].validateField('reportingDeptId')
      }
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
    changeHandle() {
      this.$forceUpdate()
    }
  }
}
</script>


<style lang="scss">
#addRecord {
  .bottom-file {
    position: relative;

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

    .right-button {
      position: absolute;
      top: 8px;
      right: 1px;
    }

  }
}
</style>
