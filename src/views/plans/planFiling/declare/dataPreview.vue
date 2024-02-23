<!--基本资料-->
<template>
  <div id="basicData">
    <div style="margin: 0 0 10px 20px">
      <el-button type="primary" size="mini" @click="batchDownload">批量下载</el-button>
    </div>
    <div style="margin-left: 20px;font-size: 14px">
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

  </div>
</template>

<script>
import {viewFile} from '@/api/file';
import {getToken} from "@/utils/auth";
import JSZip from "jszip";
import {parseTime} from "../../../../utils/ruoyi";

export default {
  name: "basicData",
  props: {
    recordData: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.getDocuments(this.recordData)
  },
  data() {
    return {
      fileList: [
        {type: 1, isChecked: false, name: '应急预案备案申请表', isRequired: true, files: []},
        {type: 2, isChecked: false, name: '应急预案电子文本或简本', isRequired: true, files: []},
        {type: 3, isChecked: false, name: '风险评估报告', isRequired: true, files: []},
        {type: 4, isChecked: false, name: '应急资源调查报告', isRequired: true, files: []},
        {type: 5, isChecked: false, name: '应急预案征求意见和采纳意见情况说明、分歧意见的处理依据和结果', isRequired: true, files: []},
        {type: 6, isChecked: false, name: '专家评审意见', isRequired: true, files: []},
        {type: 7, isChecked: false, name: '上级应急预案、本级相关应急预案等预案文本、有关法律法规清单', isRequired: true, files: []},
        {type: 8, isChecked: false, name: '需要说明的其他事项', isRequired: false, files: []},
      ],
    }
  },
  methods: {
    //获取预案申报时的文件
    getDocuments(data) {
      //应急预案送审表
      this.fileList[0].files = this.dataParse(data.declarationFormFileInfo)
      //应急预案简本
      this.fileList[1].files = this.dataParse(data.simplifiedFileInfo)
      //风险评估报告
      this.fileList[2].files = this.dataParse(data.riskAssessmentReportFileInfo)
      //应急资源调查报告
      this.fileList[3].files = this.dataParse(data.resourceSurveyReportFileInfo)
      //预案征求意见采纳、分歧处理结果
      this.fileList[4].files = this.dataParse(data.differencesOfOpinionFileInfo)
      //专家评审意见
      this.fileList[5].files = this.dataParse(data.expertReviewOpinionsFileInfo)
      //上级、本级预案文本法规清单
      this.fileList[6].files = this.dataParse(data.textRegulationsFileInfo)
      //其他补充说明
      this.fileList[7].files = this.dataParse(data.otherRemark)
    },
    dataParse(data) {
      return data ? JSON.parse(data) : []
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

<style scoped>

</style>
