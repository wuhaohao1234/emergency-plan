<template>
  <div id="addReport">
    <el-page-header @back="goBack" content="审核申报" style="margin-bottom: 20px"></el-page-header>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="预案名称" prop="planName">
            <el-input v-model="form.planName" disabled placeholder="请输入预案名称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编制单位" prop="preparationDeptId">
            <treeselect no-results-text="无部门数据"
              disabled
              v-model="form.preparationDeptId"
              :options="deptData"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择编制单位"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
                <el-col :span="12">
                  <el-form-item label="联系人" prop="contactName">
                    <el-input v-model="form.contactName" placeholder="请输入联系人" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="contactPhone">
                    <el-input v-model="form.contactPhone" placeholder="请输入联系电话" clearable/>
                  </el-form-item>
                </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="deptAddress" label="单位地址">
            <el-input v-model="form.deptAddress" placeholder="请输入单位地址" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="reportingDeptId" label="审核部门">
            <treeselect no-results-text="无部门数据"
              v-model="form.reportingDeptId"
              :options="deptData"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择审核部门"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-left: 20px;font-size: 14px">
      <div v-for="item in fileList" :key="item.type" class="fileCheckbox">
        <el-checkbox v-model="item.isHas" disabled style="margin-right: 10px"></el-checkbox>
        <span>{{ item.name }}</span>
        <span v-if="item.isRequired" style="color: red;font-size: 15px;">&emsp;*</span>
        <div style="display: inline-block;margin: 0 8px">
          <file-upload :fileType="['doc','docx','pdf','png','jpeg','jpg']" :isShowTip="false" :buttonType="'svg'" :showList="false"
                       @input="getFileData($event,item)" :value=item.files></file-upload>
        </div>
        <span style="color:red;font-size: 10px" v-if="item.showTips">请上传当前文件</span>
        <br>
        <el-tag
          style="margin-right: 5px"
          :key="index"
          v-for="(tag,index) in item.files"
          closable
          :disable-transitions="false"
          @close="handleClose(tag.fileKey,item)">
          {{ tag.fileName }}
        </el-tag>
      </div>
      <div style="margin-left:25px;color: #acaeb1;font-size: 12px">
        <span>补充填报相关法律法规、有关文件等补充资料</span>
      </div>
    </div>
    <div style="float: right;margin-bottom: 30px">
      <el-button @click="goBack" size="mini" :disabled="cancelVisible">取消</el-button>
      <el-button type="primary" size="mini" @click="saveHandle" :loading="saveLoading" :disabled="saveVisible">保存
      </el-button>
      <el-button type="primary" size="mini" @click="submitHandle" :loading="submitLoading" :disabled="submitVisible">
        审核申报
      </el-button>
    </div>
  </div>
</template>

<script>
import {listDeptTree} from "@/api/system/dept";
import {planReport, reportSave, reportSubmit, findAuditById,} from "@/api/plans/planAudit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "addReport",
  components: {Treeselect},
  data() {
    return {
      saveVisible: false,
      submitVisible: false,
      saveLoading: false,
      submitLoading: false,
      cancelVisible: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        contactName: [
          {required: true, message: "联系人不能为空", trigger: "blur"}
        ],
        contactPhone: [
          {required: true, message: "联系电话不能为空", trigger: "blur"},
          {pattern: /^1[3456789]\d{9}$/, message: "联系电话格式不正确", trigger: "blur"}
        ],
        deptAddress: [
          {required: true, message: "单位地址不能为空", trigger: "blur"}
        ],
        reportingDeptId: [
          {required: true, message: "审核部门不能为空", trigger: "blur"}
        ],
      },
      deptData: [],
      fileList: [
        {type: 1, isHas: false, showTips: false, name: '应急预案送审稿', isRequired: true, files: []},
        {type: 2, isHas: false, showTips: false, name: '应急预案或简本', isRequired: true, files: []},
        {type: 3, isHas: false, showTips: false, name: '风险评估报告', isRequired: true, files: []},
        {type: 4, isHas: false, showTips: false, name: '应急资源调查报告', isRequired: true, files: []},
        {type: 5, isHas: false, showTips: false, name: '应急预案征求意见和采纳意见情况说明、分歧意见的处理依据和结果', isRequired: true, files: []},
        {type: 6, isHas: false, showTips: false, name: '专家评审意见', isRequired: true, files: []},
        {type: 7, isHas: false, showTips: false, name: '上级应急预案、本级相关应急预案等预案文本、有关法律法规清单', isRequired: true, files: []},
        {type: 8, isHas: false, showTips: false, name: '应急修编说明', isRequired: false, files: []},
        {type: 9, isHas: false, showTips: false, name: '需要说明的其他事项', isRequired: false, files: []},
        {type: 10, isHas: false, showTips: false, name: '其他补充资料', isRequired: false, files: []},
      ]
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init(type, data) {
      this.getDeptData()
      if (type === 1) {
        this.form = data
      } else {
        this.findAudit(data)
      }
    },
    reportHandle(type) {
      let visible = true
      planReport(this.form.planId).then(response => {
        if (response.code === 200 && response.data.length) {
          this.form.auditId = response.data[0].auditId;
          if(type===1){
            this.save()
          }else {
            this.submit()
          }
        } else {
          visible = false
          this.$modal.msgError("操作失败，请稍后重试！");
          this.goBack()
        }
      });
      return visible;
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
      if (this.form.auditId) {
        this.save()
      } else {
        this.reportHandle(1)
      }

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
            if (this.form.auditId) {
              this.submit()
            } else {
              this.reportHandle(2)
            }
          }
        }
      })
    },
    buildData(data) {
      //应急预案送审表
      this.form.submissionFormFileInfo = this.dataToString(data[0].files);
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
      //应急预案修编说明
      this.form.revisionRemark = this.dataToString(data[7].files);
      //其他事项说明
      this.form.otherRemark = this.dataToString(data[8].files);
      //补充资料
      this.form.replenishFileInfo = this.dataToString(data[9].files);
    },
    save() {
      reportSave(this.form).then(response => {
        if (response.code === 200) {
          this.$modal.msgSuccess('保存成功！')
        }
      }).finally(()=>{
        this.goBack()
      })
    },
    submit() {
      reportSubmit(this.form).then(response => {
        if (response.code === 200) {
          this.$modal.msgSuccess('提交成功！')
        }
      }).finally(()=>{
        this.goBack()
      })
    },
    findAudit(id) {
      findAuditById(id).then(res => {
        if (res.code === 200) {
          this.form = res.data
          this.form.planName = res.data.planInfo.planName
          this.form.documentNumber = res.data.planInfo.documentNumber
          this.form.preparationDeptId = res.data.planInfo.preparationDeptId
          //应急预案送审表
          this.fileList[0].files = this.dataParse(this.form.submissionFormFileInfo)
          this.fileList[0].isHas = !!this.form.submissionFormFileInfo
          //应急预案简本
          this.fileList[1].files = this.dataParse(this.form.simplifiedFileInfo)
          this.fileList[1].isHas = !!this.form.simplifiedFileInfo
          //风险评估报告
          this.fileList[2].files = this.dataParse(this.form.riskAssessmentReportFileInfo)
          this.fileList[2].isHas = !!this.form.riskAssessmentReportFileInfo
          //应急资源调查报告
          this.fileList[3].files = this.dataParse(this.form.resourceSurveyReportFileInfo)
          this.fileList[3].isHas = !!this.form.resourceSurveyReportFileInfo
          //预案征求意见采纳、分歧处理结果
          this.fileList[4].files = this.dataParse(this.form.differencesOfOpinionFileInfo)
          this.fileList[4].isHas = !!this.form.differencesOfOpinionFileInfo
          //专家评审意见
          this.fileList[5].files = this.dataParse(this.form.expertReviewOpinionsFileInfo)
          this.fileList[5].isHas = !!this.form.expertReviewOpinionsFileInfo
          //上级、本级预案文本法规清单
          this.fileList[6].files = this.dataParse(this.form.textRegulationsFileInfo)
          this.fileList[6].isHas = !!this.form.textRegulationsFileInfo
          //应急预案修编说明
          this.fileList[7].files = this.dataParse(this.form.revisionRemark)
          this.fileList[7].isHas = !!this.form.revisionRemark
          //其他事项说明
          this.fileList[8].files = this.dataParse(this.form.otherRemark)
          this.fileList[8].isHas = !!this.form.otherRemark
          //补充资料
          this.fileList[9].files = this.dataParse(this.form.replenishFileInfo)
          this.fileList[9].isHas = !!this.form.replenishFileInfo
        }
      })
    },
    dataParse(data) {
      return data ? JSON.parse(data) : []
    },
    dataToString(data) {
      return data.length ? JSON.stringify(data) : ''
    }
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
