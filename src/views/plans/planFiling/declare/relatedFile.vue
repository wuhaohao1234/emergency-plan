<!--相关文件-->
<template>
  <div class="upload-file">
    <el-upload
      v-if="handleType===2"
      multiple
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
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
      <el-button size="mini" type="primary" style="margin-right: 10px">选取文件</el-button>
      <span style="color: #737579;font-size: 14px">支持doc、pdf格式、可一次性上传多个文件</span>
    </el-upload>

    <el-table :data="uploadList">
      <el-table-column prop="planName" label="序号" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="文件名称" :show-overflow-tooltip="true" width="380">
      </el-table-column>
      <el-table-column prop="addTime" label="上传时间" align="center" :show-overflow-tooltip="true" width="180">
      </el-table-column>
      <el-table-column prop="addUser" label="上传人" align="center" :show-overflow-tooltip="true" width="180">
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div style="display: inline-block;margin-right: 10px">
            <download-file  :fileName="scope.row.fileName" :fileKey="scope.row.fileKey" :buttonDesc="2" :size="'mini'"></download-file>
          </div>
          <el-button
            v-if="handleType===2"
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="a" label=""  min-width="10"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth";
import {parseTime} from "../../../../utils/ruoyi";
import {getRecordInfo, editRecord,enRecordAuditInfo} from "@/api/plans/planRecord";

export default {
  name: "relatedFile",
  props: {
    recordId: {
      type: Number,
      default: undefined,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ["doc", "xls", "ppt", "txt", "pdf", "jpg", "png", "jpeg", "xlsx", "docx", "txt", "svg"],
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 20,
    },
    // 数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 类型 1.应急处置简明手册 2.应急文书
    dataType: {
      type: Number,
      default: 1
    },
    handleType: {
      type: Number,
      default: 2, //1.查看详情 2.编辑
    }
  },
  data() {
    return {
      number: 0,
      uploadList: [],
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传文件服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      dataList: [],
      recordData: {},
      businessType:1,
    };
  },
  mounted() {
    this.getInfo()
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
        this.uploadList.push({
          fileKey: res.data.fileKey,
          fileName: res.data.fileName,
          addTime: parseTime(new Date()),
          addUser: this.$store.state.user.name
        });
        this.addHandle()
        this.$modal.closeLoading();
      } else {
        this.number--;
        this.$modal.closeLoading();
        this.$modal.msgError(res.msg);
        this.$refs.fileUpload.handleRemove(file);
      }
    },
    // 删除文件
    handleDelete(index) {
      this.uploadList.splice(index, 1);
      this.addHandle()
    },
    // 上传结束处理
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = "";
      separator = separator || ",";
      for (let i in list) {
        strs += list[i].url + separator;
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : '';
    },
    //下载
    handleDownload() {
    },
    //获取申报详情
    getInfo() {
      this.businessType=sessionStorage.getItem('BUSINESS_TYPE');
      (this.businessType==1?getRecordInfo:enRecordAuditInfo)(this.recordId).then(res => {
        this.recordData = res.data
        if (this.dataType === 1) {
          this.uploadList = res.data.conciseManual ? JSON.parse(res.data.conciseManual) : []
        } else {
          this.uploadList = res.data.emergencyDoc ? JSON.parse(res.data.emergencyDoc) : []
        }
      })
    },
    //添加
    addHandle() {
      let str = JSON.stringify(this.uploadList)
      let data = {
        recordId: this.recordId,
        conciseManual: this.dataType === 1 ? str : undefined,
        emergencyDoc: this.dataType === 2 ? str : undefined,
      }
      editRecord(data).then(res => {
      })
    }
  }
};
</script>

<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
</style>

