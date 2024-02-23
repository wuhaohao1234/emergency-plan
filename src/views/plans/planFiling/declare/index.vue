<!--备案申报-->
<template>
  <div class="app-container">
    <div v-if="!reportVisible&&!detailVisible&&!existPlanVisible">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="预案名称" prop="planName">
          <el-input
            v-model="queryParams.planName"
            placeholder="请输入预案名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="事件类别" prop="emergencyTypeList">
          <el-cascader
            collapse-tags
            v-model="queryParams.emergencyTypeList"
            style="width: 300px;"
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
            v-hasPermi="['plans:record:add']"
            @click="declareHandle"
          >备案申报
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="existPlanDeclare">已有预案备案</el-button>
        </el-col>
      </el-row>
      <el-table :data="dataList" v-loading="loading">
        <el-table-column prop="planName" label="预案名称" :show-overflow-tooltip="true" min-width="160">
          <template slot-scope="scope">
            <el-tooltip content="已有预案备案" placement="right" effect="light">
              <div v-if="scope.row.recordType===2" class="dot"></div>
            </el-tooltip>
            <span>{{ scope.row.planInfo.planName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="emergencyTypeFullPath" label="事件类别" :show-overflow-tooltip="true" width="250">
          <template slot-scope="scope">
            <el-tag style="margin-right: 10px" v-for="(item,index) in buildTypeLabel(scope.row.planInfo.emergencyTypeFullPath)" :key="index">
              <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
              <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])" :value="item[1]"/></span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="planSystemFullPath" label="行政级别" align="center" :show-overflow-tooltip="true" width="120">
          <template slot-scope="scope">
            <dict-tag :options="(type==='1'?dict.type['26']:dict.type['525'])" :value="scope.row.planInfo.planSystemFullPath"/>
          </template>
        </el-table-column>
        <el-table-column prop="preparationDeptName" label="编制单位" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.planInfo.preparationDeptName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="preparationDeptName" label="版本号" align="center" :show-overflow-tooltip="true"
                         width="100">
          <template slot-scope="scope">
            {{ 'v' + scope.row.planInfo.versionNum + '.0' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="备案状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==='draft'">草稿</el-tag>
            <el-tag v-if="scope.row.status==='auditing'" type="warning">审核中</el-tag>
            <el-tag v-if="scope.row.status==='reviewed'" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status==='returned'" type="danger">退回</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right"  align="center" width="180" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              :disabled="(scope.row.status!=='draft'&&scope.row.status!=='returned')"
              v-hasPermi="['plans:record:add']"
              @click="reportHandle(scope.row)"
            >申报
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="detailHandle(scope.row)"
            >详情
            </el-button>
            <el-button
              :disabled="scope.row.status!=='draft'"
              size="mini"
              type="text"
              v-hasPermi="['plans:record:remove']"
              @click="handleDelete(scope.row)"
            >删除
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
    </div>
    <el-dialog title="选择预案列表" :visible.sync="selectVisible" width="70%" append-to-body :close-on-click-modal="false">
      <el-form :model="planQuery" ref="planForm" size="small" :inline="true">
        <el-form-item label="预案名称" prop="planName">
          <el-input
            v-model="planQuery.planName"
            placeholder="请输入预案名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="事件类别" prop="emergencyTypeList">
          <el-cascader
            collapse-tags
            v-model="planQuery.emergencyTypeList"
            style="width: 300px;"
            :options="options"
            :props="props"
            placeholder="请选择事件类别"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="行政级别" prop="planSystemFullPath">
          <el-select v-model="planQuery.planSystemFullPath" placeholder="请选择行政级别" clearable>
            <el-option
              v-for="dict in (type==='1'?dict.type['26']:dict.type['525'])"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table height="350" :data="planData" @selection-change="handleSelectionChange"
                @select="select"
                @select-all="selectAll"
                ref="multipleTable">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="planName" label="预案名称" :show-overflow-tooltip="true" min-width="160"></el-table-column>
        <el-table-column prop="emergencyTypeFullPath" label="事件类别" :show-overflow-tooltip="true" width="250">
          <template slot-scope="scope">
            <el-tag style="margin-right: 10px" v-for="(item,index) in buildTypeLabel(scope.row.emergencyTypeFullPath)" :key="index">
              <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
              <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])" :value="item[1]"/></span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="planSystemFullPath" label="行政级别" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <dict-tag :options="(type==='1'?dict.type['26']:dict.type['525'])" :value="scope.row.planSystemFullPath"/>
          </template>
        </el-table-column>
        <el-table-column prop="planTypeFullPath" label="预案体系" :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <dict-tag :options="dict.type['632']" :value="scope.row.planTypeFullPath"/>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAdd" :disabled="!multipleSelection.length">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <add-record v-if="reportVisible" ref="addRecord" @goBack="getList"></add-record>
    <audit-content ref="auditContent" v-if="detailVisible" @goBack="getList"></audit-content>
    <exist-plan-record ref="existPlanRecord" v-if="existPlanVisible" @goBack="getList"></exist-plan-record>
  </div>
</template>

<script>
import {noRecordQuery, pageList, removeRecord} from "@/api/plans/planRecord";
import addRecord from "./addRecord";
import auditContent from "../audit/auditContent";
import existPlanRecord from "./existPlan/existPlanRecord";
import {getDicts} from "@/api/system/dict/data";

export default {
  name: "index",
  components: {addRecord, auditContent, existPlanRecord},
  dicts: ['4', '26','525','601','608','611','622','632','662'],
  data() {
    return {
      multipleSelection: [],
      planData: [],
      loading: false,
      reportVisible: false,
      selectVisible: false,
      detailVisible: false,
      existPlanVisible: false,
      total: 0,
      dataList: [],
      queryParams: {
        planName: undefined,
        emergencyTypeList: [],
        planSystemFullPath: undefined,
        examineStatus: undefined,
        page: 1,
        size: 10,
      },
      planQuery: {
        planName: undefined,
        emergencyTypeList: [],
        planSystemFullPath: undefined,
      },
      type: "1",
      options: [],
      props: {multiple: true},
    }
  },
  created() {
    this.type = sessionStorage.getItem('BUSINESS_TYPE')
    this.buildOptions();
    this.getList()
  },
  methods: {
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
            case 661:
              item.children = Object.values(this.dict.type['662'])
              break;
          }
        })
      })
    },
    /**
     * 构建类型信息
     */
    buildTypeLabel(val) {
      let pType = val.split(';');
      let typeList = []
      pType.filter(Boolean).forEach(item => {
        let arr = item.split(',')
        typeList.push(arr.map(Number));
      })
      return typeList;
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
        case 661:
          options = this.dict.type['662']
          break;
      }
      return options;
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      this.reportVisible = false;
      this.detailVisible = false;
      this.existPlanVisible = false;
      pageList(this.queryParams).then(response => {
        this.dataList = response.data.content;
        this.total = response.data.totalElements;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.selectVisible) {
        this.getPlanList()
      } else {
        this.getList();
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      if (this.selectVisible) {
        this.resetForm("planForm");
      } else {
        this.resetForm("queryForm");
      }
      this.handleQuery();
    },
    declareHandle() {
      this.selectVisible = true;
      this.getPlanList()
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.multipleSelection = [val[0]]
      } else {
        this.multipleSelection = val;
      }
    },
    //获取预案列表
    getPlanList() {
      noRecordQuery(this.planQuery).then(response => {
        this.planData = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.selectVisible = false;
    },
    submitAdd() {
      this.selectVisible = false
      this.reportVisible = true
      this.$nextTick(() => {
        this.$refs.addRecord.init(1, this.multipleSelection[0]);
      })
    },
    select(selection, row) {
      if (selection.length > 1) {
        let del_row = selection.shift()
        this.$refs.multipleTable.toggleRowSelection(del_row, false)
      }
    },
    selectAll(selection) {
      if (selection.length > 1) {
        selection.length = 1
      }
    },
    reportHandle(row) {
      this.reportVisible = true
      this.$nextTick(() => {
        this.$refs.addRecord.init(2, row);
      })
    },
    //删除
    handleDelete(row) {
      this.$modal.confirm('是否确认删除当前数据项？').then(function () {
        return removeRecord([row.recordId]);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    //详情
    detailHandle(row) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.auditContent.init(row,1)
      })
    },
    //已有预案备案
    existPlanDeclare() {
      this.existPlanVisible = true
      this.$nextTick(() => {
        this.$refs.existPlanRecord.init()
      })
    }
  }
}
</script>

<style scoped>
.dot {
 display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 100%;
  background: #19c219;
  margin:0 5px 0 -8px;
}
</style>
