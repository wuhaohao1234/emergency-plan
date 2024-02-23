<template>
  <div id="planStructural">
    <el-page-header @back="goBack" content="预案结构化" style="margin-bottom: 20px"></el-page-header>
    <el-form :model="form" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="预案名称">
            {{form.planName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="编制单位">
            {{this.$store.state.user.deptName}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label"><i class="el-icon-guide"></i> 全文结构化</span>
        <structural-before ref="structuralEdit" v-if="form.planId" :planId="form.planId"/>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label"><i class="el-icon-tickets"></i> 基本信息结构化</span>
        <basic-structural v-if="form.planId" ref="basicStructural" :planId="form.planId" :recordId="form.recordId"/>
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label"><i class="el-icon-warning-outline"></i> 预测预警结构化</span>
        <warn-structural v-if="form.planId" :planId="form.planId" ref="warnStructural" />
      </el-tab-pane>
      <el-tab-pane name="fourth">
        <span slot="label"><i class="el-icon-open"></i> 应急响应结构化</span>
        <answer-structural ref="answerStructural" v-if="form.planId" :planId="form.planId"/>
      </el-tab-pane>
      <el-tab-pane name="fifth">
        <span slot="label"><i class="el-icon-document"></i> 应急文书</span>
        <emergency-documents v-if="form.planId" :planInfo="form"></emergency-documents>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BasicStructural from "@/views/plans/planFiling/declare/structural/basicStructural.vue";
import AnswerStructural from "@/views/plans/planFiling/declare/structural/answerStructural.vue";
import WarnStructural from "@/views/plans/planFiling/declare/structural/warnStructural.vue";
import StructuralBefore from "@/views/plans/planFiling/declare/structural/structuralBefore.vue";
import EmergencyDocuments from "./structural/emergencyDocuments";

export default {
  components: {EmergencyDocuments, StructuralBefore, WarnStructural, AnswerStructural, BasicStructural},
  data() {
    return {
      form: {},
      activeName: 'first',
    };
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    initing(data) {
      this.form = data;
    },
  },
}
</script>

<style scoped lang="scss">

</style>
