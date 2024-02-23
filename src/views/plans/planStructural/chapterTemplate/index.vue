<template>
  <div class="app-container">
    <div class="search-container" v-if="!chapterVisible&&!detailVisible">
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
          >新增模板
          </el-button>
        </el-col>
      </el-row>
      <!--    列表-->
      <div class="list-container">
        <el-table :data="templateList" highlight-current-row v-loading="loading" style="width: 100%;">
          <el-table-column label="模板名称" min-width="180" align="left" :show-overflow-tooltip="true" prop="templateName" />
          <el-table-column label="模板使用用户" width="180" align="left" prop="userFullPath">
            <template slot-scope="scope">
              <dict-tag :options="dict.type['598']" :value="scope.row.userFullPath"/>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="180" align="center" prop="status">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleSwitchChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" header-align="center" align="center" fixed="right" >
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
    <structural-setting ref="structuralSetting" v-if="chapterVisible" @goBack="handleQuery"/>
    <template-chapter ref="templateChapter" v-if="detailVisible" @goBack="handleQuery"/>
  </div>
</template>
<script>
import {
  delStructuralTemplate,
  getStructrualTemplate,
  getTemplateDetail,
  saveTemplateStatus
} from "@/api/plans/structural";
import StructuralSetting from "@/views/plans/planStructural/chapterTemplate/structuralSetting.vue";
import TemplateChapter from "@/views/plans/planStructural/chapterTemplate/templateChapter.vue";

export default {
  components: {TemplateChapter, StructuralSetting },
  dicts: ['598'],
  data() {
    return {
      // 查询条件
      queryParams: {
        page: 1,
        size: 10,
        templateName: undefined,
      },
      total: 0,
      //  列表数据
      templateList: [],
      // 加载
      loading: false,
      chapterVisible: false,
      detailVisible: false,
    };
  },
  mounted() {
    this.handleQuery();
  },
  methods: {
    //   查询模板列表
    handleQuery() {
      this.chapterVisible = false;
      this.detailVisible = false;
      this.loading = true;
      getStructrualTemplate(this.queryParams).then(res => {
        this.templateList = res.data.content;
        this.loading = false;
      });
    },
    // 重置查询表单
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //   新增模板
    handleAdd() {
      this.chapterVisible = true;
    },
    //   编辑模板
    handleUpdate(row) {
      this.chapterVisible = true;
      getTemplateDetail(row.templateId).then(res => {
        this.$nextTick(() => {
          this.$refs.structuralSetting.init(res.data);
        })
      });
    },
    // 修改用户状态
    handleSwitchChange(row) {
      saveTemplateStatus(row).then(res => {
        if(res.code==200) {
          this.$message.success('修改成功');
          this.handleQuery();
        }
      });
    },
    //   删除模板
    handleDelete(row) {
      this.$modal.confirm('是否确认删除模板名称为"' + row.templateName + '"的数据项？').then(()=>{
        delStructuralTemplate(row.templateId).then(res => {
          if(res.code===200){
            this.$message.success('删除模板成功');
            this.handleQuery();
          }
        });
      })
    },
    //   模板详情
    handleDetail(row) {
      this.detailVisible = true;
      getTemplateDetail(row.templateId).then(res => {
        this.$nextTick(() => {
          this.$refs.templateChapter.init(res.data);
        })
      });
    },
  },
};
</script>
<style scoped lang="scss">

</style>
