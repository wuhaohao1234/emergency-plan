<!--全文结构化-->
<template>
  <div v-if="isTemplate">
    <el-form :model="templateForm" ref="templateForm" label-width="80px" :rules="rules">
      <el-alert title="请优先选择预案关联模板，选中后点击确定" type="info" :closable="true" show-icon style="flex: 1;margin-bottom: 5px"></el-alert>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="模板名称:">
            <template slot-scope="scope">
              <el-select clearable v-model="templateForm.templateId" style="width: 100%">
                <el-option
                  v-for="(item,index) in templateOptions"
                  :key="index"
                  :label="item.templateName"
                  :value="item.templateId"
                >{{item.templateName}}</el-option>
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="confirmTo" :disabled="!templateForm.templateId">确定</el-button>
        </el-col>
      </el-row>
      <div class="footer" align="right">
        <el-form-item>

        </el-form-item>
      </div>
    </el-form>
  </div>
  <div v-else>
    <el-row >
      <el-col :span="5">
        <!--      章节目录-->
        <div class="tree">
          <h4 style="margin-left: 20px">目录</h4>
          <el-row style="display: flex;justify-content: flex-end;">
            <el-button size="mini" icon="el-icon-plus" type="text" @click="addChapter">增加章节</el-button>
          </el-row>
          <el-tree
            :data="chapter"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :highlight-current="true"
            ref="tree">
            <span class="change-tree-node" slot-scope="{ node, data }">
              <span>{{ data.chapterName }}</span>
              <span class="change-button-container" >
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-plus"
                  v-if="node.level != 3"
                  @click="() => append(data)">
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-edit"
                  @click="() => handleUpdate(data)">
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  style="color: red"
                  @click="() => handleDel(data)">
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <h4 style="margin-left: 20px">章节内容</h4>
        <el-form :model="chapterForm" style="margin-left: 20px">
          <el-form-item prop="tips" v-if="showTips">
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <el-alert :title="chapterForm.tips" type="info" :closable="false" show-icon style="flex: 1;"></el-alert>
              <el-button type="text" style="color: #737373;background: #F4F4F5" @click="closeTips">知道了</el-button>
            </div>
          </el-form-item>
          <el-form-item prop="content">
          <span v-if="showEditor">
            <tinymce v-model="chapterForm.content" :width="0.7*pageWidth" @change="handleTinyMCEChange"/>
          </span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveChapterContent">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog title="新增章节" :visible.sync="visible" append-to-body width="50%">
      <el-form :model="chapterAddForm" ref="chapterAddForm" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="章节名称" prop="chapterName">
              <el-input v-model="chapterAddForm.chapterName" clearable placeholder="请输入章节名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="填写提示" prop="tips">
              <el-input v-model="chapterAddForm.tips" clearable placeholder="请输入填写提示"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveChapterAdd">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce/index.vue";
import {
  deleteChapterById,
  getcopyChapter,
  getTempInfoByPlanId,
  getTemplate,
  saveChapterTemplate,
  saveChapterUpdate
} from "@/api/plans/structural";

export default {
  components: {Tinymce},
  props: {
    planId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      defaultProps: {
        label: 'chapterName',
        children: 'children',
      },
      // 内容表单
      chapterForm: {
        tips: "",
        content: "",
      },
      templateId: null,
      chapterAddForm: {},
      visible: false,
      currentChapter: null,
      showEditor: true,
      showTips: false,
      pageWidth: null,
      isTemplate: true,
      // 预案模板表单
      templateForm: {
        templateId: undefined,
      },
      chapter: [],
      // 预案模板列表
      templateOptions: [],
      rules: {
        templateId: [
          {required: true, message: "模板名称不能为空", trigger: "blur,change"}
        ],
        chapterName:[
          {required: true, message: "章节名称不能为空", trigger: "blur,change"}
        ]
      },
    };
  },
  mounted() {
    // 监听页面的点击事件
    this.pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  },
  watch: {
    planId: {
      immediate: true,
      handler(newPlanId) {
        this.getPlanTemplate(newPlanId);
      }
    }
  },
  methods: {
    // 判断预案是否有模板
    getPlanTemplate(planId) {
      if (planId != null) {
        getTempInfoByPlanId(planId).then(res => {
          if (res.data && res.data.contentList) {
            this.isTemplate = false;
            this.templateId = res.data.templateId;
            this.chapter = res.data.contentList;
          }else {
            this.isTemplate = true;
            this.getTemplateList();
          }
        });
      }
    },
    //   获取模板列表
    getTemplateList() {
      let query={
        userFullPath:599
      }
      getTemplate(query).then(res => {
        this.templateOptions = res.data;
      });
    },
    confirmTo() {
      this.$refs['templateForm'].validate(valid => {
        if (valid) {
          let params={planId: this.planId,templateId:this.templateForm.templateId}
          // 根据选择的预案及模板复制章节
          getcopyChapter(params).then(response => {
            this.chapter=response.data
            this.isTemplate = false;
          });
        }
      });
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
    handleTinyMCEChange(newContent) {
      this.chapterForm.content = newContent;
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
    addChapter() {
      this.reset();
      this.visible = true;
      this.chapterAddForm.templateId = this.templateId;
      this.chapterAddForm.planId = this.planId;
    },
    // 新增
    append(data) {
      this.reset();
      this.visible = true;
      this.chapterAddForm.templateId = this.templateId;
      this.chapterAddForm.parentId = data.chapterId;
      this.chapterAddForm.planId = this.planId;
    },
    // 修改
    handleUpdate(data) {
      this.reset();
      this.visible = true;
      this.chapterAddForm = data;
    },
    // 删除章节
    handleDel(data){
      if(data.children){
        this.$message.warning('包含子章节，请先将其移除');
      }else {
        this.$modal.confirm('是否确认删章节名称为"' + data.chapterName + '"的数据项？').then(()=>{
          deleteChapterById(data.chapterId).then(res => {
            if(res.code===200){
              this.$message.success('删除章节成功');
              this.getTemplateList();
            }
          });
        })
      }
    },
    reset() {
      this.chapterAddForm = {
        templateId: null,
        parentId: null,
        planId: null,
        chapterName: null,
        tips: null
      };
    },
    saveChapterAdd() {
      saveChapterUpdate(this.chapterAddForm).then(res => {
        if (res.code == 200) {
          this.visible = false;
          this.getPlanTemplate(this.planId);
        }
      });
    },
  },
}
</script>
<style lang="scss">
.change-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;

  >>>.change-button-container {
    margin-left: 10px;
  }
}
</style>
