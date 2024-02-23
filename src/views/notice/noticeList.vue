<template>
  <div class="app-container">
    <div class="search-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="80px">
        <el-form-item label="通知编号">
          <el-input v-model="queryParams.noticeId" placeholder="请输入通知编号" clearable
                    @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="发布机构">
          <treeselect no-results-text="无机构数据"
                      v-model="queryParams.deptId"
                      :options="deptData"
                      :normalizer="normalizer"
                      style="width: 240px"
                      :show-count="true"
                      placeholder="选择发布机构"
                      @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" style="margin-left: 20px" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button size="small" @click="changeAllStatus" :type="isAll == true ? 'primary' : ''" plain>全部</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button size="small" @click="changeReadStatus" :type="isRead == true ? 'primary' : ''" plain>已读
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button size="small" @click="changeUnReadStatus" :type="unRead == true ? 'primary' : ''" plain>未读
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button size="small" @click="changeStarStatus" :type="isStar == true ? 'primary' : ''" plain>星标
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button size="small" @click="handleUpdateStatus" type="primary">全部标为已读</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button size="small" type="primary">
            <el-dropdown @command="handleDropdownCommand">
            <span style="color: white">
              批量标记为
              <i class="el-icon-more"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="read">已读</el-dropdown-item>
                <el-dropdown-item command="unread">未读</el-dropdown-item>
                <el-dropdown-item command="star">标星</el-dropdown-item>
                <el-dropdown-item command="unstar">取消标星</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button size="small" @click="handleDel" type="danger" plain>删除</el-button>
        </el-col>
      </el-row>
    </div>
    <!--列表-->
    <div class="list-container">
      <el-table
        ref="multipleTableRef"
        :data="noticeList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"/>
        <el-table-column label="通知标题" align="left" prop="title">
          <template slot-scope="scope">
            <el-button type="text" @click="handleViewDetail(scope.row)">{{ scope.row.title }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="通知内容" align="left" prop="content">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.content" placement="top">
              <div class="ellipsis" style="max-width: 150px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                {{ scope.row.content }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="发布机构" align="left" prop="deptName"/>
        <el-table-column label="发布时间" align="left" prop="auditTime"/>
        <el-table-column label="状态" align="center" prop="isRead" width="120px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isRead" type="success">已读</el-tag>
            <el-tag v-else type="danger">未读</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标记" align="center" prop="isStar" width="120px">
          <template slot-scope="scope">
            <el-button
              :icon="scope.row.isStar ? 'el-icon-star-on' : 'el-icon-star-off'"
              :type="scope.row.isStar ? 'warning' : ''"
              size="medium"
              circle
              @click="handleChangeStar(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="getList"/>
    </div>
    <el-dialog :title="title" :visible.sync="details" width="70%" append-to-body>
      <div style="border-top: 1px solid #EBEBEB;">
        <h2>{{ data.title }}</h2>
        <div style="border-top: 1px solid #EBEBEB;">
          <div style="font-weight: bold;font-size: 16px;">{{ data.deptName }}</div>
          <div style="color: #999;">{{ data.auditTime }}</div>
          <div style="padding: 1em 0;">{{ data.content }}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  delNoticeAll,
  getNoticeDeatil,
  getNoticeInfoList,
  updateNoticeAllReadStatus, updateNoticeReadStatus, updateNoticeStarStatus
} from "@/api/notice/noticeList";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {listDeptTree} from "@/api/system/dept";

export default {
  components: {Treeselect},
  data() {
    return {
      noticeList: [],
      selectedRows: [],
      queryParams: {
        page: 1,
        size: 10,
        noticeId: null,
        deptId: null,
        searchTag: ""
      },
      total: 0,
      title: "",
      details: false,
      deptData: [],
      data: {
        title: "",
        deptName: "",
        auditTime: "",
        content: ""
      },
      isAll: true,
      isRead: false,
      unRead: false,
      isStar: false,
    };
  },
  mounted() {
    this.getList();
    this.getDeptData();
  },
  methods: {
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
    /** 查询单位 */
    getDeptData() {
      listDeptTree().then(response => {
        this.deptData = response.data;
      });
    },
    // 查询
    handleQuery() {
      this.getList()
    },
    // 重置
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getList() {
      getNoticeInfoList(this.queryParams).then(res => {
        this.noticeList = res.data.content
      });
    },
    changeAllStatus() {
      this.isAll = true;
      this.isStar = false;
      this.unRead = false;
      this.isRead = false;
      this.queryParams.searchTag = "all"
      this.getList()
    },
    changeReadStatus() {
      this.isAll = false;
      this.isStar = false;
      this.unRead = false;
      this.isRead = true;
      this.queryParams.searchTag = "read"
      this.getList()
    },
    changeUnReadStatus() {
      this.isAll = false;
      this.isRead = false;
      this.isStar = false;
      this.unRead = true;
      this.queryParams.searchTag = "unread"
      this.getList()
    },
    changeStarStatus() {
      this.isAll = false;
      this.isRead = false;
      this.unRead = false;
      this.isStar = true;
      this.queryParams.searchTag = "star"
      this.getList()
    },
    handleDropdownCommand(command) {
      switch (command) {
        case 'read':
          this.handleUpdateRead();
          break;
        case 'unread':
          this.handleUpdateUnRead();
          break;
        case 'star':
          this.handleUpdateStar();
          break;
        case 'unstar':
          this.handleUpdateUnStar();
          break;
      }
    },
    handleUpdateStatus() {
      updateNoticeAllReadStatus().then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功');
          this.getList();
        }
      });
    },
    handleUpdateRead() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要修改的数据');
      }else {
        let rowData = {
          isRead: true,
          noticeIds: [],
        };
        this.selectedRows.forEach(item => {
          rowData.noticeIds.push(item.noticeId);
        });
        updateNoticeReadStatus(rowData).then(res => {
          if (res.code === 200) {
            this.$message.success('修改成功');
            this.getList();
          }
        });
      }
    },
    handleUpdateUnRead() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要修改的数据');
      }else {
        let rowData = {
          isRead: false,
          noticeIds: [],
        };
        this.selectedRows.forEach(item => {
          rowData.noticeIds.push(item.noticeId);
        });
        updateNoticeReadStatus(rowData).then(res => {
          if (res.code === 200) {
            this.$message.success('修改成功');
            this.getList();
          }
        });
      }
    },
    handleUpdateStar() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要修改的数据');
      }else {
        let rowData = {
          isStar: true,
          noticeIds: [],
        };
        this.selectedRows.forEach(item => {
          rowData.noticeIds.push(item.noticeId);
        });
        updateNoticeStarStatus(rowData).then(res => {
          if (res.code === 200) {
            this.$message.success('修改成功');
            this.getList();
          }
        });
      }
    },
    handleUpdateUnStar() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要修改的数据');
      }else {
        let rowData = {
          isStar: false,
          noticeIds: [],
        };
        this.selectedRows.forEach(item => {
          rowData.noticeIds.push(item.noticeId);
        });
        updateNoticeStarStatus(rowData).then(res => {
          if (res.code === 200) {
            this.$message.success('修改成功');
            this.getList();
          }
        });
      }
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    //查看详情
    handleViewDetail(row) {
      getNoticeDeatil(row.noticeId).then(res => {
        this.details = true;
        this.data = res.data;
        this.title = "通知详情";
        if (!row.isRead) {
          let rowData = {
            isRead: true,
            noticeIds: [row.noticeId],
          };
          updateNoticeReadStatus(rowData)
        }
      });
    },
    handleCancel() {
      this.details = false;
      this.getList();
    },
    handleDel() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的数据');
      } else {
        delNoticeAll(this.selectedRows).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getList();
          }
        });
      }

    },
    //改变标记
    handleChangeStar(row) {
      let rowData = {
        isStar: !row.isStar,
        noticeIds: [row.noticeId]
      };
      updateNoticeStarStatus(rowData).then(res => {
        if (res.code == 200) {
          this.$message.success('标星成功');
          row.isStar = !row.isStar;
          this.getList();
        }
      })
    },
  },

}
</script>

<style scoped lang="scss">

</style>
