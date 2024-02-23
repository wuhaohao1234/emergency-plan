<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          v-model="queryParams.dictName"
          placeholder="请输入字典名称"
          clearable
          style="width: 240px"
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
          v-hasPermi="['system:dict:add']"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <el-table
      row-key="dictId"
      :tree-props="{children: 'children'}"
      v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column label="字典编号" align="left" prop="dictId"/>
      <el-table-column label="字典名称" align="left" prop="dictName" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="!scope.row.parentId">{{scope.row.dictName}}</span>
          <el-tag v-else>{{scope.row.dictName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==='normal'?'success':'danger'">{{scope.row.status==='normal'?'启用':'禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            v-if="!scope.row.parentId"
            v-hasPermi="['system:dict:add']"
            @click="handleAddDict(scope.row)"
          >添加
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-hasPermi="['system:dict:edit']"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="1">字典</el-radio>
            <el-radio label="2">字典项</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="form.type==='1'?'字典名称':'字典项名称'" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="所属字典" prop="parentId" v-if="form.type==='2'">
          <el-select
            v-model="form.parentId"
            placeholder="请选择所属字典"
            style="width: 240px"
          >
            <el-option
              v-for="dict in dictList"
              :key="dict.dictId"
              :label="dict.dictName"
              :value="dict.dictId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="normal">启用</el-radio>
            <el-radio label="stopped">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0"></el-input-number>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listType, getType, delType, addType, updateType, refreshCache, getAllDict} from "@/api/system/dict/type";
import {handleTree} from "@/utils/ruoyi"

export default {
  name: "Dict",
  dicts: ["3"],
  data() {
    return {
      dictList:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        dictName: undefined,
        parentId: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        orderNum:0
      },
      // 表单校验
      rules: {
        dictName: [
          {required: true, message: "字典名称不能为空", trigger: "blur"}
        ],
        parentId: [
          {required: true, message: "所属字典不能为空", trigger: "blur"}
        ] ,
        orderNum: [
          {required: true, message: "显示顺序不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询字典列表 */
    getList() {
      this.loading = true;
      listType(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = handleTree(response.data, "dictId")
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: "normal",
        remark: undefined,
        type: '1',
        orderNum:0
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.getAllDicts()
      this.reset();
      this.open = true;
      this.title = "添加字典";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.getAllDicts()
      this.reset();
      const dictId = row.dictId || this.ids
      getType(dictId).then(response => {
        this.form = response.data;
        this.$set(this.form,'type',response.data.parentId?'2':'1')
        this.open = true;
        this.title = "修改字典";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.form.type==='1')this.form.parentId=''
          if (this.form.dictId != undefined) {
            updateType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    //获取所有字典
    getAllDicts() {
      getAllDict().then(res => {
        this.dictList = res.data
      })
    },
    /** 添加按钮操作 */
    handleAddDict(row) {
      this.getAllDicts()
      this.reset();
      this.open = true;
      this.title = "添加字典";
      this.$set(this.form,'type','2')
      this.$set(this.form,'parentId',row.dictId)
    },
  }
};
</script>
