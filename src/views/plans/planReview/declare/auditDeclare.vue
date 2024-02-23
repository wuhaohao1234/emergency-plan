<!--审核申报-->
<template>
  <div id="addReport">
    <el-page-header @back="goBack" content="审核申报" style="margin-bottom: 20px"></el-page-header>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="预案名称" prop="planName">
            <el-input v-model="form.planName" placeholder="请输入预案名称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预案体系" prop="planTypeFullPath">
            <el-select style="width: 100%" v-model="form.planTypeFullPath" placeholder="请选择预案体系" clearable>
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
        <el-col :span="24">
          <el-form-item label="事件类别" prop="emergencyTypeFullPath">
            <el-cascader
              v-model="form.emergencyTypeFullPath"
              style="width: 100%;"
              :options="options"
              :props="props"
              placeholder="请选择事件类别"
              @change="changeHandle"
              clearable></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="行政级别" prop="planSystemFullPath">
            <el-select style="width: 100%" v-model="form.planSystemFullPath" @change="changeHandle"
                       placeholder="请选择行政级别" clearable>
              <el-option
                v-for="dict in (type==='1'?dict.type['26']:dict.type['525'])"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编制单位" prop="preparationDeptId">
            <treeselect style="width: 100%" no-results-text="无部门数据"
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
          <el-form-item prop="reportingDeptId" label="受理部门">
            <treeselect no-results-text="无部门数据"
                        v-model="form.reportingDeptId"
                        :options="deptData"
                        :normalizer="normalizer"
                        :show-count="true"
                        placeholder="选择受理部门"
            />
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
    </el-form>
    <div style="margin-left: 20px;font-size: 14px">
      <div v-for="item in fileList" :key="item.type" class="fileCheckbox">
        <el-checkbox v-model="item.isHas" disabled style="margin-right: 10px"></el-checkbox>
        <span>{{ item.name }}</span>
        <span v-if="item.isRequired" style="color: red;font-size: 15px;">&emsp;*</span>
        <el-button @click="downloadSubmissionFormHandle" style="margin-left: 10px"
                   size="mini" type="primary" v-if="item.type==1">送审稿模板下载</el-button>
        <div style="display: inline-block;margin: 0 8px">
          <file-upload :fileType="['doc','docx','pdf','png','jpeg','jpg']" :isShowTip="false" :buttonType="'svg'"
                       :showList="false"
                       @input="getFileData($event,item)" :value=item.files></file-upload>
        </div>
        <span style="color:red;font-size: 11px" v-if="item.showTips">请上传当前文件</span>
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
import {planReport, reportSave, reportSubmit, findAuditById, downloadSubmissionForm} from "@/api/plans/planAudit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getDicts} from "@/api/system/dict/data";

export default {
  dicts: ['4', '26', '525','601', '608', '611', '622', '531','632','662'],
  name: "auditDeclare",
  components: {Treeselect},
  data() {
    return {
      saveVisible: false,
      submitVisible: false,
      saveLoading: false,
      submitLoading: false,
      cancelVisible: false,
      type: "1",
      options: [],
      props: {multiple: true},
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
        planName: [
          {required: true, message: "预案名称不能为空", trigger: "blur"}
        ],
        preparationDeptId: [
          {required: true, message: "编制单位不能为空", trigger: "blur"}
        ],
        emergencyTypeFullPath: [
          {required: true, message: "事件类别不能为空", trigger: "blur"}
        ],
        planTypeFullPath: [
          {required: true, message: "预案体系不能为空", trigger: "blur"}
        ],
        planSystemFullPath: [
          {required: true, message: "行政级别不能为空", trigger: "blur"}
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
      ],
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init(data) {
      this.getDeptData()
      this.form.preparationDeptId = this.$store.state.user.deptId
      this.type = sessionStorage.getItem('BUSINESS_TYPE')
      if (data) {
        this.findAudit(data)
      }
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

    saveHandle() {
      this.saveLoading = true;
      this.cancelVisible = true;
      this.submitVisible = true;
      this.buildData(this.fileList)
      this.save()

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
      //应急预案送审稿
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
      let str = "";
      this.form.emergencyTypeFullPath.forEach(item => {
        str += item.join(',') + ';'
      })
      this.form.addOrEditPlanModel = {
        planId: this.form.planId,
        planName: this.form.planName,
        emergencyTypeFullPath: str,
        planSystemFullPath: this.form.planSystemFullPath,
        preparationDeptId: this.$store.state.user.deptId,
        planFileInfo: this.form.planFile ? JSON.stringify(this.form.planFile) : ''
      }
      reportSave(this.form).then(response => {
        if (response.code === 200) {
          this.$modal.msgSuccess('保存成功！')
        }
      }).finally(() => {
        this.goBack()
      })
    },
    submit() {
      let str = "";
      this.form.emergencyTypeFullPath.forEach(item => {
        str += item.join(',') + ';'
      })
      this.form.addOrEditPlanModel = {
        planId: this.form.planId,
        planName: this.form.planName,
        emergencyTypeFullPath: str,
        planSystemFullPath: this.form.planSystemFullPath,
        preparationDeptId: this.$store.state.user.deptId,
        planFileInfo: this.form.planFile ? JSON.stringify(this.form.planFile) : ''
      }
      reportSubmit(this.form).then(response => {
        if (response.code === 200) {
          this.$modal.msgSuccess('提交成功！')
        }
      }).finally(() => {
        this.goBack()
      })
    },
    findAudit(id) {
      findAuditById(id).then(res => {
        if (res.code === 200) {
          this.form = res.data
          this.$set(this.form,'planName',res.data.planInfo.planName)
          this.form.preparationDeptId = res.data.planInfo.preparationDeptId
          this.form.planFile = res.data.planInfo.planFileInfo ? JSON.parse(res.data.planInfo.planFileInfo) : undefined
          this.form.planId = res.data.planInfo.planId
          let typeStr = res.data.planInfo.emergencyTypeFullPath;
          let pType = typeStr.split(';');
          this.form.emergencyTypeFullPath = []
          pType.filter(Boolean).forEach(item => {
            let arr = item.split(',')
            this.form.emergencyTypeFullPath.push(arr.map(Number));
          })
          this.form.planSystemFullPath = res.data.planInfo.planSystemFullPath ? +res.data.planInfo.planSystemFullPath : undefined
          //应急预案送审稿
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
    },
    getFile(file) {
      this.form.planFile = file
    },
    changeHandle() {
      this.$forceUpdate()
    },
    /**
     * 审核送审稿下载
     */
    downloadSubmissionFormHandle() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let depts = this.treeToArr(this.deptData)
          let dept = depts.find(item => this.form.reportingDeptId == item.deptId)
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
