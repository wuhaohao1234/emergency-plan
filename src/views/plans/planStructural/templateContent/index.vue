<template>
  <div class="app-container">
    <div class="search-container" v-if="!contentVisible&&!detailVisible">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
        <el-form-item label="模板名称" prop="templateName">
          <el-input
            v-model="queryParams.templateName"
            placeholder="请输入模板名称"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增模板内容
          </el-button>
        </el-col>
      </el-row>
      <!--    列表-->
      <div class="list-container">
        <el-table :data="templateList" highlight-current-row v-loading="loading" style="width: 100%;">
          <el-table-column label="预案名称" align="left" :show-overflow-tooltip="true" prop="planName" />
          <el-table-column label="模板名称" align="left" :show-overflow-tooltip="true" prop="templateName" />
          <el-table-column header-align="center"  align="center" label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
              <el-button size="mini" type="text" style="color: red" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.size"
          @pagination="handleQuery"/>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="open" append-to-body width="70%">
      <el-form :model="form" ref="form" label-width="80px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="预案:">
              <el-select clearable v-model="form.planId" style="width: 100%">
                <el-option
                  v-for="(item,index) in unAddPlanOptions"
                  :key="index"
                  :label="item.planName"
                  :value="item.planId"
                >{{item.planName}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板:">
              <el-select clearable v-model="form.templateId" style="width: 100%">
                <el-option
                  v-for="(item,index) in templateOptions"
                  :key="index"
                  :label="item.templateName"
                  :value="item.templateId"
                >{{item.templateName}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="footer" align="right">
          <el-form-item>
            <el-button type="primary" @click="confirmTo">确定</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
    <structural-edit ref="structuralEdit" v-if="contentVisible" @goBack="handleQuery"/>
    <template-content ref="templateContent" v-if="detailVisible" @goBack="handleQuery"/>
  </div>
</template>
<script>

import StructuralEdit from "@/views/plans/planStructural/templateContent/structuralEdit.vue";
import TemplateContent from "@/views/plans/planStructural/templateContent/templateContent.vue";
import {
  delPlanChapter,
  getcopyChapter,
  getStructuralTemplate, getTempInfoByPlanId, getTemplate
} from "@/api/plans/structural";
import {getUnAddTemplatePlanList} from "@/api/plans/preplanRevision";

export default {
  components: { StructuralEdit, TemplateContent},
  dicts: ['598'],
  data() {
    return {
      queryParams: {
        page: 1,
        size: 10,
      },
      contentVisible: false,
      detailVisible: false,
      loading: false,
      title: "",
      open: false,
      total: 0,
      templateList: [],
      form:{

      },
      formData: {},
      //未添加预案模板列表
      unAddPlanOptions: [],
      //   模板列表
      templateOptions: [],
      //   章节
      chapter: [],
      rules: {
        planId: [
          { required: true, message: "预案不能为空", trigger: "blur,change" }
        ],
        templateId: [
          { required: true, message: "模板不能为空", trigger: "blur,change" }
        ]
      },
    };
  },
  mounted() {
    this.handleQuery();
    this.getPlanList();
    this.getTemplateList();
  },
  methods: {
    handleQuery() {
      this.contentVisible = false;
      this.detailVisible = false;
      this.loading = true;
      getStructuralTemplate(this.queryParams).then(res => {
        res.data.content.forEach(item => {
          item.templateId = item.templateInfo.templateId;
          item.templateName = item.templateInfo.templateName;
        });
        this.templateList = res.data.content;
        this.loading = false;
      });
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    reset() {
      this.form = {};
    },
    // 新增预案模板内容
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增";
    },
  //   修改
    handleUpdate(row) {
      getTempInfoByPlanId(row.planId).then(res => {
        let params = res.data;
        params.planName = row.planName;
        this.contentVisible = true;
        this.$nextTick(() => {
          this.$refs.structuralEdit.init(params,res.data.contentList);
        })
      });
    },
    // 详情
    handleDetail(row) {
      getTempInfoByPlanId(row.planId).then(res => {
        let params = res.data;
        params.planName = row.planName;
        this.detailVisible = true;
        this.$nextTick(() => {
          this.$refs.templateContent.init(params,res.data.contentList);
        })
      });
    },
    // 获取未添加预案模板列表
    getPlanList() {
      getUnAddTemplatePlanList().then(res => {
        this.unAddPlanOptions = res.data;
      });
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
    // 新增内容
    confirmTo() {
      this.$refs["form"].validate(valid=>{
        if(valid) {
          let params = {planId: this.form.planId, templateId  : this.form.templateId};
          this.unAddPlanOptions.forEach(item => {
            if(item.planId==this.form.planId) {
              this.formData.planName = item.planName;
            }
          });
          this.templateOptions.forEach(item => {
            if(item.templateId==this.form.templateId) {
              this.formData.templateName = item.templateName;
            }
          });
          // 根据选择的预案及模板复制章节
          getcopyChapter(params).then(res => {
            this.chapter = res.data;
            this.open = false;
            this.contentVisible = true;
            this.$nextTick(() => {
              this.$refs.structuralEdit.init(this.formData, this.chapter);
            })
          });
        }
      })
    },
  //   删除预案模板章节内容
    handleDelete(row) {
      this.$modal.confirm('是否确认删除预案名称为"' + row.planName + '"的章节内容？').then(()=>{
        delPlanChapter(row.planId).then(res => {
          if(res.code===200){
            this.$message.success('删除预案章节内容成功');
            this.handleQuery();
          }
        });
      })
    },

  },
}
</script>
<style scoped lang="scss">

</style>
