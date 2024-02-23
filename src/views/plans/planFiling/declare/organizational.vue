<!--组织机构-->
<template>
  <div class="organizational">
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="6">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix" style="margin-bottom: 8px">
            <span style="font-weight: 700;color: #606266">组织机构</span>
          </div>
          <el-tree default-expand-all
                   :data="organizationData"
                   node-key="$treeNodeId" ref="tree"
                   :default-checked-keys="['1']"
                   :highlight-current="true"
                   :expand-on-click-node="false"
                   :props="defaultProps"
                   @node-click="handleNodeClick">
           <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.orgName }}</span>
           </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span style="font-weight: 700;color: #606266">机构人员</span>
          </div>
          <el-table :data="userList" border v-loading="loading">
            <el-table-column prop="userId" align="center" label="员工编号" :show-overflow-tooltip="true"
                             width="80"></el-table-column>
            <el-table-column prop="deptName" label="所属部门" header-align="center" :show-overflow-tooltip="true"
                             min-width="180">
            </el-table-column>
            <el-table-column prop="nickName" header-align="center" label="姓名" :show-overflow-tooltip="true" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.nickName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isLeader" label="是否部门负责人" header-align="center" align="center"
                             :show-overflow-tooltip="true" width="180">
              <template slot-scope="scope">
                <el-tag :type="scope.row.isLeader?'success':'info'">{{ scope.row.isLeader ? '是' : '否' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="emergencyRole" label="应急角色" header-align="center" :show-overflow-tooltip="true"
                             width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.emergencyRole }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: "organizational",
  data() {
    return {
      operationType: 1,//1.修改 2.新增
      organizationData: [],
      defaultProps: {
        children: 'children',
        label: 'orgName'
      },
      total: 0,
      queryParams: {
        page: 1,
        size: 10000,
        deptId: undefined,
        userId: '',
        nickName: '',
      },
      userData: [],
      multipleSelection: [],
      userList: [{isLeader: true}],
      addPeoVisible: false,
      organizationVisible: false,
      detailVisible: false,
      orgInfo: {},//组织机构详情
      orgId: '',
      loading: false,//表格loading
      businessType:1,
    };
  },
  methods: {
    init(data) {
      this.getOrganizeInfo(data)
    },
    //获取组织机构详情
    getOrganizeInfo(data) {
      this.organizationData = [data];
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.organizationData[0].$treeNodeId)
        this.getPeopleInfo(this.organizationData[0].peoples)
      })
    },
    //切换组织机构
    async handleNodeClick(data) {
      this.loading = true
      await this.getPeopleInfo(data.peoples)
    },

    //获取组织人员
    getPeopleInfo(data) {
      this.userList = data
      this.loading = false
    },
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

<style lang="scss">
.organizational {
  margin: 0 20px;
  .el-card__body {
    padding: 0;
  }

  .el-card__header {
    padding: 10px 10px 5px;
    min-height: 40px;
    font-size: 14px;
  }
}

</style>

