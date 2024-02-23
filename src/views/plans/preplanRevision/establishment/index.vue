<!--预案编制-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="预案名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入预案名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="事件类别" prop="emergencyTypeFullPath">
        <el-cascader
          v-model="queryParams.emergencyTypeFullPath"
          style="width: 100%;"
          :options="options"
          :props="props"
          placeholder="请选择事件类别"
          clearable></el-cascader>
      </el-form-item>
      <el-form-item label="行政级别" prop="planSystemFullPath">
        <el-select v-model="queryParams.planSystemFullPath" placeholder="请选择行政级别" disabled>
          <el-option
            v-for="dict in (type==='1'?dict.type['26']:dict.type['525'])"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="审核状态" prop="status">-->
      <!--        <el-select v-model="queryParams.examineStatus" placeholder="请选择审核状态" clearable>-->
      <!--          <el-option label="草稿" value="draft"/>-->
      <!--          <el-option label="审核中" value="auditing"/>-->
      <!--          <el-option label="审核通过" value="reviewed"/>-->
      <!--          <el-option label="已退回" value="returned"/>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
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
          v-hasPermi="['plans:establishment:add']"
          size="mini"
          @click="handleAdd"
        >新增预案
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="dataList" v-loading="loading">
      <el-table-column heade-align="center" prop="planName" label="预案名称" :show-overflow-tooltip="true"
                       min-width="160"></el-table-column>
      <el-table-column heade-align="center" prop="emergencyTypeFullPath" label="事件类别" :show-overflow-tooltip="true"
                       width="180">
        <template slot-scope="scope">
          <el-tag style="margin-right: 10px" v-for="(item,index) in buildTypeLabel(scope.row.emergencyTypeFullPath)" :key="index">
            <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
            <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])" :value="item[1]"/></span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column heade-align="center" prop="planSystemFullPath" label="行政级别" :show-overflow-tooltip="true"
                       width="180">
        <template slot-scope="scope">
          <dict-tag :options="(type==='1'?dict.type['26']:dict.type['525'])" :value="scope.row.planSystemFullPath"/>
        </template>
      </el-table-column>
      <el-table-column heade-align="center" prop="preparationDeptName" label="编制单位" :show-overflow-tooltip="true"
                       width="180"></el-table-column>
      <el-table-column heade-align="center" align="center" prop="versionNum" label="版本号" :show-overflow-tooltip="true"
                       width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.versionNum===1">{{ 'v' + scope.row.versionNum + '.0' }}</span>
          <el-button v-else type="text" @click="showHistoricalVersion(scope.row)">{{
              'v' + scope.row.versionNum + '.0'
            }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column heade-align="center" align="center" prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.auditStatus&&!scope.row.recordStatus">
            <el-tag v-if="scope.row.auditStatus==='draft'">未提交审核</el-tag>
            <el-tag v-if="scope.row.auditStatus==='auditing'" type="warning">审核中</el-tag>
            <el-tag v-if="scope.row.auditStatus==='reviewed'" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.auditStatus==='returned'" type="danger">退回</el-tag>
          </div>
          <div v-else-if="scope.row.auditStatus==='reviewed'&&scope.row.recordStatus">
            <el-tag v-if="scope.row.recordStatus==='notSubmitted'">未提交备案</el-tag>
            <el-tag v-if="scope.row.recordStatus==='submitted'" type="warning">备案中</el-tag>
            <el-tag v-if="scope.row.recordStatus==='recorded'" type="success">备案通过</el-tag>
            <el-tag v-if="scope.row.recordStatus==='returned'" type="danger">退回</el-tag>
          </div>
          <el-tag v-else>草稿</el-tag>
        </template>
      </el-table-column>
      <el-table-column heade-align="center" label="操作" align="center" width="180"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="!scope.row.auditStatus&&!scope.row.recordStatus"
            type="text"
            v-hasPermi="['plans:establishment:edit']"
            @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.row)">详情
          </el-button>
          <el-button
            v-if="!scope.row.auditStatus&&!scope.row.recordStatus"
            size="mini"
            type="text"
            v-hasPermi="['plans:establishment:remove']"
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
          <el-col :span="12">
            <el-form-item label="预案名称" prop="planName">
              <el-input v-model="form.planName" placeholder="请输入预案名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件类别" prop="emergencyTypeFullPath">
              <el-cascader
                v-model="form.emergencyTypeFullPath"
                style="width: 100%;"
                :options="options"
                :props="props"
                placeholder="请选择事件类别"
                clearable></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="行政级别" prop="planSystemFullPath">
              <el-select v-model="form.planSystemFullPath" placeholder="请选择行政级别" disabled>
                <el-option
                  v-for="dict in (type==='1'?dict.type['26']:dict.type['525'])"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编制单位" prop="preparationDeptId">
              <treeselect style="width: 100%" no-results-text="无部门数据"
                disabled
                v-model="form.preparationDeptId"
                :options="deptData"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择编制单位"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="planFileInfo" label="预案正文">
              <file-upload :value="form.planFile" :limit="1" :fileSize="10" :fileType="['doc', 'docx', 'pdf']"
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
    <plan-detail ref="planDetail" v-if="detailVisible" @goBack="getList"></plan-detail>
    <el-drawer
      class="historyCard"
      title="修订历史版本查看"
      size="50%"
      :visible.sync="drawerVisible"
      direction="rtl"
      :before-close="()=>{this.drawerVisible=false}">
      <el-timeline>
        <el-timeline-item :color="'#0bbd87'" v-for="(item,index) in historicalData" :key="index"
                          :timestamp="parseTime(item.createTime)" placement="top">
          <el-card>
            <div>
              <el-row>
                <el-col :span="20"><h4 style="font-size: 18px;font-weight: 700">{{ 'v' + item.versionNum + '.0' }}</h4>
                </el-col>
                <el-col :span="4" style="color: green;font-weight: 900"
                        v-if="versionNum===item.versionNum"><h3>当前版本</h3></el-col>
              </el-row>
            </div>
            <el-descriptions :column="1">
              <el-descriptions-item label="预案名称">
                {{ item.planName }}
              </el-descriptions-item>
              <el-descriptions-item label="事件类别">
                  <el-tag style="margin-right: 10px" v-for="(build,index) in buildTypeLabel(item.emergencyTypeFullPath)" :key="index">
                    <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="build[0]"/>
                    <span v-if="build[1]">/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(build[0])" :value="build[1]"/></span>
                  </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="行政级别">
                <dict-tag :options="(type==='1'?dict.type['26']:dict.type['525'])" :value="item.planSystemFullPath"/>
              </el-descriptions-item>
              <el-descriptions-item label="编制单位">
                {{ item.preparationDeptName }}
              </el-descriptions-item>
              <el-descriptions-item label="预案正文">
                <download-file v-if="item.planFileInfo" v-for="file in item.planFileInfo" :key="file.fileKey"
                               :fileName="file.fileName" :fileKey="file.fileKey"></download-file>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-drawer>
  </div>
</template>

<script>
import {listDeptTree} from "@/api/system/dept";
import {pageList, saveOrUpdate, delPlans, getPlanInfo, getHistory} from "@/api/plans/preplanRevision";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import planDetail from "./planDetail";
import {getDicts} from "@/api/system/dict/data";

export default {
  dicts: ['4', '26','525','601','608','611','622'],
  components: {Treeselect, planDetail},
  data() {
    return {
      // 遮罩层
      loading: true,
      detailVisible: false,
      drawerVisible: false,
      // 表格数据
      dataList: [],
      // 单位树选项
      deptData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        planName: undefined,
        emergencyTypeFullPath: undefined,
        planSystemFullPath: undefined,
        examineStatus: undefined,
        page: 1,
        size: 10,
      },
      options: [],
      props: {multiple: true},
      type: "1",
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        planName: [
          {required: true, message: "预案名称不能为空", trigger: "blur"}
        ],
        preparationDeptId: [
          {required: true, message: "编制单位不能为空", trigger: "blur"}
        ],
        emergencyTypeFullPath: [
          {required: true, message: "事件类别不能为空", trigger: "blur"}
        ],
        planSystemFullPath: [
          {required: true, message: "行政级别不能为空", trigger: "blur"}
        ],
      },
      // 总条数
      total: 0,
      historicalData: [],//历史数据
      versionNum:0
    };
  },
  created() {
    this.getList();
    this.getDeptData();
    this.buildOptions();
  },

  methods: {
    /** 查询单位 */
    getDeptData() {
      listDeptTree().then(response => {
        this.deptData = response.data;
      });
    },
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
    /**
     *构建事件类别
     */
    buildOptions() {
      getDicts(4).then(res => {
        this.options = res.data
        this.options.forEach(item => {
          item.label = item.dictName
          item.value = item.dictId
          switch (item.dictId) {
            case 274:
              item.children = Object.values(this.dict.type['601'])
              break;
            case 275:
              item.children = Object.values(this.dict.type['608'])
              break;
            case 276:
              item.children = Object.values(this.dict.type['611'])
              break;
            case 277:
              item.children = Object.values(this.dict.type['622'])
              break;
          }
        })
      })
    },
    /**
     * 构建类型信息
     */
    buildTypeLabel(val) {
      if(val){
        let pType = val.split(';');
        let typeList = []
        pType.filter(Boolean).forEach(item => {
          let arr = item.split(',')
          typeList.push(arr.map(Number));
        })
        return typeList;
      }
    },
    /**
     * 获取对应字典
     * @param val
     */
    getOptions(val) {
      let options = undefined
      switch (val) {
        case 274:
          options = this.dict.type['601']
          break;
        case 275:
          options = this.dict.type['608']
          break;
        case 276:
          options = this.dict.type['611']
          break;
        case 277:
          options = this.dict.type['622']
          break;
      }
      return options;
    },
    /** 转换数据结构 */
    normalizer(node) {
      if (!node.children || (node.children && !node.children.length)) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        planId: undefined,
        planName: undefined,
        emergencyTypeFullPath: undefined,
        planSystemFullPath: undefined,
        preparationDeptId: this.$store.state.user.deptId,
        documentNumber: undefined,
        planFileInfo: undefined,
        planFile: undefined,
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
      this.title = "添加应急预案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getPlanInfo(row.planId).then(response => {
        this.form = response.data;
        this.$set(this.form, 'emergencyTypeFullPath', +response.data.emergencyTypeFullPath)
        this.$set(this.form, 'planSystemFullPath', +response.data.planSystemFullPath)
        this.form.planFile = response.data.planFileInfo ? JSON.parse(response.data.planFileInfo) : undefined
        this.open = true;
        this.title = "修改应急预案";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.planFileInfo = this.form.planFile ? JSON.stringify(this.form.planFile) : ''
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
      this.$modal.confirm('是否确认删除名称为"' + row.planName + '"的预案？').then(function () {
        return delPlans(row.planId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    getFile(file) {
      this.form.planFile = file
    },
    handleDetail(row) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.planDetail.init(row)
      })
    },
    //查看历史版本
    showHistoricalVersion(row) {
      this.versionNum = row.versionNum
      getHistory(row.beforeChangeId).then(res => {
        if (res.data) {
          this.drawerVisible = true
          this.historicalData = res.data
          this.historicalData.forEach(item => {
            item.planFileInfo = item.planFileInfo ? JSON.parse(item.planFileInfo) : undefined
          })
        }
      })

    }
  }
};
</script>

<style lang="scss">
.historyCard {
  .el-card__body {
    padding: 0 20px;
  }
}
</style>
