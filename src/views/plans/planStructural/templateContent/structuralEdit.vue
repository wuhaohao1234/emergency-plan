<template>
<div id="structuralEdit">
  <el-page-header @back="goBack" content="预案模板" style="margin-bottom: 20px"></el-page-header>
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
<!--      章节目录-->
      <div class="tree">
        <h4>目录</h4>
        <el-tree
          :data="chapter"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :highlight-current="true"
          ref="tree"></el-tree>
      </div>
    </el-col>
    <el-col :span="20">
      <h4>章节内容</h4>
      <el-form :model="chapterForm" style="margin-left: 50px">
        <el-form-item prop="tips" v-if="showTips">
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <el-alert :title="chapterForm.tips" type="info" :closable="false" show-icon style="flex: 1;"></el-alert>
            <el-button type="text" style="color: #737373;background: #F4F4F5" @click="closeTips">知道了</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="content">
          <span v-if="showEditor">
            <tinymce v-model="chapterForm.content" :width="0.7*pageWidth"/>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveChapterContent">保存</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</div>
</template>

<script>
import Tinymce from "@/components/Tinymce/index.vue";
import {saveChapterTemplate} from "@/api/plans/structural";

export default {
  components: {Tinymce},
  data() {
    return {
      defaultProps: {
        label: 'chapterName',
        children: 'children',
      },
    //   章节目录
      chapter: [],
      data: {},
    // 内容表单
      chapterForm: {
        tips: "",
        content: "",
      },
      currentChapter: null,
      showEditor: true,
      showTips: false,
      pageWidth: null,
    };
  },
  mounted() {
    this.init();
    // 监听页面的点击事件
    document.addEventListener('click', this.handlePageClick);
    this.pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
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
      this.showTips = false;
    },
    handleNodeClick(node) {
        this.showEditor = false;
      if(node.tips) {
        this.showTips = true;
      }
        this.$nextTick(() => {
          this.chapterForm.content = node.content || '';
          this.chapterForm.tips = node.tips || '';
          this.currentChapter = node;
          this.showEditor = true;
        });

    },
    handlePageClick(event) {
      const isRightPanelClick = event.target.closest('.el-col:nth-child(2)');
      if (!isRightPanelClick) {
        this.currentChapter = null;
      }
    },
    saveChapterContent() {
      if (this.currentChapter) {
        this.currentChapter.content = this.chapterForm.content
        saveChapterTemplate(this.currentChapter).then(res => {
          if(res.code===200) {
            this.$message.success('保存成功');
          }
        });
      }else {
        this.$message.warning('请先选择章节')
      }
    },
  },
}
</script>

<style scoped lang="scss">
.editor-wrap{
  width: 100%;
}
.selected-node {
  background-color: #f0f0f0; /* Add your desired background color for the selected node */
}
</style>
