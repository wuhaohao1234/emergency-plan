<!--启动条件-->
<template>
  <div id="startingCondition">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-col :span="19">
        <el-form-item label="应急等级">
          <el-radio-group v-model="form.level">
            <el-radio-button :label="1">I级</el-radio-button>
            <el-radio-button :label="2">II级</el-radio-button>
            <el-radio-button :label="3">III级</el-radio-button>
            <el-radio-button :label="4">VI级</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="5" v-if="handleType===2">
        <div style="float: right">
          <el-button  size="small" icon="el-icon-plus" type="primary" @click="addIncident">事件情况
          </el-button>
          <el-button size="small" type="primary" @click="saveHandle">保存</el-button>
        </div>
      </el-col>
      <el-col :span="24">
        <el-form-item label="事件情况" prop="incidentData">
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
                <el-form-item v-if="handleType===2" :prop="'incidentData.'+scope.$index + '.content'" :rules='rules.content'>
                  <el-input v-model="scope.row.content" placeholder="请输入事件情况"></el-input>
                </el-form-item>
                <span v-else>{{scope.row.content}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="50">
              <template slot-scope="scope">
                <el-button type="text" size="small" :disabled="form.incidentData.length===1" v-if="handleType===2" style="color: red"
                           @click="removeIncident(scope.$index)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
    </el-form>
<!--    <div style="float: right;" v-if="handleType===2">-->
<!--      <el-button size="small" @click="getInfo">取消</el-button>-->
<!--      <el-button size="small" type="primary" @click="saveHandle">保存</el-button>-->
<!--    </div>-->
  </div>
</template>

<script>
import {addOrEditEvents, getPlanInfo,enPlanInfo} from '@/api/plans/preplanRevision'

export default {
  name: "startingCondition",
  props: {
    planId: {
      type: Number,
      default: 1
    },
    handleType: {
      type: Number,
      default: 2, //1.查看详情 2.编辑
    }
  },
  mounted() {
    this.getInfo()
  },
  data() {
    return {
      form: {
        incidentData: [],
        level: 1,
        oneLevel: [],
        twoLevel: [],
        threeLevel: [],
        fourLevel: [],
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
      type:1,
    }
  },
  watch: {
    'form.level'(newVal, oldVal) {
      switch (newVal) {
        case 1:
          this.form.incidentData = this.form.oneLevel
          break;
        case 2:
          this.form.incidentData = this.form.twoLevel
          break;
        case 3:
          this.form.incidentData = this.form.threeLevel
          break;
        case 4:
          this.form.incidentData = this.form.fourLevel
          break;
      }
    }
  },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        planId: undefined,
        planName: undefined,
        emergencyTypeFullPath: undefined,
        planSystemFullPath: undefined,
        preparationDeptId: this.$store.state.user.deptId,
        oneLevel: [{content: ''}],
        twoLevel: [{content: ''}],
        threeLevel: [{content: ''}],
        fourLevel: [{content: ''}],
        publishDeptId: undefined,
        documentNumber: undefined,
        publishTime: undefined,
        planFileInfo: undefined,
        level: 1,
        incidentData: [{content: ''}]
      };
    },
    /** 提交按钮 */
    saveHandle: function () {
      this.$refs["form"].validate(valid => {
        let oneLevel = this.form.oneLevel.map(item => item.content)
        let twoLevel = this.form.twoLevel.map(item => item.content)
        let threeLevel = this.form.threeLevel.map(item => item.content)
        let fourLevel = this.form.fourLevel.map(item => item.content)
        if (oneLevel.includes("") || twoLevel.includes("") || threeLevel.includes("") || fourLevel.includes("")) {
          if (oneLevel.includes("")) {
            this.form.level = 1
          } else if (twoLevel.includes("")) {
            this.form.level = 2
          } else if (threeLevel.includes("")) {
            this.form.level = 3
          } else if (fourLevel.includes("")) {
            this.form.level = 4
          }
          this.$refs["form"].validate(valid => {
          })
          return false
        }
        if (valid) {
          this.form.level1 = oneLevel
          this.form.level2 = twoLevel
          this.form.level3 = threeLevel
          this.form.level4 = fourLevel
          addOrEditEvents(this.form).then(response => {
            this.$modal.msgSuccess("启动条件保存成功");
            return true
          });
        }
        return false
      })
    },
    //校验
    checkHandle() {
      this.$refs["form"].validate(valid => {
        let oneLevel = this.form.oneLevel.map(item => item.content)
        let twoLevel = this.form.twoLevel.map(item => item.content)
        let threeLevel = this.form.threeLevel.map(item => item.content)
        let fourLevel = this.form.fourLevel.map(item => item.content)
        if (oneLevel.includes("") || twoLevel.includes("") || threeLevel.includes("") || fourLevel.includes("")) {
          if (oneLevel.includes("")) {
            this.form.level = 1
          } else if (twoLevel.includes("")) {
            this.form.level = 2
          } else if (threeLevel.includes("")) {
            this.form.level = 3
          } else if (fourLevel.includes("")) {
            this.form.level = 4
          }
          this.$refs["form"].validate(valid => {
          })
          this.$emit('checkForm',false)
        }
        this.$emit('checkForm',valid)
      })
    },
    /**
     * 添加事件情况
     */
    addIncident() {
      this.form.incidentData.push({content: ''})
    },
    /**
     * 删除事件情况
     */
    removeIncident(index) {
      this.form.incidentData.splice(index, 1)
    },
    /**
     * 获取预案事件情况详情
     */
    getInfo() {
      this.type = sessionStorage.getItem('BUSINESS_TYPE');
      (this.type==1?getPlanInfo:enPlanInfo)(this.planId).then(res => {
        let {level1, level2, level3, level4, planName} = res.data
        this.form.oneLevel = level1 ? this.buildData(level1) : [{content: ''}]
        this.form.twoLevel = level2 ? this.buildData(level2) : [{content: ''}]
        this.form.threeLevel = level3 ? this.buildData(level3) : [{content: ''}]
        this.form.fourLevel = level4 ? this.buildData(level4) : [{content: ''}]
        this.form.level = 1
        this.form.planName = planName
        this.form.incidentData = this.form.oneLevel
        this.form.planId = this.planId
      })
    },
    buildData(data) {
      let list = []
      data.forEach(item => {
        list.push({content: item})
      })
      return list
    }
  }
}
</script>

<style scoped>

</style>
