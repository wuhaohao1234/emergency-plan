<template>
  <div class="app-container">
    <div class="search-container">
      <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
      >
        <el-tab-pane label="通知发布" name="first">
          <el-form :model="queryPushParams" ref="queryPushForm" size="small" :inline="true" label-width="80px">
            <el-form-item label="通知编号">
              <el-input v-model="queryPushParams.noticeId" clearable placeholder="请输入通知编号"/>
            </el-form-item>
            <el-form-item label="审核人">
              <el-input v-model="queryPushParams.nickName" clearable placeholder="请输入审核人"/>
            </el-form-item>
            <el-form-item label="通知状态">
              <el-select v-model="queryPushParams.status" placeholder="请选择通知状态">
                <el-option v-for="item in statusOption" :label="item.lable" :value="item.status">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handlePushQuery">查询</el-button>
              <el-button icon="el-icon-refresh" style="margin-left: 20px" size="mini" @click="resetPushQuery">重置
              </el-button>
            </el-form-item>
          </el-form>
          <div>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button icon="el-icon-plus" size="small" type="primary" @click="handleAddPush">新建通知</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" size="small" plain @click="handleDelPush">删除</el-button>
              </el-col>
            </el-row>
          </div>
          <el-table
            ref="multipleTableRef"
            :data="noticePushList"
            style="width: 100%"
            @selection-change="handlePushSelectionChange">
            <el-table-column type="selection"/>
            <el-table-column label="通知标题" prop="title" align="left">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDetail(scope.row)">{{ scope.row.title }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="通知内容" prop="content" align="left">
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.content" placement="top">
                  <div class="ellipsis" style="max-width: 150px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                    {{ scope.row.content }}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="提交时间" prop="commitTime" align="left"/>
            <el-table-column label="状态" prop="status" align="left">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status==='draft'" type="info">草稿</el-tag>
                <el-tag v-if="scope.row.status==='withdrawn'" type="info">已撤销</el-tag>
                <el-tag v-if="scope.row.status==='returned'" type="danger">已退回</el-tag>
                <el-tag v-if="scope.row.status==='invalid'" type="info">已作废</el-tag>
                <el-tag v-if="scope.row.status==='published'" type="success">已发布</el-tag>
                <el-tag v-if="scope.row.status==='auditing'" type="warning">审核中</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="审核人" prop="auditNickName" align="left"/>
            <el-table-column label="审核时间" prop="auditTime" align="left"/>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.status==='auditing'"
                  @click="handleReturnPush(scope.row)">撤回
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  style="color: red"
                  v-if="scope.row.status==='draft'||scope.row.status==='returned'||scope.row.status==='withdrawn'"
                  @click="handlePushDelete(scope.row)">删除
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.status==='draft'"
                  @click="handlePublish(scope.row)">提交
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.status==='returned'||scope.row.status === 'withdrawn'"
                  @click="handlePublish(scope.row)">重新提交
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.status==='published'"
                  @click="handleDetail(scope.row)">详情
                </el-button>
                <el-button v-if="scope.row.status==='invalid'" type="text"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="listTotal>0"
            :total="listTotal"
            :page.sync="queryPushParams.page"
            :limit.sync="queryPushParams.size"
            @pagination="handlePushQuery"
          />
        </el-tab-pane>
        <el-tab-pane :label="'通知审核 (' + count + ')'" name="second">
          <el-form :model="queryReviewParams" ref="queryReviewForm" size="small" :inline="true" label-width="80px">
            <el-form-item label="通知编号">
              <el-input v-model="queryReviewParams.noticeId" placeholder="请输入通知编号"/>
            </el-form-item>
            <el-form-item label="发布人">
              <el-input v-model="queryReviewParams.nikeName" placeholder="请输入发布人"/>
            </el-form-item>
            <el-form-item label="通知状态">
              <el-select v-model="queryReviewParams.status" placeholder="请选择通知状态">
                <el-option v-for="item in statusReviewOption" :label="item.lable" :value="item.status">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleReviewQuery">查询</el-button>
              <el-button icon="el-icon-refresh" style="margin-left: 20px" size="mini" @click="resetReviewQuery">重置
              </el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button size="small" @click="getAllStatus" :type="isAll == true ? 'primary' : ''" plain>全部</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button size="small" @click="getAuditStatus" :type="isAudit == true ? 'primary' : ''" plain>已审核</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button size="small" @click="getAuditingStatus" :type="isAuditing == true ? 'primary' : ''" plain>审核中</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="primary" size="small">
                <el-dropdown>
            <span style="color: white">
              批量审核
              <i class="el-icon-more"></i>
            </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click="handleUpdateReturn">退回</el-dropdown-item>
                    <el-dropdown-item @click="handleUpdatePush">同意发布</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button>
            </el-col>
          </el-row>
          <el-table
            ref="reviewTableRef"
            :data="noticeReviewList"
            style="width: 100%"
            @selection-change="handleReviewSelectionChange">
            <el-table-column type="selection"/>
            <el-table-column label="通知标题" prop="title" align="left">
              <template slot-scope="scope">
                <el-button type="text" @click="handleReviewDetail(scope.row)">{{ scope.row.title }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="通知内容" prop="content" align="left">
              <template slot-scope="scope">
                <el-tooltip :content="scope.row.content" placement="top">
                  <div class="ellipsis" style="max-width: 150px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                    {{ scope.row.content }}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="提交人" prop="commitNickName" align="left"/>
            <el-table-column label="提交时间" prop="commitTime" align="left"/>
            <el-table-column label="状态" prop="status" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status=='published'" type="success">已发布</el-tag>
                <el-tag v-if="scope.row.status=='invalid'" type="info">已作废</el-tag>
                <el-tag v-if="scope.row.status=='auditing'" type="warning">审核中</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="审核时间" prop="auditTime" align="center"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.status=='published'"
                  @click="handleReturn(scope.row)">作废
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.status=='auditing'"
                  @click="handleAudit(scope.row)">审核
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="auditTotal>0"
            :total="auditTotal"
            :page.sync="queryReviewParams.page"
            :limit.sync="queryReviewParams.size"
            @pagination="handleReviewQuery"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :title="title" :visible.sync="add" width="70%" append-to-body>
      <el-form :model="addForm" ref="addForm" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="通知标题" prop="title">
              <el-input v-model="addForm.title" placeholder="请输入通知标题" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="受理部门" prop="zfDeptIds">
              <el-cascader v-model="addForm.zfDeptIds"
                           style="width: 100%"
                           :options="saveTree"
                           :props="{
							   checkStrictly: true,
							   emitPath: false,
							   multiple: true,
							   label:'deptName',
							   value:'deptId'
							}"
                           clearable>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="通知内容" prop="content">
              <el-input v-model="addForm.content" style="width: 100%" type="textarea" :rows="2"
                        placeholder="请输入通知内容" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接收行业" prop="qyTypes">
              <el-select v-model="addForm.qyTypes" style="width: 100%" placeholder="请接收行业"
                         @input="updateForm('qyTypes',$event)" multiple collapse-tags clearable
              >
                <el-option
                  v-for="dict in dict.type['2']"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
                <el-option
                  :key="'all'"
                  :label="'所有行业'"
                  :value="allQyTypes"
                  :disabled="isAllQyTypesSelected"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批人" prop="auditUserId">
              <el-select v-model="addForm.auditUserId" placeholder="请选择审批人" style="width: 100%" clearable>
                <el-option
                  v-for="item in auditUserList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上传附件">
              <file-upload :value="addForm.files" :limit="1" :fileSize="5"
                           :fileType="['doc', 'docx', 'pdf','jpg','png']"
                           @input="getFile"></file-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px;">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="escalation">存为草稿</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="details" width="70%" append-to-body>
      <el-descriptions class="margin-top" :column="1" border>
        <el-descriptions-item>
          <template slot="label">
            标题
          </template>
          {{ data.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            内容
          </template>
          {{ data.content }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            接受政府机构
          </template>
          {{ data.zfDepts }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            接受企业行业
          </template>
          <el-tag style="margin-right: 10px" v-for="(item,index) in data.qyTypes"
                  :key="index">
            <dict-tag style="display: inline-block" :showType="2" :options="dict.type['2']" :value="item"/>
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            附件
          </template>
          <download-file v-if="data.files" v-for="item in data.files" :key="item.fileKey"
                         :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 10px">
        <el-tabs type="card">
          <el-tab-pane label="日志">
            <el-timeline :reverse="reverse">
              <el-timeline-item
                v-for="(operlog, index) in data.operLogs"
                :key="index"
                :timestamp="operlog.oper.nickName">
                {{ operlog.createTime }}
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer" v-if="audit">
        <el-button type="primary" @click="confirmPublish">同意发布</el-button>
        <el-button @click="confirmReturn">退回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  commitNoticeAuditInfo,
  delNoticeAuditInfo,
  delNoticeAuditList,
  getNoticeAuditDetail,
  getNoticeAuditInfo, getNoticeAuditingCount,
  getNoticeAuditList,
  pushAllNoticeAuditList, pushNoticeAuditList,
  retuenAllNoticeAuditList,
  retuenNoticeAudit,
  retuenNoticeAuditList,
  saveNoticeAuditInfo
} from "@/api/notice/noticeAudit";
import {childrenDept, listDeptTree} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getDeptUsers} from "@/api/system/user";

export default {
  components: {Treeselect},
  dicts: ['2'],
  data() {
    return {
      activeName: 'first',
      add: false,
      details: false,
      reverse: true,
      isAll: true,
      isAudit: false,
      isAuditing: false,
      audit: false,
      title: "",
      listTotal: 0,
      auditTotal: 0,
      count: 0,
      data: {},
      alternateTypes: [],
      allQyTypes: [], // 存储所有行业的值
      isAllQyTypesSelected: false, // 判断是否选择了“选择所有行业”
      queryPushParams: {
        page: 1,
        size: 10,
        noticeId: null,
        nickName: "",
        status: "",
      },
      queryReviewParams: {
        page: 1,
        size: 10,
        noticeId: null,
        nikeName: "",
        status: "",
        auditUserId: ""
      },
      addForm: {
        title: "",
        content: "",
        zfDeptIds: [],
        qyTypes: [],
        files: "",
      },
      noticePushList: [],
      noticeReviewList: [],
      selectedPushRows: [],
      selectedReviewRows: [],
      deptTree: [],
      saveTree: [],
      // 审核用户列表
      auditUserList: [],
      statusOption: [
        {
          lable: "草稿",
          status: "draft"
        },
        {
          lable: "审核中",
          status: "auditing"
        },
        {
          lable: "已退回",
          status: "returned"
        },
        {
          lable: "已发布",
          status: "published"
        },
        {
          lable: "已作废",
          status: "invalid"
        },
      ],
      statusReviewOption: [
        {
          lable: "审核中",
          status: "auditing"
        },
        {
          lable: "已发布",
          status: "published"
        },
        {
          lable: "已作废",
          status: "invalid"
        },
      ],
      // 表单校验
      rules: {
        title: [
          {required: true, message: "通知标题不能为空", trigger: "blur"}
        ],
        content: [
          {required: true, message: "通知内容不能为空", trigger: "blur"}
        ],
        zfDeptIds: [
          {required: true, message: "政府机构不能为空", trigger: "change"}
        ],
        auditUserId: [
          {required: true, message: "审批人不能为空", trigger: "change"}
        ]
      }
    };
  },
  mounted() {
    this.handlePushQuery();
    this.getAllDepartment();
    this.getAuditUserList();
    this.getAuditingCount();
  },
  methods: {
    /** 查询所有部门*/
    getAllDepartment() {
      listDeptTree().then(response => {
        response.data.forEach(item => {
          if (item.deptId == this.$store.state.user.deptId) {
            this.deptTree = item.children;
          }
        });
      })
      childrenDept(this.$store.state.user.deptId, 0).then(res => {
        this.saveTree = res.data;
      });
      this.alternateTypes = this.dict.type['2']
    },
    // 获取审核人列表
    getAuditUserList() {
      getDeptUsers(this.$store.state.user.deptId).then(res => {
        if (res.code == 200) {
          this.auditUserList = res.data;
        }
      });
    },
    // 获取审核中的通知数量
    getAuditingCount() {
      getNoticeAuditingCount().then(res => {
        this.count = res.data.count;
      });
    },
    /** 转换数据结构 */
    normalizer(node) {
      if (!node.children || (node.children && !node.children.length)) {
        delete node.children;
      }
      return {
        id: node.leaderId,
        label: node.deptName,
        children: node.children
      };
    },
    handleClick(tab) {
      if (tab.index === '1') {
        this.handleReviewQuery()
      } else {
        this.handlePushQuery();
      }
    },
    handlePushQuery() {
      getNoticeAuditInfo(this.queryPushParams).then(res => {
        this.noticePushList = res.data.content;
        this.listTotal = res.data.totalElements;
      });
    },
    handleReviewQuery() {
      getNoticeAuditList(this.queryReviewParams).then(res => {
        this.noticeReviewList = res.data.content;
        this.auditTotal = res.data.totalElements;
      });
    },
    handleReturnPush(row) {
      retuenNoticeAuditList(row.noticeId).then(res => {
        if (res.code === 200) {
          this.$message.success('撤回成功');
        }
        this.handlePushQuery();
        this.$forceUpdate();
      });
    },
    handleDelPush() {
      delNoticeAuditInfo(this.selectedPushRows).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功');
        }
        this.handlePushQuery();
      });
    },
    handlePublish(row) {
      getNoticeAuditDetail(row.noticeId).then(res => {
        if (res.code === 200) {
          this.title = "提交";
          this.add = true;
          let dept = [];
          let types = [];
          res.data.zfDepts.forEach(item => {
            dept.push(item.deptId)
          });
          res.data.qyTypes.forEach(item => {
            types.push(+item.fullPath);
          });
          this.addForm = res.data;
          this.addForm.zfDeptIds = dept;
          this.addForm.qyTypes = types;
        }
      });
    },
    handlePushDelete(row) {
      delNoticeAuditList(row.noticeId).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功');
        }
        this.handlePushQuery();
      });
    },
    handleAddPush() {
      this.add = true;
      this.title = "新建通知";
      this.resetForm("addForm");
      this.addForm={
        "title": "",
        "content": "",
        "zfDeptIds": [],
        "qyTypes": [],
        "files": "",
      }
    },
    resetPushQuery() {
      this.resetForm("queryPushForm");
      this.queryPushParams={
        "page": 1,
        "size": 10,
        "noticeId": null,
        "nickName": "",
        "status": ""
      }
      this.handlePushQuery();
    },
    resetReviewQuery() {
      this.resetForm("queryReviewForm");
      this.queryReviewParams = {
        "page": 1,
        "size": 10,
        "noticeId": null,
        "nikeName": "",
        "status": "",
        "auditUserId": ""
      };
      this.handleReviewQuery();
    },
    handlePushSelectionChange(val) {
      this.selectedPushRows = val.noticeId;
    },
    handleReviewSelectionChange(val) {
      this.selectedReviewRows = val.noticeId;
    },
    handleDetail(row) {
      getNoticeAuditDetail(row.noticeId).then(res => {
        this.audit = false;
        this.details = true;
        this.title = "详情";
        const name = [];
        res.data.zfDepts.forEach(item => {
          name.push(item.deptName)
        });
        res.data.operLogs.forEach(item => {
          if (item.status === 'auditing') {
            item.oper.nickName = item.oper.nickName + " 审核中";
          } else if (item.status === 'published') {
            item.oper.nickName = item.oper.nickName + " 审核通知 同意发布";
          } else if (item.status === 'invalid') {
            item.oper.nickName = item.oper.nickName + " 作废通知";
          } else if (item.status === 'returned') {
            item.oper.nickName = item.oper.nickName + " 审核通知 退回";
          } else {
            item.oper.nickName = item.oper.nickName + " 发布通知申请";
          }
        });
        this.data = res.data;
        this.data.zfDepts = name.join(',');
        if (res.data.qyTypes != []) {
          let types = [];
          res.data.qyTypes.forEach(item => {
            types.push(+item.fullPath)
          });
          this.data.qyTypes = types;
        }else {
          this.data.qyTypes = null;
        }
      });
    },
    handleReviewDetail(row) {
      getNoticeAuditDetail(row.noticeId).then(res => {
        this.audit = false;
        this.details = true;
        this.title = "详情";
        this.data = res.data;
        const name = [];
        res.data.zfDepts.forEach(item => {
          name.push(item.deptName)
        });
        res.data.operLogs.forEach(item => {
          if (item.status == 'auditing') {
            item.oper.nickName = item.oper.nickName + " 审核中";
          } else if (item.status == 'published') {
            item.oper.nickName = item.oper.nickName + " 审核通知 同意发布";
          } else if (item.status == 'invalid') {
            item.oper.nickName = item.oper.nickName + " 作废通知";
          } else if (item.status == 'returned') {
            item.oper.nickName = item.oper.nickName + " 审核通知 退回";
          } else {
            item.oper.nickName = item.oper.nickName + " 发布通知申请";
          }
        });
        this.data = res.data;
        this.data.zfDepts = JSON.stringify(name);
      });
    },
    getFile(file) {
      this.addForm.files = file
    },
    updateForm(field, value) {
      this.addForm[field] = value;
      // 判断是否选择了“选择所有行业”
      this.isAllQyTypesSelected = value.includes(this.allQyTypes);
      // 如果选择了“选择所有行业”，则将所有行业的值赋给 qyTypes
      if (this.isAllQyTypesSelected) {
        this.alternateTypes.forEach(item => {
          this.allQyTypes.push(item.value);
        });
        this.addForm.qyTypes = this.allQyTypes;
      }
      // 强制重新渲染视图
      this.$forceUpdate()
    },
    submitForm() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          commitNoticeAuditInfo(this.addForm).then(res => {
            if (res.code === 200) {
              this.$message.success('提交成功')
              this.add = false;
            }
            this.handlePushQuery();
            this.$forceUpdate()
          });
        }
      });
    },
    escalation() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          saveNoticeAuditInfo(this.addForm).then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.add = false;
            }
            this.handlePushQuery();
            this.$forceUpdate()
          });
        }
      })
    },
    cancel() {
      this.add = false;
    },
    getAllStatus() {
      this.isAll = true;
      this.isAudit = false;
      this.isAuditing = false;
      this.handleReviewQuery();
    },
    getAuditStatus() {
      this.isAll = false;
      this.isAudit = true;
      this.isAuditing = false;
      this.queryReviewParams.status = 'published';
      this.handleReviewQuery();
    },
    getAuditingStatus() {
      this.isAll = false;
      this.isAudit = false;
      this.isAuditing = true;
      this.queryReviewParams.status = 'auditing';
      this.handleReviewQuery();
    },
    handleReturn(row) {
      retuenAllNoticeAuditList(row.noticeId).then(res => {
        if (res.code === 200) {
          this.$message.success('退回成功')
        }
        this.handleReviewQuery();
      });
    },
    handleAudit(row) {
      getNoticeAuditDetail(row.noticeId).then(res => {
        this.details = true;
        this.audit = true;
        this.title = "审核";
        const name = [];
        const typeName = [];
        res.data.zfDepts.forEach(item => {
          name.push(item.deptName)
        });
        // if (res.data.qyTypes != []) {
        //   typeName.push(+res.data.qyTypes[0].fullPath);
        // }
        res.data.operLogs.forEach(item => {
          if (item.status == 'auditing') {
            item.oper.nickName = item.oper.nickName + " 审核中";
          } else if (item.status == 'published') {
            item.oper.nickName = item.oper.nickName + " 审核通知 同意发布";
          } else if (item.status == 'invalid') {
            item.oper.nickName = item.oper.nickName + " 作废通知";
          } else if (item.status == 'returned') {
            item.oper.nickName = item.oper.nickName + " 审核通知 退回";
          } else {
            item.oper.nickName = item.oper.nickName + " 发布通知申请";
          }
        });
        this.data = res.data;
        this.data.zfDepts = name.join(',');
        if (res.data.qyTypes != []) {
          let types = [];
          res.data.qyTypes.forEach(item => {
            types.push(item.fullPath)
          });
          this.data.qyTypes = types;
        }else {
          this.data.qyTypes = null;
        }
        // this.data.qyTypes = JSON.stringify(typeName);
      });
    },
    confirmPublish() {
      pushNoticeAuditList(this.data.noticeId).then(res => {
        if (res.code === 200) {
          this.$message.success('发布成功');
        }
        this.details = false;
        this.handleReviewQuery();
      });
    },
    confirmReturn() {
      retuenNoticeAudit(this.data.noticeId).then(res => {
        if (res.code === 200) {
          this.$message.success('退回成功');
        }
        this.details = false;
        this.handleReviewQuery();
      });
    },
    handleUpdateReturn() {
      const ids = this.selectedReviewRows.join(',')
      retuenAllNoticeAuditList(ids).then(res => {
        if (res.code === 200) {
          this.$message.success('退回成功')
        }
        this.handleReviewQuery();
      });
    },
    handleUpdatePush() {
      const ids = this.selectedReviewRows.join(',')
      pushAllNoticeAuditList(ids).then(res => {
        if (res.code === 200) {
          this.$message.success('发布成功')
        }
        this.handleReviewQuery();
      });
    },
  },
}
</script>
<style scoped lang="scss">

</style>
