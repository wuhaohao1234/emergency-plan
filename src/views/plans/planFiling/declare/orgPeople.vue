<!--组织成员-->
<template>
  <div id="orgPeople">
    <el-dialog title="组织成员" :visible.sync="visible" width="70%"
               :before-close="handleClose"
               append-to-body :close-on-click-modal="false">
      <div style="float: right;margin-bottom: 10px" v-if="handleType===2">
        <el-button icon="el-icon-plus" @click="addPeople" size="mini">添加人员
        </el-button>
        <el-button icon="el-icon-check" @click="savePeopleHandle" size="mini"
                   type="primary">确定
        </el-button>
      </div>

      <el-table :data="userList" border height="550" v-loading="loading">
        <el-table-column prop="userId" align="center" label="员工编号" :show-overflow-tooltip="true"
                         width="80"></el-table-column>
        <el-table-column prop="deptName" label="所属部门" header-align="center" :show-overflow-tooltip="true"
                         min-width="180">
        </el-table-column>
        <el-table-column prop="nickName" header-align="center" label="姓名" :show-overflow-tooltip="true"
                         width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isLeader" label="是否部门负责人" header-align="center" align="center"
                         :show-overflow-tooltip="true" width="180">
          <template slot-scope="scope">
            <el-radio v-if="handleType===2" v-model="scope.row.isLeader" :label="true"
                      @change="selectLeader(scope.row)">部门负责人
            </el-radio>
            <div v-else>
              <el-tag :type="scope.row.isLeader?'success':'info'">{{ scope.row.isLeader ? '是' : '否' }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="emergencyRole" label="应急角色" header-align="center"
                         width="200">
          <template slot-scope="scope">
            <el-input
              v-if="handleType===2"
              @blur="addEmergencyRoles(scope.row.emergencyRole)"
              v-model="scope.row.emergencyRole"
              placeholder="应急角色"
              clearable/>
            <span v-else>{{ scope.row.emergencyRole }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width"
                         v-if="handleType===2">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="添加人员" :visible.sync="addPeoVisible" width="70%" append-to-body :close-on-click-modal="false">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
        <el-form-item label="所属单位" prop="deptId">
          <treeselect no-results-text="无部门数据"
                      style="width: 200px"
                      v-model="queryParams.deptId"
                      :options="deptData"
                      :normalizer="normalizer"
                      :show-count="true"
                      placeholder="选择所属单位"
          />
        </el-form-item>
        <el-form-item label="员工编号" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入员工编号"
            clearable/>
        </el-form-item>
        <el-form-item label="员工姓名" prop="nickName">
          <el-input
            v-model="queryParams.nickName"
            placeholder="请输入员工姓名"
            clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="userData" border height="400" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="userId" label="员工编号" align="center" :show-overflow-tooltip="true"
                         width="80"></el-table-column>
        <el-table-column prop="deptName" label="所属部门" header-align="center" :show-overflow-tooltip="true"
                         min-width="180">
        </el-table-column>
        <el-table-column prop="nickName" label="姓名" header-align="center" :show-overflow-tooltip="true" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.nickName }}</span>&emsp;
            <el-tag v-if="scope.row.dataType=='system'" effect="plain" size="mini">系统</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAdd">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getList} from "@/api/system/user";
import {
  getOrgPeople,
  getOtherPeople,
  addPeoples
} from "@/api/plans/preplanRevision";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  props: {
    deptData: {
      type: Array,
      default: [],
    },
    planId: {
      type: Number,
      default: undefined,
    },
    handleType: {
      type: Number,
      default: 2, //1.查看详情 2.编辑
    }
  },
  name: "orgPeople",
  components: {
    Treeselect
  },
  data() {
    return {
      visible: true,
      loading: false,
      addPeoVisible: false,
      userList: [],
      queryParams: {
        page: 1,
        size: 10000,
        deptId: undefined,
        userId: '',
        nickName: '',
      },
      userData: [],
      multipleSelection: [],
      existUserId: [],//已存在的组织成员id,
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.getPeopleInfo(data)
    },
    handleClose() {
      this.visible = false
      this.$emit('cancel')
    },
    //删除人员操作
    handleDelete(row) {
      if (row.isLeader) {
        this.$modal.msgWarning('当前人员为部门负责人，无法删除')
        return
      }
      this.userList = this.userList.filter(item => item.userId !== row.userId)
      this.userList.forEach(item => {
        item.userInfo = {
          nickName: item.nickName,
          phoneNumber: item.phoneNumber
        }
      })
      let data = {
        planOrgId: this.orgId,
        peoples: this.userList,
      }
      this.existUserId = this.existUserId.filter(item => item !== row.userId)
    },
    //选择负责人
    selectLeader(row) {
      this.userList.forEach(item => {
        this.$set(item, 'isLeader', false)
        if (row.userId === item.userId) {
          this.$set(item, 'isLeader', true)
        }
        item.userInfo = {
          nickName: item.nickName,
          phoneNumber: item.phoneNumber
        }
      })
    },
    //添加人员
    addPeople() {
      this.addPeoVisible = true
      this.getUserList()
    },
    /**
     * 获取其他用户id
     */
    getOtherUid(orgId) {
      getOtherPeople(orgId).then(res => {
        this.existUserId = this.existUserId.concat(res.data)
        this.loading = false
      });
    },
    /**
     * 获取用户数据
     */
    getUserList() {
      this.existUserId = this.userList.map(item => item.userId)
      this.userData = []
      getList(this.queryParams).then(res => {
        res.data.content.forEach(item => {
          if (!this.existUserId.includes(item.userId)) {
            this.userData.push(item)
          }
        })
      });
    },
    //获取组织人员
    getPeopleInfo(data) {
      if(data.peoples){
        this.userList = data.peoples
        this.existUserId = this.existUserId.concat(data.peoples.map(item => item.userId))
        this.loading = false
      }
    },
    //添加应急角色
    addEmergencyRoles(value) {
      if (value) {
        this.userList.forEach(item => {
          item.userInfo = {
            nickName: item.nickName,
            phoneNumber: item.phoneNumber
          }
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getUserList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    submitAdd() {
      this.addPeoVisible = false
      let arr = this.userList.filter(item => item.isLeader)
      this.multipleSelection.forEach((item, index) => {
        this.$set(item, 'emergencyRole', '')
        this.$set(item, 'isLeader', false)
        item.userInfo = {
          nickName: item.nickName,
          phoneNumber: item.phoneNumber
        }
      })
      let list = this.userList.concat(this.multipleSelection)
      if (!arr.length) list[0].isLeader = true
      this.userList = list
    },
    // 取消按钮
    cancel() {
      this.addPeoVisible = false;
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
    /**
     * 保存人员操作
     */
    savePeopleHandle() {
      this.visible = false
      this.$emit('orgPeople',this.userList)
    }
  }
}
</script>

<style lang="scss">
#orgPeople {
  .el-dialog__body {
    padding: 0 20px 20px 20px;
  }
}
</style>
