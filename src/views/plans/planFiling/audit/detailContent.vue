<!--事件情况-->
<template>
  <div id="detailContent">
    <div v-for="(item,index) in dataList" :key="item.id" v-if="contentType==1" style="margin-bottom: 5px;">
      <span class="leftTitle">·</span>
      <span class="rightSpan">{{ item.content }}</span>
    </div>
    <div v-if="contentType==2">
      <el-image
        v-for="(item,index) in imgList"
        :key="index"
        style="width: 148px; height: 148px;margin: 0 10px 10px 0"
        :src="item.url"
        :preview-src-list="[item.url]">
      </el-image>
    </div>
    <div v-if="contentType==3">
      <org-tree ref="orgTree" :orgList="orgData" :handleType="1"></org-tree>
    </div>
    <el-empty :image="require('@/assets/images/empty.png')" description=" " v-if="dataList.length==0&&contentType!=3"></el-empty>
  </div>
</template>

<script>
import {enFileView, viewFile} from '@/api/file'
import {getToken} from "@/utils/auth";
import OrgTree from "../declare/orgTree";

export default {
  name: "detailContent",
  components: {OrgTree},
  props: {
    dataList: {
      type: Array,
      default:  () => ([])
    },
    contentType: {
      type: Number,//1.文本 2.图片 3.组织机构
      default: 1
    },
    orgData:{
      type: Object,
      default:  () => ({})
    }
  },
  watch: {
    dataList: {
      handler(newVal, oldVal) {
        if (this.contentType == 2) {
          this.buildImgUrl()
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      imgList: [],
    }
  },
  methods: {
    /**
     * 处理图片地址
     */
    async buildImgUrl() {
      this.imgList = []
      if (this.dataList.length > 0) {
        await this.dataList.forEach(item => {
          let img = JSON.parse(item.content)
          let data = {fileKey: img.fileKey, token: getToken()};
          (sessionStorage.getItem('BUSINESS_TYPE') == '1' ? viewFile(data) : enFileView(data)).then(response => {
            const blob = new Blob([response], {type: 'application/octet-stream'});
            item.url = URL.createObjectURL(blob);
            this.imgList.push(item)
          })
        })
      }
    }
  }
}
</script>

<style lang="scss">
#detailContent {
  height: 400px;
  overflow: auto;
  color: white;

  .leftTitle {
    font-size: 22px;
    font-weight: 1000;
    color: #bec2c6;
    margin-right: 20px;
  }

  .rightSpan {
    font-size: 18px;
    font-weight: 500;
  }

  .box-card {
    background: none;
    border: 1px solid #47A2ED;
    color: white;
  }

  .el-card__body {
    padding: 10px;
  }

  #orgTree .org-tree-container {
    background-color: transparent;
  }
}

</style>
