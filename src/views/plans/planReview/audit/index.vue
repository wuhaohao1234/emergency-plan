<!--预案审核-->
<template>
  <div class="app-container">
    <div v-if="!auditVisible">
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
      <el-table :data="dataList"  v-loading="loading">
        <el-table-column prop="planName" label="预案名称" :show-overflow-tooltip="true" min-width="160">
          <template slot-scope="scope">
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
<!--        <el-table-column prop="documentNumber" header-align="center" align="center" label="版本号" :show-overflow-tooltip="true" width="100">-->
<!--          <template slot-scope="scope">-->
<!--            {{'v'+scope.row.planInfo.versionNum+'.0'}}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="reportTime" header-align="center" align="center" label="提交时间" width="180">
        </el-table-column>
        <el-table-column prop="status" label="审核状态" width="80" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==='draft'">草稿</el-tag>
            <el-tag v-if="scope.row.status==='auditing'" type="warning">审核中</el-tag>
            <el-tag v-if="scope.row.status==='reviewed'" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status==='returned'" type="danger">退回</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="160" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              v-hasPermi="['plans:audit:examine']"
              :disabled="scope.row.status!=='auditing'"
              @click="auditHandle(scope.row)"
            >审核
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="detailHandle(scope.row)"
            >详情
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
    <plan-audit v-if="auditVisible" :handleType="handleType" ref="planAudit" @goBack="getList"></plan-audit>
  </div>
</template>

<script>
import {auditPage} from "@/api/plans/planAudit";
import planAudit from "./planAudit";
import {getDicts} from "@/api/system/dict/data";

export default {
  name: "index",
  dicts: ['4', '26','525', '601', '608', '611', '622', '531','662'],
  components: {planAudit},
  data() {
    return {
      handleType:1,
      loading: false,
      auditVisible: false,
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
      type: "1",
      options: [],
      props: {multiple: true},
    }
  },
  created() {
    this.type = sessionStorage.getItem('BUSINESS_TYPE')
    this.getList();
    this.buildOptions();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      this.auditVisible = false;
      auditPage(this.queryParams).then(response => {
        this.dataList = response.data.content;
        this.total = response.data.totalElements;
        this.loading = false;
      });
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
    detailHandle(row) {
      this.handleType=1
      this.auditVisible = true
      this.$nextTick(()=>{
        this.$refs.planAudit.init(row)
      })
    },
    auditHandle(row) {
      this.handleType=2
      this.auditVisible = true
      this.$nextTick(()=>{
        this.$refs.planAudit.init(row)
      })
    }
  }
}
</script>

<style scoped>

</style>

