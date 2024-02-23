<!--基本信息结构化-->
<template>
  <div id="basicStructural">
    <el-row :gutter="50">
      <el-col :span="14">
        <h4 class="title">事件(灾害)级别</h4>
        <el-button
          class="right-button"
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="addHandle"
          v-if="levelForm.levelList.length<4">
          事件级别
        </el-button>
        <el-form :model="levelForm">
          <el-table :data="levelForm.levelList">
            <el-table-column label="级别" prop="level" width="130" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.level" @change="handleSelectChange(scope.row)">
                  <el-option
                    v-for="item in levelOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.exist"
                  >{{item.label}}</el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="名称" width="180"  prop="levelName" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.levelName" placeholder="请输入名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="描述"  min-width="180" prop="levelContent" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.levelContent" placeholder="请输入描述"></el-input>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-delete"
                  type="text"
                  style="color: red"
                  @click="delHandle(scope.row,scope.$index)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-col>
      <el-col :span="10">
        <h4 class="title">演练评估</h4>
        <el-form :model="form" :rules="rules">
          <el-row>
            <el-col :span="24">
              <el-form-item label="演练周期" prop="drillCycle">
                <div style="display: flex">
                  <el-select style="width: 110px" v-model="form.drillCycle" @change="changeHandle" clearable>
                    <el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                  <el-select style="width: 110px" v-model="form.drillNum" @change="changeHandle" clearable>
                    <el-option v-for="item in numList" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="评估周期" prop="evaluationCycle">
                <el-select v-model="form.evaluationCycle" @change="changeHandle" placeholder="请选择评估周期" clearable>
                  <el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item>
                <el-button
                  icon="el-icon-check"
                  type="primary"
                  size="small"
                  @click="saveHandle"
                >保存数据
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <h4>预案衔接</h4>
    <plan-connection ref="planConnection" :recordId="recordId"></plan-connection>
  </div>
</template>
<script>
import PlanConnection from "@/views/plans/planFiling/declare/planConnection.vue";
import {deleteById, findLevelInfo, saveOrUpdateBatch} from "@/api/plans/planLevel";
import {editRecord, getRecordInfo} from "@/api/plans/planRecord";

export default {
  components: {PlanConnection},
  props: {
    planId: {
      type: Number,
      default: null
    },
    recordId: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      levelForm: {
        levelList: [],
      },
      levelOptions: [
        {label: 'I级', value: 1, exist: false},
        {label: 'II级', value: 2, exist: false},
        {label: 'III级', value: 3, exist: false},
        {label: 'IV级', value: 4, exist: false}
      ],
      numList: [
        {label: "一次", value: 0},
        {label: "两次", value: 1},
        {label: "三次", value: 2},
        {label: "四次", value: 3},
        {label: "五次", value: 4},
      ],
      yearList: [
        {label: "半年", value: 0},
        {label: "一年", value: 1},
        {label: "两年", value: 2},
        {label: "三年", value: 3},
        {label: "四年", value: 4},
        {label: "五年", value: 5},
      ],
      form: {
        planId: this.planId,
        recordId: this.recordId,
        //演练周期
        drillCycle: null,
        //演练次数
        drillNum: null,
        //评估周期
        evaluationCycle: null
      },
      selectedLevels: [],
      // 表单校验
      rules: {
        drillCycle: [
          {required: true, message: "演练周期不能为空", trigger: "blur,change"}
        ],
        evaluationCycle: [
          {required: true, message: "评估周期不能为空", trigger: "blur,change"}
        ]
      },
    };
  },
  computed: {
    // filteredLevelOptions() {
    //   // Use filter to exclude already selected levels
    //   return this.levelOptions.filter(option => !this.selectedLevels.includes(option.value))
    // }
  },
  watch: {
    planId: {
      immediate: true, // 表示在组件创建时立即执行一次
      handler(newVal, oldVal) {
        if (newVal !== oldVal && newVal !== null) {
          // 当 planId 发生变化且不为 null 时，执行你的操作
          this.getLevelList();
        }
      }
    },
    // levels(newVal, oldVal) {
    //   this.levelList.forEach(item => {
    //     if (newVal.includes(item.value)) {
    //       item.exist = false
    //     } else {
    //       item.exist = true
    //     }
    //     this.selectedLevels = [...new Set([...this.selectedLevels, newVal])];
    //   })
    // },
    'levelForm.levelList': {
      handler(newVal, oldVal) {
        let existLevel = newVal.map(item => item.level)
        this.levelOptions.forEach(option => {
          if (existLevel.includes(option.value)) {
            option.exist = true
          } else {
            option.exist = false
          }
        })
      },
      deep: true
    }
  },
  mounted() {
    this.getFormData();
  },
  methods: {
    getFormData() {
      getRecordInfo(this.recordId).then(res => {
        if (res.code == 200) {
          this.form = res.data;
        }
      });
    },
    changeHandle() {
      this.$forceUpdate()
    },
    handleSelectChange(row) {
      // 在选择变化时更新每个选项的 exist 属性，将已选择的选项设为不可用
      const selectedValue = row.level;
      this.levelOptions.forEach(item => {
        if (item.value === selectedValue) {
          item.exist = true;
        }
      });
    },
    getLevelList() {
      findLevelInfo(this.planId, 1).then(res => {
        this.levelForm.levelList = res.data;
        // // 更新 levelOptions 中已存在的级别的 exist 属性
        // this.levelOptions.forEach(option => {
        //   option.exist = this.levelForm.levelList.some(item => item.level === option.value);
        // });
      });
    },
    addHandle() {
      let newRow = {
        level: '',
        levelName: '',
        levelContent: '',
        planId: this.planId,
        levelType: 1,
        editable: true
      };
      this.levelForm.levelList.push(newRow);
    },
    // 保存事件级别
    saveHandle() {
      let result = true
      if (this.levelForm.levelList) {
        this.levelForm.levelList.forEach(item => {
          delete item.id
        })
        saveOrUpdateBatch(this.levelForm.levelList).then(res => {
          if (res.code !== 200) {
            result = false
          }
        });
      }
      if (this.form) {
        editRecord(this.form).then(res => {
          if (res.code !== 200) {
            result = false
          }
        });
      }
      if (result) {
        this.$message.success('保存成功');
      }
    },
    //   删除事件级别
    delHandle(row, index) {
      if (!row.id) {
        this.levelForm.levelList.splice(index, 1);
      } else {
        deleteById(row.id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.levelForm.levelList.splice(index, 1);
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  display: inline-block;
  margin-top: -10px;
}

.right-button {
  display: inline-block;
  float: right;
  margin-top: -1px
}
</style>
