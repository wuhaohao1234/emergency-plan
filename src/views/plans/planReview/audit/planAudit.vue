<template>
  <div class="planAudit">
    <el-page-header @back="goBack" :content="handleType===1?'申报详情':'预案审核'"
                    style="margin-bottom: 20px"></el-page-header>
    <el-descriptions style="margin-left: 20px">
      <el-descriptions-item label="预案名称">{{
          auditInfo.planInfo ? auditInfo.planInfo.planName : ''
        }}
      </el-descriptions-item>
      <el-descriptions-item label="编制单位">{{
          auditInfo.planInfo ? auditInfo.planInfo.preparationDeptName : ''
        }}
      </el-descriptions-item>
      <el-descriptions-item label="联系人">{{ auditInfo.contactName }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ auditInfo.contactPhone }}</el-descriptions-item>
      <el-descriptions-item label="单位地址">{{ auditInfo.deptAddress }}</el-descriptions-item>
    </el-descriptions>
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label" v-if="handleType===1"><i class="el-icon-tickets"></i>申报信息</span>
        <span slot="label" v-if="handleType===2"><i class="el-icon-download"></i>资料预览、下载</span>
        <div style="margin-left: 20px;font-size: 14px">
          <div style="margin: 0 0 10px 0">
            <el-button type="primary" size="mini" @click="batchDownload">批量下载</el-button>
          </div>
          <div v-for="item in fileList" :key="item.type" style="margin-bottom: 15px">
            <el-checkbox :disabled="!item.files.length" v-model="item.isChecked" style="margin-right: 10px"></el-checkbox>
            <span>{{ item.name }}</span>
            <span v-if="item.isRequired" style="color: red;font-size: 15px;">&emsp;*</span>
            <br>
            <div v-for="(file,index) in item.files" style="display: inline-block;margin:13px 10px 0 0">
              <download-file :fileKey="file.fileKey" :fileName="file.fileName"></download-file>
            </div>
          </div>
        </div>
        <div style="float: right" v-if="handleType===2">
          <el-button type="primary" size=small @click="activeName='second'">去审核</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second" v-if="handleType===2">
        <span slot="label"><i class="el-icon-document-checked"></i>审核意见提交</span>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <div style="margin-left: 20px;font-size: 14px;line-height: 40px">
                <div v-for="item in conditionList" :key="item.type">
                  <el-checkbox v-model="item.isConform" style="margin-right: 10px"></el-checkbox>
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="12" style="margin-left: -20px">
              <el-col :span="24">
                <el-form-item prop="auditStatus" label="审核结果">
                  <el-radio-group v-model="form.auditStatus">
                    <el-radio :label="1">审核通过</el-radio>
                    <el-radio :label="0">退回</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="form.auditStatus===0">
                <el-form-item prop="reason" label="退回意见">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入退回意见"
                    v-model="form.reason">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <div style="float: right;">
                  <el-button type="primary" size=small @click="submitHandle"
                             :disabled="!(form.auditStatus===0||(form.sealedOpinionForm&&form.sealedOpinionForm.length>0))">
                    审核意见提交
                  </el-button>
                </div>
              </el-col>
              <el-col style="margin-top: 20px" :span="24" v-if="form.auditStatus===1">
                <el-alert
                  title="请优先下载审核意见表，盖章后上传审核意见表"
                  show-icon
                  :closable="false"
                  type="warning">
                </el-alert>
              </el-col>
              <el-col style="margin-left: 40px" :span="24" v-if="form.auditStatus===1">
                <el-button type="text" @click="downloadReviewForm">①&nbsp;审核意见表下载&emsp;&emsp;
                  <i class="el-icon-download" style="font-size: 17px"></i></el-button>
              </el-col>
              <el-col style="margin-left: 40px" :span="24" v-if="form.auditStatus===1">
                <file-upload :fileType="['doc','docx','pdf','png','jpeg','jpg']" :isShowTip="false"
                             :buttonType="'svg'"
                             :limit="1" :buttonText="'②\xa0盖章后意见表上传'" :value="form.sealedOpinionForm"
                             @input="getFileData"></file-upload>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="third" v-if="handleType===1&&(auditInfo.status==='reviewed'||auditInfo.status==='returned')">
        <span slot="label"><i class="el-icon-document-checked"></i>审核意见</span>
        <el-row>
          <el-col :span="12">
            <div style="margin-left: 20px;font-size: 14px;line-height: 40px">
              <div v-for="(item,index) in auditItems" :key="index" class="fileCheckbox">
                <el-checkbox disabled v-model="item.isConform" style="margin-right: 10px"></el-checkbox>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form :model="auditData" ref="queryForm" size="small" :inline="true">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="经办人" prop="planName">
                    {{ auditData.auditName }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="联系电话" prop="planName">
                    {{ auditData.auditPhone }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="审核结论" prop="planName">
                    <el-tag v-if="auditData.status==='reviewed'" type="success">审核通过</el-tag>
                    <el-tag v-if="auditData.status==='returned'" type="danger">退回</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="auditData.status==='returned'">
                  <el-form-item label="退回意见" prop="reason">
                    <span>{{ auditData.reason }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <download-file v-if="form.sealedOpinionFormFileInfo" v-for="file in form.sealedOpinionFormFileInfo"
                                 :key="file.fileKey"
                                 :fileName="file.fileName" buttonDescText="应急预案审核意见表"
                                 :fileKey="file.fileKey"></download-file>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {findAuditById, auditReturned, auditReviewed, downloadCommentForm} from '@/api/plans/planAudit'
import {viewFile} from '@/api/file';
import {getToken} from "@/utils/auth";
import JSZip from "jszip";
import {parseTime} from "../../../../utils/ruoyi";
export default {
  props: {
    handleType: {
      type: Number,
      default: 1,//1.详情 2.审核
    }
  },
  name: "planAudit",
  components: {},
  data() {
    return {
      auditData: {},
      activeName: 'first',
      // 表单参数
      form: {
        auditName: '',
        auditPhone: '',
        reason: '',
        auditStatus: 1,
        sealedOpinionForm: []
      },
      // 表单校验
      rules: {
        auditStatus: [
          {required: true, message: "审核结论不能为空", trigger: "blur"}
        ],
        reason: [
          {required: true, message: "退回原因不能为空", trigger: "blur"}
        ],
      },
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
      ],
      conditionList: [
        {isConform: true, name: '应急预案符合有关法律法规要求',},
        {isConform: true, name: '按照本办法规定的程序进行编制',},
        {isConform: true, name: '与上级应急预案、本级政府总体应急预案以及其他有关应急预案有效衔接',},
        {isConform: true, name: '预案主体内容完备',},
        {isConform: true, name: '组织指挥体系责任分工合理明确',},
        {isConform: true, name: '应急响应级别设计合理',},
        {isConform: true, name: '应对措施具体简明、管用可行',},
        {isConform: true, name: '预案各方面达成一致意见',},
        {isConform: true, name: '同意报送政府印发',},
        {isConform: false, name: '退回修改后，再次报送',},
      ],
      auditItems: [],
      auditInfo: {}
    }
  },
  watch: {
    'form.auditStatus'(newVal) {
      this.conditionList.forEach((item, index) => {
        item.isConform = newVal !== 0
        if (index === 9) {
          item.isConform = newVal !== 1
        }
      })
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init(planData) {
      this.getPlanInfo(planData)
    },
    getFileData(data) {
      this.$set(this.form, 'sealedOpinionForm', data)
    },
    handleClose(tag, data) {
      data.files = data.files.filter(item => item.path === tag)
    },
    getPlanInfo(plan) {
      findAuditById(plan.auditId).then(res => {
        this.auditInfo = res.data
        this.auditData = res.data
        this.auditItems = JSON.parse(res.data.auditItems)
        this.form.sealedOpinionFormFileInfo = res.data.sealedOpinionFormFileInfo ? JSON.parse(res.data.sealedOpinionFormFileInfo) : undefined
        this.form.reportingDeptId = res.data.reportingDeptId
        this.form.auditName = this.$store.state.user.name
        this.form.auditPhone = this.$store.state.user.phone
        //应急预案送审表
        this.fileList[0].files = this.dataParse(this.auditInfo.submissionFormFileInfo)
        this.fileList[0].isHas = !!this.auditInfo.submissionFormFileInfo
        //应急预案简本
        this.fileList[1].files = this.dataParse(this.auditInfo.simplifiedFileInfo)
        this.fileList[1].isHas = !!this.auditInfo.simplifiedFileInfo
        //风险评估报告
        this.fileList[2].files = this.dataParse(this.auditInfo.riskAssessmentReportFileInfo)
        this.fileList[2].isHas = !!this.auditInfo.riskAssessmentReportFileInfo
        //应急资源调查报告
        this.fileList[3].files = this.dataParse(this.auditInfo.resourceSurveyReportFileInfo)
        this.fileList[3].isHas = !!this.auditInfo.resourceSurveyReportFileInfo
        //预案征求意见采纳、分歧处理结果
        this.fileList[4].files = this.dataParse(this.auditInfo.differencesOfOpinionFileInfo)
        this.fileList[4].isHas = !!this.auditInfo.differencesOfOpinionFileInfo
        //专家评审意见
        this.fileList[5].files = this.dataParse(this.auditInfo.expertReviewOpinionsFileInfo)
        this.fileList[5].isHas = !!this.auditInfo.expertReviewOpinionsFileInfo
        //上级、本级预案文本法规清单
        this.fileList[6].files = this.dataParse(this.auditInfo.textRegulationsFileInfo)
        this.fileList[6].isHas = !!this.auditInfo.textRegulationsFileInfo
        //应急预案修编说明
        this.fileList[7].files = this.dataParse(this.auditInfo.revisionRemark)
        this.fileList[7].isHas = !!this.auditInfo.revisionRemark
        //其他事项说明
        this.fileList[8].files = this.dataParse(this.auditInfo.otherRemark)
        this.fileList[8].isHas = !!this.auditInfo.otherRemark
        //补充资料
        this.fileList[9].files = this.dataParse(this.auditInfo.replenishFileInfo)
        this.fileList[9].isHas = !!this.auditInfo.replenishFileInfo
      })
    },
    dataParse(data) {
      return data ? JSON.parse(data) : []
    },
    //提交
    submitHandle() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.auditId = this.auditInfo.auditId
          this.form.auditItems = JSON.stringify(this.conditionList)
          this.form.sealedOpinionFormFileInfo = this.form.sealedOpinionForm ? JSON.stringify(this.form.sealedOpinionForm) : ''
          if (this.form.auditStatus === 1) {
            //审核通过
            auditReviewed(this.form).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess('审核成功！')
              }
            }).finally(() => {
              this.goBack()
            })
          } else {
            //退回
            auditReturned(this.form).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess('审核成功！')
              }
            }).finally(() => {
              this.goBack()
            })
          }
        }
      })
    },
    /**
     *  审核意见表下载
     */
    downloadReviewForm() {
      let data = {
        auditName: this.$store.state.user.name,
        auditPhone: this.$store.state.user.phone,
        deptAddress: this.auditInfo.deptAddress,
        planName:this.auditInfo.planInfo.planName,
        preparationDeptName:this.auditInfo.planInfo.preparationDeptName,
        reportingDeptName:this.$store.state.user.deptName
      }
      downloadCommentForm(data).then(res=>{
          let fileType = 'application/msword'
          // 转换为 Blob 对象
          const blob = new Blob([res], {type: fileType});
          // 创建临时下载链接
          const downloadUrl = URL.createObjectURL(blob);
          // 创建 <a> 标签
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = '应急预案审核意见表.docx'; // 设置新的文件名及扩展名
          // 手动触发下载
          link.click();
          // 清理临时下载链接
          URL.revokeObjectURL(downloadUrl);
      }
      )
    },
    //批量下载
    batchDownload() {
      let checkedList = this.fileList.filter(item => item.isChecked);
      if (checkedList.length) {
        const zip = new JSZip()
        const promises = []
        checkedList.forEach(item => {
          item.files.forEach(file => {
            const data = {fileKey: file.fileKey, token: getToken()};
            const promise = viewFile(data).then(res => {
              zip.file(file.fileName, res, {binary: true})
            })
            promises.push(promise)
          })
        })
        Promise.all(promises).then(() => {
          zip.generateAsync({ type: 'blob' }).then(content => {
            saveAs(content, parseTime(+new Date(),'{y}{m}{d}{h}{i}{s}') + '.zip')
          })
        })
      } else {
        this.$modal.msgWarning("请先勾选文件")
      }
    }
  }
}
</script>

<style lang="scss">
.planAudit {
  .el-descriptions-item__label:not(.is-bordered-label) {
    margin-right: 10px;
    font-weight: bold;
  }
}

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
