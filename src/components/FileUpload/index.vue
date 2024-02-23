<template>
  <div class="upload-file">
    <el-upload
      multiple
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
      ref="fileUpload"
    >
      <!-- 上传按钮 -->
      <el-button size="mini" type="primary" v-if="buttonType==='button'">选取文件</el-button>
      <el-button size="mini" type="text" style="color: #1890ff;font-size: 20px" v-if="buttonType==='svg'">
        <span style="font-size: 14px">{{ buttonText }}&emsp;&emsp;</span>
        <svg-icon :icon-class="'upload'"/>
      </el-button>
      <!-- 上传提示 -->
      <div class="el-upload__tip" slot="tip" v-if="showTip">
        请上传
        <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
        <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
        的文件
      </div>
    </el-upload>

    <!-- 文件列表 -->
    <transition-group v-if="showList" class="upload-file-list el-upload-list el-upload-list--text"
                      name="el-fade-in-linear" tag="ul">
      <li :key="file.fileKey" class="el-upload-list__item ele-upload-list__item-content"
          v-for="(file, index) in fileList" style="width: 90%">
        <el-link @click="downloadHandle(file)" :headers="headers" :underline="false" target="_blank">
          <span><i class="el-icon-document file-icon"></i> {{ file.fileName }}</span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDelete(index)" type="danger">
            <i class="el-icon-close"></i>
          </el-link>
        </div>
      </li>
      <div v-if="showDetails==true" :key="uniqueKey">
        <el-row>
          <el-button type="text" icon="el-icon-close" @click="closeDetails" style="float: right;margin-right: 30px"></el-button>
        </el-row>
        <img v-if="imgVisible" :src="imgUrl" alt="" style="width: 100%;"/>
        <!-- 预览DOCX-->
        <div ref="file"></div>
        <!-- 预览DOC-->
        <iframe v-if="docVisible" :src="fileUrl" width="100%" height="500"/>
        <!-- 预览PDF文件 -->
        <vue-pdf v-if="pdfVisible" style="display: block" :src="pdfUrl"></vue-pdf>
      </div>
    </transition-group>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth";
import {enFileView, viewFile} from '@/api/file'
import VuePdf from 'vue-pdf'
import docx from 'docx-preview'

export default {
  name: "FileUpload",
  props: {
    // 值
    value: [String, Object, Array],
    // 数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 10,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc", "xls", "ppt", "txt", "pdf", "jpg", "png", "jpeg", "xlsx", "docx", "txt"],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    // 上传按钮显示风格
    buttonType: {
      type: String,
      default: 'button'
    },
    // 是否显示文件列表
    showList: {
      type: Boolean,
      default: true
    },
    // 按钮文字
    buttonText: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      businessType: sessionStorage.getItem('BUSINESS_TYPE'),
      number: 0,
      uploadList: [],
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传文件服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      fileList: [],
      uniqueKey: 1,
      showDetails: false,
      imgVisible: false,
      docVisible: false,
      pdfVisible: false,
      imgUrl: "",
      fileUrl: "",
      pdfUrl: "",
    };
  },
  components:{
    VuePdf
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          let temp = 1;
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(',');
          // 然后将数组转为对象数组
          this.fileList = list.map(item => {
            if (typeof item === "string") {
              item = {fileName: item, fileKey: item};
            }
            // item.uid = item.uid || new Date().getTime() + temp++;
            return item;
          });
        } else {
          this.fileList = [];
          return [];
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
  },
  methods: {
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        const fileName = file.name.split('.');
        const fileExt = fileName[fileName.length - 1];
        const isTypeOk = this.fileType.indexOf(fileExt) >= 0;
        if (!isTypeOk) {
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      this.$modal.loading("正在上传文件，请稍候...");
      this.number++;
      return true;
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
    },
    // 上传失败
    handleUploadError(err) {
      this.$modal.msgError("上传文件失败，请重试");
      this.$modal.closeLoading()
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.uploadList.push({fileName: res.data.fileName, fileKey: res.data.fileKey});
        console.log("upload",this.uploadList)
        this.uploadedSuccessfully();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
        this.uploadedSuccessfully();
      }
    },
    // 删除文件
    handleDelete(index) {
      this.fileList.splice(index, 1);
      this.$emit("input", this.listToString(this.fileList));
    },
    //关闭预览详情
    closeDetails() {
      this.showDetails = false
    },
    // 上传结束处理
    uploadedSuccessfully() {
      if (this.number > 0 && this.uploadList.length === this.number) {
        this.fileList = this.fileList.concat(this.uploadList);
        console.log("fileList",this.fileList)
        this.uploadList = [];
        this.number = 0;
        // this.$emit("input", this.listToString(this.fileList));
        this.$emit("input", this.fileList);
        this.$modal.closeLoading();
      }
    },
    // 获取文件名称
    getFileName(name) {
      if (name.lastIndexOf("/") > -1) {
        return name.slice(name.lastIndexOf("/") + 1);
      } else {
        return "";
      }
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        strs += list[i].fileKey + separator;
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : '';
    },
    //下载文件
    downloadHandle(file) {
      let {fileKey, fileName} = file
      let data = {fileKey, token: getToken()}
      this.showDetails = true;
      (this.businessType == 1 ? viewFile(data) : enFileView(data)).then(res => {
        let fileType = 'application/octet-stream'
        let type = fileName.substring(fileName.lastIndexOf(".") + 1);
        if (type === 'docx') {
          fileType = 'application/msword';
        }else if(type === 'doc'){
          fileType = 'application/msword';
          this.docVisible = true;
        }else if (type === 'pdf') {
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
        }else {
          let docx = require("docx-preview");
          docx.renderAsync(res, this.$refs.file);
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 4;
  background: #f6f7f8;
  margin-bottom: 10px;
  position: relative;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
  margin-bottom: 30px;
  font-size: 22px;
}

.file-icon {
  width: 40px;
  height: 40px;
  background: #b9bcc1;
  border-radius: 10%;
  line-height: 1.8;
  margin-left: 10px;
  text-align: center;
  color: white;
  font-size: 20px;
}
</style>
