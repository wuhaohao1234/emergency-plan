<!--预案衔接-->
<template>
  <div id="planConnection">
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
            v-for="item in (type==='1'?dict.type['26']:dict.type['525'])"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList">
      <el-table-column prop="planName" label="预案名称" :show-overflow-tooltip="true" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.planInfo.planName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="emergencyTypeFullPath" label="事件类别" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <el-tag style="margin-right: 10px" v-for="(item,index) in buildTypeLabel(scope.row.planInfo.emergencyTypeFullPath)" :key="index">
            <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
            <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])" :value="item[1]"/></span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="planSystemFullPath" label="行政级别" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <dict-tag :options="(type==='1'?dict.type['26']:dict.type['525'])" :value="scope.row.planInfo.planSystemFullPath"/>
        </template>
      </el-table-column>
      <el-table-column prop="preparationDeptName" label="编制单位" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.planInfo.preparationDeptName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="documentNumber" label="文号" align="center" :show-overflow-tooltip="true" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.planInfo.documentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column heade-align="center" prop="status" label="衔接状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="ids.includes(scope.row.recordId.toString())" type="success">已衔接</el-tag>
          <el-tag v-else type="info">未衔接</el-tag>
        </template>
      </el-table-column>
      <el-table-column heade-align="center" label="操作" align="center" width="180"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.row)"
          >详情
          </el-button>
          <el-button
            v-if="handleType===2&&(!ids.includes(scope.row.recordId.toString()))"
            size="mini"
            type="text"
            @click="linkUpHandle(scope.row)"
          >衔接
          </el-button>
          <el-button
            v-if="handleType===2&&(ids.includes(scope.row.recordId.toString()))"
            size="mini"
            type="text"
            @click="cancelLinkUpHandle(scope.row)"
          >取消衔接
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <plan-detail ref="planDetail" v-if="detailVisible" @goBack="getList"></plan-detail>
  </div>
</template>

<script>
import {connectionList, getRecordInfo} from "@/api/plans/planRecord";
import planDetail from "../../../preplanRevision/establishment/planDetail";
import {getDicts} from "@/api/system/dict/data";

export default {
  dicts: ['4', '26','525','601','608','611','622'],
  name: "planConnection",
  components: {
    planDetail
  },
  props: {
    handleType: {
      type: Number,
      default: 2, //1.查看详情 2.编辑
    },
    recordId: {
      type: Number,
      default: null,
    }
  },
  mounted() {
    this.getList();
    this.buildOptions();
  },
  data() {
    return {
      dataList: [],
      // 查询参数
      queryParams: {
        planName: undefined,
        emergencyTypeFullPath: undefined,
        planSystemFullPath: undefined,
        examineStatus: undefined,
      },
      ids: [],
      detailVisible: false,
      type: "1",
      options: [],
      props: {multiple: true},
    }
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.detailVisible = false
      this.loading = true;
      this.queryParams.recordId = this.recordId
      connectionList(this.queryParams).then(response => {
        this.dataList = response.data;
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //详情
    handleDetail(row) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.planDetail.init(row.planInfo)
      })
    },
    //衔接操作
    linkUpHandle(row) {
      let _this = this
      this.$modal.confirm('是否确认衔接当前预案？').then(function () {
        _this.ids.push(row.recordId.toString())
      }).then(() => {
        this.$modal.msgSuccess("衔接成功");
      })
    },
    //取消衔接
    cancelLinkUpHandle(row) {
      let _this = this
      this.$modal.confirm('是否取消衔接当前预案？').then(function () {
        _this.ids = _this.ids.filter(item => item != row.recordId)
      }).then(() => {
        this.$modal.msgSuccess("操作成功");
      })
    },
    //获取预案衔接数据
    getConnectionData() {
      this.$emit('getConnectionData', this.ids)
    }

  }
}
</script>

<style scoped>

</style>
