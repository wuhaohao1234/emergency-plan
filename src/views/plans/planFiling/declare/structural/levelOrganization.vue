<!--级别组织机构-->
<template>
  <div id="levelOrganization">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="是否分级">
        <el-radio-group v-model="form.isGrade">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
        <div style="float: right" v-if="!form.isGrade&&levels.length">
          <el-button size="mini" icon="el-icon-plus"
                     @click="addOrganization" v-if="!form.orgList.orgName">组织机构
          </el-button>
          <el-button size="mini" icon="el-icon-view"
                     @click="showOrganization" v-if="form.orgList.orgName">查看组织机构
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
          <el-button size="mini" icon="el-icon-plus"
                     @click="addOrganization" v-if="!form.orgList.orgName">组织机构
          </el-button>
          <el-button size="mini" icon="el-icon-view"
                     @click="showOrganization" v-if="form.orgList.orgName">查看组织机构
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="组织架构" v-if="levels.length">
        <org-tree ref="orgTree" :planId="planId" v-if="planId" :orgList="form.orgList"
                  @updateData="getOrgTreeData"></org-tree>
      </el-form-item>
      <el-form-item label="" style="margin-top: 260px" v-if="!form.isGrade||form.orgList">

      </el-form-item>
    </el-form>
    <el-drawer
      title="组织机构信息"
      size="45%"
      direction="ttb"
      :modal="false"
      :visible.sync="drawerVisible"
      :with-header="false">
      <organizational ref="organizational"></organizational>
    </el-drawer>
  </div>
</template>

<script>
import OrgTree from "@/views/plans/planFiling/declare/orgTree.vue";
import organizational from './../organizational';

export default {
  name: "levelOrganization",
  components: {OrgTree, organizational},
  props: {
    levels: {
      type: Array,
      default: []
    },
    detailType: {
      type: Number,
      default: 12
    },
    planId: {
      type: Number,
      default: undefined
    },
    levelType: {
      type: Number,
      default: 3
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
          this.form.orgList = {}
        }
      },
    },
    'form.level': {
      handler(newVal, oldVal) {
        switch (newVal) {
          case 1:
            this.form.orgList = this.levelList[0].orgList
            this.form.isGrade = this.levelList[0].isGrade
            break;
          case 2:
            this.form.orgList = this.levelList[1].orgList
            this.form.isGrade = this.levelList[1].isGrade
            break;
          case 3:
            this.form.orgList = this.levelList[2].orgList
            this.form.isGrade = this.levelList[2].isGrade
            break;
          case 4:
            this.form.orgList = this.levelList[3].orgList
            this.form.isGrade = this.levelList[3].isGrade
            break;
        }
        this.$emit('getData', this.levelList)
      },
      deep: true,
      immediate: true
    },
    'form.orgList': {
      handler(newVal, oldVal) {
        if (!this.form.isGrade) {
          this.levelList[0].orgList = newVal
          this.levelList[1].orgList = newVal
          this.levelList[2].orgList = newVal
          this.levelList[3].orgList = newVal
        }
        this.levelList.forEach(item => {
          item.isGrade = this.form.isGrade
          if (item.orgList.orgName) {
            item.orgList.isGrade =this.form.isGrade
          }
        })
        this.$emit('getData', this.levelList)
      },
      deep: true
    },
    'form.isGrade'(newVal, oldVal) {
      this.levelList.forEach(item => {
        item.isGrade = newVal
      })
      if (this.levelList[this.form.level - 1].orgList.orgName) {
        this.levelList[this.form.level - 1].orgList.isGrade = newVal
      }
      if (!newVal) {
        this.levelList[0].orgList = JSON.parse(JSON.stringify(this.form.orgList))
        this.levelList[1].orgList = JSON.parse(JSON.stringify(this.form.orgList))
        this.levelList[2].orgList = JSON.parse(JSON.stringify(this.form.orgList))
        this.levelList[3].orgList = JSON.parse(JSON.stringify(this.form.orgList))
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
        imgList: [],
        orgList: {},
      },
      drawerVisible: false
    }
  },
  methods: {
    /**
     * 校验
     */
    validateHandle() {
      this.$emit('validate', true)
    },

    /**
     * 向当前级别下添加组织机构
     */
    addOrganization() {
      this.$refs.orgTree.addOrgHandle()
    },
    /**
     * 查看组织机构当前级别下
     */
    showOrganization() {
      this.drawerVisible = true;
      this.$nextTick(() => {
        this.$refs.organizational.init(this.form.orgList)
      })
    },
    /**
     * 获取子组件返回数据
     * @param data
     */
    getOrgTreeData(data) {
      this.form.orgList = data
      switch (this.form.level) {
        case 1:
          this.levelList[0].orgList = this.form.orgList
          break;
        case 2:
          this.levelList[1].orgList = this.form.orgList
          break;
        case 3:
          this.levelList[2].orgList = this.form.orgList
          break;
        case 4:
          this.levelList[3].orgList = this.form.orgList
          break;
      }
    }
  }
}
</script>

<style scoped lang="scss">
#levelOrganization {
  ::v-deep label {
    font-weight: 500;
  }
}
</style>
