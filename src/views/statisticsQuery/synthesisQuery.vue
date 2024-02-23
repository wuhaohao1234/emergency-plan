<!--综合查询-->
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
        <el-select v-model="queryParams.planSystemFullPath" placeholder="请选择行政级别" clearable>
          <el-option
            v-for="dict in (type==='1'?dict.type['26']:dict.type['525'])"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable>
          <el-option label="草稿" value="draft"/>
          <el-option label="审核中" value="auditing"/>
          <el-option label="审核通过" value="reviewed"/>
          <el-option label="已退回" value="returned"/>
        </el-select>
      </el-form-item>
      <el-form-item label="备案状态" prop="recordStatus">
        <el-select v-model="queryParams.recordStatus" placeholder="请选择备案状态" clearable>
          <el-option label="草稿" value="notSubmitted"/>
          <el-option label="备案中" value="submitted"/>
          <el-option label="备案通过" value="recorded"/>
          <el-option label="已退回" value="returned"/>
        </el-select>
      </el-form-item>
      <el-form-item label="日期区间" prop="status">
        <el-date-picker
          v-model="queryParams.queryDate"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList">
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
                       width="220"></el-table-column>
      <el-table-column heade-align="center" align="center" prop="versionNum" label="版本号" :show-overflow-tooltip="true"
                       width="120">
        <template slot-scope="scope">
          <span>{{ 'v' + scope.row.versionNum + '.0' }}</span>
        </template>
      </el-table-column>
      <el-table-column heade-align="center" label="操作" align="center" width="120"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.row)">详情
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
    <plan-detail ref="planDetail" v-if="detailVisible" @goBack="getList"></plan-detail>
  </div>
</template>

<script>
import {listDeptTree} from "@/api/system/dept";
import {synthesisQuery,enPlansSynthesisQuery} from "@/api/plans/preplanRevision";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import planDetail from "../plans/preplanRevision/establishment/planDetail";
import {getDicts} from "@/api/system/dict/data";

export default {
  name: "synthesisQuery",
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
      options: [],
      props: {multiple: true},
      // 查询参数
      queryParams: {
        planName: undefined,
        emergencyTypeFullPath: undefined,
        planSystemFullPath: undefined,
        auditStatus: undefined,
        recordStatus: undefined,
        page: 1,
        size: 10,
        queryDate: [],
        startTime:undefined,
        endTime:undefined
      },
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
      type:'1'
    };
  },
  created() {
    this.type = sessionStorage.getItem('BUSINESS_TYPE')
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
    /** 查询列表 */
    getList() {
      this.detailVisible = false
      this.loading = true;
      if(this.queryParams.queryDate.length){
        this.queryParams.startTime=this.queryParams.queryDate[0]
        this.queryParams.endTime=this.queryParams.queryDate[1]
      }
      (this.type==1?synthesisQuery:enPlansSynthesisQuery)(this.queryParams).then(response => {
        this.dataList = response.data.content;
        this.total = response.data.totalElements;
        this.loading = false;
      });
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
    handleDetail(row) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.planDetail.init(row)
      })
    },
  }
}
</script>

<style lang="scss">
.historyCard {
  .el-card__body {
    padding: 0 20px;
  }
}
</style>
