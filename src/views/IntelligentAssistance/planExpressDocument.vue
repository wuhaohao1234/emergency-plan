<template>
  <div id="planExpressDocument">
    <el-page-header @back="goBack" content="快速文书">
    </el-page-header>
    <el-form :model="form" label-width="80px" style="margin-top: 10px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="预案名称">
            {{ form.planName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编制单位">
            {{ this.$store.state.user.deptName }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <emergency-documents v-if="form.planId" :planInfo="form"></emergency-documents>
  </div>
</template>

<script>
import EmergencyDocuments from "./../plans/planFiling/declare/structural/emergencyDocuments";

export default {
  name: "planExpressDocument",
  components: {EmergencyDocuments},
  data() {
    return {
      form: {},
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init(data) {
      this.form = data
    }
  }
}
</script>

<style scoped>

</style>
