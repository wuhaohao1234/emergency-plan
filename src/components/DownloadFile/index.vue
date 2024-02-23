<template>
  <div id="downloadFile">
    <el-button class="downloadButton" type="text" :size="size"
               style="color:#1e87f6;padding: 0;">
      <span v-if="buttonDesc===1" @click="viewHandle">{{ buttonDescText?buttonDescText:fileName }}&emsp;&emsp;</span>
      <i class="el-icon-download" style="font-size: 16px" v-if="buttonDesc===1" @click="downloadHandle"></i>
      <span v-if="buttonDesc===2" @click="downloadHandle">下载</span>
    </el-button>
    <el-dialog :visible.sync="previewVisible" width="100%">
      <!-- 预览图片-->
      <img v-if="imgVisible" :src="imgUrl" alt="" style="width: 100%;"/>
      <!-- <iframe v-if="docVisible" :src="fileUrl" width="100%" height="500"></iframe> -->
      <!-- 预览DOCX-->
      <div ref="file"></div>
      <!-- 预览DOC-->
      <iframe v-if="docVisible" :src="fileUrl" width="100%" height="500"/>
      <!-- 预览PDF文件 -->
      <vue-pdf v-if="pdfVisible" style="display: block" :src="pdfUrl"></vue-pdf>
    </el-dialog>
  </div>
</template>

<script>
import VuePdf from 'vue-pdf'
import {getToken} from "@/utils/auth";
import {enFileView, viewFile} from '@/api/file'
import docx from 'docx-preview'
export default {
  name: "index",
  props: {
    fileName: {
      type: String,
      default: '',
    },
    fileKey: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'medium',
    },
    //下载按钮描述 1、文件名称 2、下载
    buttonDesc: {
      type: Number,
      default: 1
    },
    buttonDescText: {
      type: String,
      default: '',
    }
  },
  components: {
    VuePdf,
  },
  data() {
    return {
      businessType: sessionStorage.getItem('BUSINESS_TYPE'),
      previewVisible: false,
      imgVisible: false,
      docVisible: false,
      pdfVisible: false,
      imgUrl: "",
      fileUrl: "",
      pdfUrl: "",
    }
  },
  methods: {
    viewHandle() {
      this.previewVisible = true;
      console.log(this.businessType)
      let data = { fileKey: this.fileKey, token: getToken() };
      (this.businessType == 1 ? viewFile(data) : enFileView(data)).then(res => {
        let fileType = 'application/octet-stream'
        let type = this.fileName.substring(this.fileName.lastIndexOf(".") + 1);
        if (type === 'docx') {
          fileType = 'application/msword';
        } else if (type === 'doc') {
          fileType = 'application/msword';
          this.docVisible = true;
        } else if (type === 'pdf') {
          fileType = 'application/pdf';
          this.pdfVisible = true;
        } else if (type === 'xls' || type === 'xlsx') {
          fileType = 'application/vnd.ms-excel'
        } else {
          this.imgVisible = true;
        }
        // 转换为 Blob 对象
        const blob = new Blob([res], {type: fileType});
        const url = URL.createObjectURL(blob);
        // 创建临时下载链接
        if (this.imgVisible === true) {
          this.imgUrl = url;
        } else if (this.docVisible === true) {
          this.fileUrl = url
        } else if (this.pdfVisible === true) {
          this.pdfUrl = url;
        } else {
          let docx = require("docx-preview");
          docx.renderAsync(res, this.$refs.file);
        }
      });
    },
    //下载文件
    downloadHandle() {
      // 假设你有一个用于获取文件流的函数 viewFile，并且已经定义了 this.fileKey 和 getToken 函数
      const data = { fileKey: this.fileKey, token: getToken() };
      (this.businessType == 1 ? viewFile(data) : enFileView(data)).then(res => {
        console.log(res)
        let fileType = 'application/octet-stream'
        let type = this.fileName.substring(this.fileName.lastIndexOf(".") + 1);
        if (type === 'doc' || type === 'docx') {
          fileType = 'application/msword'
        } else if (type === 'pdf') {
          fileType = 'application/pdf'
        } else if (type === 'xls' || type === 'xlsx') {
          fileType = 'application/vnd.ms-excel'
        }
        // 转换为 Blob 对象
        const blob = new Blob([res], {type: fileType});
        // 创建临时下载链接
        const downloadUrl = URL.createObjectURL(blob);
        // 创建 <a> 标签
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = this.fileName; // 设置新的文件名及扩展名
        // 手动触发下载
        link.click();
        // 清理临时下载链接
        URL.revokeObjectURL(downloadUrl);
      })
    }
  },
  beforeDestroy() {
    // 在组件销毁之前释放 URL 对象，以防内存泄漏
    if (this.fileUrl) {
      URL.revokeObjectURL(this.fileUrl);
    }
  },
}
</script>

<style scoped>
.downloadButton :hover {
  color: #61adfd;
}
</style>
