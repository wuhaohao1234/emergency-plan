<!--分级信息-->
<template>
  <div id="gradeInfo">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="是否分级">
        <el-radio-group v-model="form.isGrade">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
        <div style="float: right" v-if="!form.isGrade&&levels.length">
          <el-button size="mini" icon="el-icon-plus" v-if="detailType!=5&&detailType!=10&&detailType!=12"
                     @click="addIncident">事件情况
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="预警等级" v-if="form.isGrade">
        <el-radio-group v-model="form.level">
          <el-radio-button v-for="(item,index) in levelList" :key="index"
                           :label="item.value"
                           :disabled="!item.exist">{{ item.label }}
          </el-radio-button>
        </el-radio-group>
        <div style="float: right" v-if="form.isGrade&&levels.length">
          <el-button size="mini" icon="el-icon-plus" v-if="detailType!=5&&detailType!=10&&detailType!=12"
                     @click="addIncident">事件情况
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="事件情况" v-if="detailType!=5&&detailType!=10&&detailType!=12">
        <el-table
          :show-header="false"
          :data="form.incidentData"
          border
          style="width: 100%">
          <el-table-column
            align="center"
            prop="index"
            label="序号"
            width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="事件"
            min-width="120">
            <template slot-scope="scope">
              <el-form-item :prop="'incidentData.'+scope.$index + '.content'" :rules='rules.content'>
                <el-input v-model="scope.row.content" placeholder="请输入事件情况"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="50">
            <template slot-scope="scope">
              <el-button type="text" size="small" :disabled="form.incidentData.length===1" style="color: red"
                         @click="removeIncident(scope.$index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="流程图" v-if="detailType==5||detailType==10">
        <image-upload :value="form.imgList" @input="getImgData" :disabled="levels.length?false:true"></image-upload>
      </el-form-item>
      <el-form-item label="" style="margin-top: 110px">

      </el-form-item>
      <el-form-item label="" style="margin-top: 120px" v-if="!form.isGrade&&form.incidentData.length<2">

      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import OrgTree from "@/views/plans/planFiling/declare/orgTree.vue";

export default {
  name: "gradeInfo",
  components: {OrgTree},
  props: {
    levels: {
      type: Array,
      default: []
    },
    detailType: {
      type: Number,
      default: 1
    },
    planId: {
      type: Number,
      default: undefined
    },
    levelType: {
      type: Number,
      default: 2
    },
    levelList: {
      type: Array,
      default: []
    }
  },
  watch: {
    detailType(newVal, oldVal) {

    },
    levels: {
      handler(newVal, oldVal) {
        this.levelList.forEach(item => {
          if (newVal.includes(item.value)) {
            item.exist = true
          } else {
            item.exist = false
          }
        })
        if (newVal && newVal.length > 0) {
          this.form.level = newVal[0]
        } else {
          this.form.level = 0
          this.form.incidentData = []
        }
      },
    },
    'form.level': {
      handler(newVal, oldVal) {
        switch (newVal) {
          case 1:
            this.form.incidentData = this.levelList[0].incidentData
            this.form.imgList = this.levelList[0].imgList
            this.form.isGrade = this.levelList[0].isGrade
            break;
          case 2:
            this.form.incidentData = this.levelList[1].incidentData
            this.form.imgList = this.levelList[1].imgList
            this.form.isGrade = this.levelList[1].isGrade
            break;
          case 3:
            this.form.incidentData = this.levelList[2].incidentData
            this.form.imgList = this.levelList[2].imgList
            this.form.isGrade = this.levelList[2].isGrade
            break;
          case 4:
            this.form.incidentData = this.levelList[3].incidentData
            this.form.imgList = this.levelList[3].imgList
            this.form.isGrade = this.levelList[3].isGrade
            break;
        }
        this.$emit('getData', this.levelList)
      },
      deep: true,
      immediate: true
    },
    'form.incidentData': {
      handler(newVal, oldVal) {
        if (!this.form.isGrade) {
          this.levelList[0].incidentData = newVal
          this.levelList[1].incidentData = newVal
          this.levelList[2].incidentData = newVal
          this.levelList[3].incidentData = newVal
        }
        this.$emit('getData', this.levelList)
      },
      deep: true
    },
    'form.imgList': {
      handler(newVal, oldVal) {
        if (!this.form.isGrade) {
          this.levelList[0].imgList = newVal
          this.levelList[1].imgList = newVal
          this.levelList[2].imgList = newVal
          this.levelList[3].imgList = newVal
        }
        this.$emit('getData', this.levelList)
      },
      deep: true
    },
    'form.isGrade'(newVal, oldVal) {
      this.levelList.forEach(item=>{item.isGrade=newVal})
      if (this.form.incidentData) {
        this.form.incidentData.forEach(item => {
          item.isGrade = newVal
        })
      }
      if (this.form.imgList) {
        this.form.imgList.forEach(item => {
          item.isGrade = newVal
        })
      }
      if (!newVal) {
        this.levelList[0].incidentData = JSON.parse(JSON.stringify(this.form.incidentData))
        this.levelList[0].imgList = [...this.form.imgList]
        this.levelList[1].incidentData = JSON.parse(JSON.stringify(this.form.incidentData))
        this.levelList[1].imgList = [...this.form.imgList]
        this.levelList[2].incidentData = JSON.parse(JSON.stringify(this.form.incidentData))
        this.levelList[2].imgList = [...this.form.imgList]
        this.levelList[3].incidentData = JSON.parse(JSON.stringify(this.form.incidentData))
        this.levelList[3].imgList = [...this.form.imgList]
      }
      this.$emit('getData', this.levelList)
    }
  },
  data() {
    return {
      form: {
        isGrade: 1,
        level: 0,
        incidentData: [],
        imgList: []
      },
      // 表单校验
      rules: {
        content: [
          {required: true, message: '事件情景不能为空', trigger: 'blur'}
        ],
        incidentData: [
          {required: true, message: '事件情况不能为空', trigger: 'blur'}
        ],
      },
      newImgList: []
    }
  },
  methods: {
    /**
     * 删除事件情况
     */
    removeIncident(index) {
      this.form.incidentData.splice(index, 1)
    }
    ,
    /**
     * 添加事件情况
     */
    addIncident() {
      this.form.incidentData.push({content: '', detailType: this.detailType, isGrade: this.form.isGrade})
    },
    /**
     * 校验
     */
    validateHandle() {
      this.$refs["form"].validate(valid => {
        let list = this.levelList.filter(item => item.exist === true);
        let visible = true;
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          if (this.detailType != 5 && this.detailType != 10 && this.detailType != 12) {
            let contents = item.incidentData.map(data => data.content)
            if (contents.includes("")) {
              this.form.level = item.value
              this.form.incidentData = item.incidentData
              this.$refs["form"].validate()
              visible = false
              break
            }
          }
        }
        this.$emit('validate', valid && visible)
      })
    },
    //获取图片上传数据
    getImgData(data) {
      data.forEach(item => {
        item.isGrade = this.form.isGrade
      })
      this.levelList[this.form.level - 1].imgList = data
      this.newImgList = data
    },
  }
}
</script>

<style lang="scss">
#gradeInfo {
  label {
    font-weight: 500;
  }
}
</style>
