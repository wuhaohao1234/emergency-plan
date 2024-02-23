<template>
  <div id="templateContent">
    <el-page-header @back="goBack" content="预案模板详情" style="margin-bottom: 20px"></el-page-header>
      <el-row>
        <el-col :span="12">
          预案：{{data.planName}}
        </el-col>
        <el-col :span="12">
          模板：{{data.templateName}}
        </el-col>
      </el-row>
      <el-row style="margin-top:5px;width: 100%;height: 2px;background: #c9c9c9;"></el-row>
      <el-row>
        <el-col :span="4">
          <h4>目录</h4>
          <el-tree
            :data="chapter"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :highlight-current="true"
            ref="tree"></el-tree>
        </el-col>
        <el-col :span="20">
          <h4>章节内容</h4>
          <el-card style="height: 600px" shadow="never" class="box-card">
            <el-form :model="chapterForm">
              <el-form-item prop="tips">
                <div v-if="hasTips" style="display: flex; justify-content: space-between; width: 100%;">
                  <el-alert :title="chapterForm.tips" type="info" :closable="false" show-icon style="flex: 1;"></el-alert>
                  <el-button type="text" style="color: #737373;background: #F4F4F5" @click="closeTips">知道了</el-button>
                </div>
              </el-form-item>
              <el-form-item prop="content">
                <div v-html="chapterForm.content">
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce/index.vue";

export default {
  components: {Tinymce},
  data() {
    return {
      defaultProps: {
        label: 'chapterName',
        children: 'children',
      },
      hasTips: false,
      //   章节目录
      chapter: [],
      data: {},
      // 内容表单
      chapterForm: {
        tips: "",
        content: "",
      },
    };
  },
  mounted() {
    this.init();
    // 监听页面的点击事件
    document.addEventListener('click', this.handlePageClick);
  },
  beforeDestroy() {
    // 在组件销毁前移除事件监听器，防止内存泄漏
    document.removeEventListener('click', this.handlePageClick);
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init(data,chapter) {
      this.data = data;
      this.chapter = chapter;
    },
    closeTips() {
      this.hasTips = false;
    },
    handleNodeClick(node) {
      this.$nextTick(() => {
        this.chapterForm.content = node.content || '';
        this.chapterForm.tips = node.tips || '';
        this.hasTips = !!node.tips;
        this.currentChapter = node;
      });
    },
    handlePageClick(event) {
      const isRightPanelClick = event.target.closest('.el-col:nth-child(2)');
      if (!isRightPanelClick) {
        this.currentChapter = null;
      }
    },
  },
}
</script>
<style scoped lang="scss">
</style>
