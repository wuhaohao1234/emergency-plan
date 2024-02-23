<!--预案编制-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="资讯名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入资讯名称"
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
        >新增资讯
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="dataList" v-loading="loading">
      <el-table-column heade-align="center" prop="title" label="资讯名称" :show-overflow-tooltip="true"
                       min-width="280"></el-table-column>
      <el-table-column heade-align="center" prop="url" label="链接" :show-overflow-tooltip="true"
                       min-width="280">
        <template slot-scope="scope" class="link">
          <a target="_blank" :href="scope.row.url">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column heade-align="center" label="操作" align="center" width="180"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.row)">详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)">删除
          </el-button>
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
            <el-form-item label="资讯名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入资讯名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="链接" prop="url">
              <el-input v-model="form.url" placeholder="请输入链接" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'资讯详情'" :visible.sync="detailVisible" width="70%" append-to-body :close-on-click-modal="false">
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            资讯名称
          </template>
          {{ detailInfo.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            链接
          </template>
          {{ detailInfo.url }}
        </el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="()=>{this.detailVisible=false}">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {saveOrUpdate, pageList, getInfo, deleteLink} from "@/api/plans/link";

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
        title: undefined,
        page: 1,
        size: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          {required: true, message: "资讯名称不能为空", trigger: "blur"}
        ],
        url: [
          {required: true, message: "链接不能为空", trigger: "blur"}
        ],
      },
      // 总条数
      total: 0,
      detailVisible: false,
      detailInfo: {}
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
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        title: undefined,
        url: undefined,
      };
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
      this.reset();
      this.open = true;
      this.title = "添加资讯";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getInfo(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资讯";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          saveOrUpdate(this.form).then(response => {
            this.$modal.msgSuccess("操作成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为"' + row.title + '"的资讯？').then(function () {
        return deleteLink(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    getFile(file) {
      this.form.planFile = file
    },
    /**
     * 详情
     * @param row
     */
    handleDetail(row) {
      this.detailInfo = row
      this.detailVisible = true
    },
  }
};
</script>

<style scoped lang="scss">
a:hover {
  color: #189ff8;
  text-decoration: none;
}
</style>
