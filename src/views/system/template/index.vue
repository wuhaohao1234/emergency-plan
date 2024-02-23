<!--文件模板-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="模板名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入模板名称"
          clearable
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
    <el-table :data="dataList" v-loading="loading">
      <el-table-column heade-align="center" prop="name" label="模板名称" :show-overflow-tooltip="true"
                       min-width="160"></el-table-column>
      <el-table-column heade-align="center" prop="updateTime" label="上传时间"
                       width="180"></el-table-column>
      <el-table-column heade-align="center" label="操作" align="center" width="180"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)">修改
          </el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            @click="handleDetail(scope.row)">详情-->
<!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入模板名称" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="fileInfo" label="模板文件">
              <file-upload :value="form.fileInfo" :limit="1" :fileSize="5" :fileType="['docx']"
                           @input="getFile"></file-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {pageList,saveOrUpdate,getById} from "@/api/system/template";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        name: undefined,
        page: 1,
        size: 10,
      },
      // 表单参数
      form: {
        id: undefined,
        name: undefined,
        fileInfo: [],
      },
      // 表单校验
      rules: {
        name: [
          {required: true, message: "模板名称不能为空", trigger: "blur"}
        ],
        fileInfo: [
          {required: true, message: "模板文件不能为空", trigger: "blur"}
        ],
      },
      // 总条数
      total: 0,
    };
  },
  created() {
    this.getList();
  },

  methods: {
    /** 查询列表 */
    getList() {
      this.detailVisible = false
      this.loading = true;
      pageList(this.queryParams).then(response => {
        this.dataList = response.data.content;
        this.total = response.data.totalElements;
        this.loading = false;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.$nextTick(()=>{
        this.$refs.form.resetFields()
      })
      this.title = "添加文件模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true;
      this.$nextTick(()=>{
        this.$refs.form.resetFields()
      })
      getById(row.id).then(response => {
        this.form = response.data;
        this.form.fileInfo = response.data.file ? JSON.parse(response.data.file) : undefined
        this.title = "修改文件模板";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.file = this.form.fileInfo ? JSON.stringify(this.form.fileInfo) : ''
          saveOrUpdate(this.form).then(response => {
            this.$modal.msgSuccess("操作成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    getFile(file) {
      this.form.fileInfo = file
    },

  }
};
</script>


