<!--应急预案详情-->
<template>
  <div id="planDetail">
    <el-dialog title="预案详情" :visible.sync="visible" width="70%"
               :before-close="goBack"
               append-to-body :close-on-click-modal="false">
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            预案名称
          </template>
          {{planData.planName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            事件类别
          </template>
          <el-tag style="margin-right: 10px" v-if="planData.emergencyTypeFullPath" v-for="(item,index) in buildTypeLabel(planData.emergencyTypeFullPath)" :key="index">
            <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
            <span>/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])" :value="item[1]"/></span>
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            行政级别
          </template>
          <dict-tag :options="(type==='1'?dict.type['26']:dict.type['525'])" v-if="planData.planSystemType" :value="planData.planSystemFullPath"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            编制单位
          </template>
          {{planData.preparationDeptName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            预案正文
          </template>
          <download-file v-if="planData.planFileInfo" v-for="item in planData.planFileInfo" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goBack">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getPlanInfo} from "@/api/plans/preplanRevision";
export default {
  dicts: ['4', '26','525','601','608','611','622'],
  name: "planDetail",
  components:{},
  data() {
    return {
      planData: {},
      visible: true,
      type: "1",
    }
  },
  methods: {
    init(row) {
      this.type = sessionStorage.getItem('BUSINESS_TYPE')
      this.planData = row;
      this.planData.planSystemFullPath = +row.planSystemFullPath
      this.planData.planFileInfo=row.planFileInfo?JSON.parse(row.planFileInfo):undefined
    },
    goBack() {
      this.$emit('goBack')
    },
    getInfo(row) {
      getPlanInfo(row.planId).then(response => {
        this.planData = response.data;
        this.planData.emergencyTypeFullPath = +response.data.emergencyTypeFullPath
        this.planData.planSystemFullPath = +response.data.planSystemFullPath
        this.planData.planFileInfo = response.data.planFileInfo ? JSON.parse(response.data.planFileInfo) : undefined
      });
    },
    /**
     * 构建类型信息
     */
    buildTypeLabel(val) {
      if(val){
        let pType = val.split(';');
        let typeList = []
        pType.filter(Boolean).forEach(item => {
          let arr = item.split(',')
          typeList.push(arr.map(Number));
        })
        return typeList;
      }
    },
    /**
     * 获取对应字典
     * @param val
     */
    getOptions(val) {
      let options = undefined
      switch (val) {
        case 274:
          options = this.dict.type['601']
          break;
        case 275:
          options = this.dict.type['608']
          break;
        case 276:
          options = this.dict.type['611']
          break;
        case 277:
          options = this.dict.type['622']
          break;
      }
      return options;
    },
  }
}
</script>

<style scoped>

</style>
