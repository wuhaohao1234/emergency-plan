<!--预案修订-->
<template>
  <div id="planRevision">
    <el-tabs style="min-height: 700px" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="计划修订" name="one">
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
          <el-form-item label="体系分类" prop="planSystemFullPath">
            <el-select v-model="queryParams.planSystemFullPath" placeholder="请选择体系分类" clearable>
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

        <el-table
          v-if="refreshTable"
          :data="dataList"
          v-loading="loading"
        >
          <el-table-column prop="planName" label="预案名称" :show-overflow-tooltip="true" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.planInfo.planName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="emergencyTypeFullPath" label="事件类别" :show-overflow-tooltip="true" min-width="180">
            <template slot-scope="scope">
              <el-tag style="margin-right: 10px"
                      v-for="(item,index) in buildTypeLabel(scope.row.planInfo.emergencyTypeFullPath)" :key="index">
                <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
                <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2"
                                                :options="getOptions(item[0])" :value="item[1]"/></span>
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
          <el-table-column prop="documentNumber" align="center" label="文号" :show-overflow-tooltip="true" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.planInfo.documentNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-hasPermi="['plans:revise:add']"
                @click="handleUpdate(scope.row)"
              >修订
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
      </el-tab-pane>
      <el-tab-pane label="评估修订" name="tow">
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
          <el-form-item label="体系分类" prop="planSystemFullPath">
            <el-select v-model="queryParams.planSystemFullPath" placeholder="请选择体系分类" clearable>
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

        <el-table
          v-if="refreshTable"
          :data="dataList"
          v-loading="loading"
        >
          <el-table-column prop="planName" label="预案名称" :show-overflow-tooltip="true" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.planInfo.planName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="emergencyTypeFullPath" label="事件类别" :show-overflow-tooltip="true" min-width="180">
            <template slot-scope="scope">
              <el-tag style="margin-right: 10px"
                      v-for="(item,index) in buildTypeLabel(scope.row.planInfo.emergencyTypeFullPath)" :key="index">
                <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
                <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2"
                                                :options="getOptions(item[0])" :value="item[1]"/></span>
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
          <el-table-column prop="documentNumber" align="center" label="文号" :show-overflow-tooltip="true" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.planInfo.documentNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-hasPermi="['plans:revise:add']"
                @click="handleUpdate(scope.row)"
              >修订
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
      </el-tab-pane>
      <el-tab-pane label="预案备案修订" name="three">
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
          <el-form-item label="体系分类" prop="planSystemFullPath">
            <el-select v-model="queryParams.planSystemFullPath" placeholder="请选择体系分类" clearable>
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

        <el-table
          v-if="refreshTable"
          :data="dataList"
          v-loading="loading"
        >
          <el-table-column prop="planName" label="预案名称" :show-overflow-tooltip="true" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.planInfo.planName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="emergencyTypeFullPath" label="事件类别" :show-overflow-tooltip="true" min-width="180">
            <template slot-scope="scope">
              <el-tag style="margin-right: 10px"
                      v-for="(item,index) in buildTypeLabel(scope.row.planInfo.emergencyTypeFullPath)" :key="index">
                <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
                <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2"
                                                :options="getOptions(item[0])" :value="item[1]"/></span>
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
          <el-table-column prop="documentNumber" align="center" label="文号" :show-overflow-tooltip="true" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.planInfo.documentNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-hasPermi="['plans:revise:add']"
                @click="handleUpdate(scope.row)"
              >修订
              </el-button>
<!--              <el-button-->
<!--                size="mini"-->
<!--                type="text"-->
<!--                v-hasPermi="['plans:maintenance:add']"-->
<!--                @click="handleMaintenance(scope.row)"-->
<!--              >维护-->
<!--              </el-button>-->
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
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="'预案修订（'+oldData.planName+'）'" :visible.sync="open" width="70%" append-to-body
               :close-on-click-modal="false">
      <el-alert
        title="预案修订后将新增一条版本号+1的新预案"
        type="warning" show-icon>
      </el-alert>
      <el-form ref="form" style="margin-top: 10px" :show-message="false" :model="form" :rules="rules"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="预案名称" prop="planName">
              <el-input v-model="form.planName" placeholder="请输入预案名称" clearable/>
              <div class="spanStyle" v-if="form.planName!=oldData.planName">
                原：{{ oldData.planName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预案体系" prop="planTypeFullPath">
              <el-select v-model="form.planTypeFullPath" placeholder="请选择预案体系" clearable style="width: 100%">
                <el-option
                  v-for="dict in dict.type['632']"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
              <span class="spanStyle" v-if="form.planTypeFullPath!=oldData.planTypeFullPath">
                    原：<dict-tag :options="dict.type['632']" :value="oldData.planTypeFullPath"/>
                  </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="事件类别" prop="type">
              <el-cascader
                v-model="form.type"
                style="width: 100%;"
                :options="options"
                :props="props"
                placeholder="请选择事件类别"
                @change="handleChangeType"
                clearable></el-cascader>
              <span class="spanStyle" v-if="form.emergencyTypeFullPath!=oldData.emergencyTypeFullPath">
                    原：
                <el-tag style="margin-right: 10px" v-for="(item,index) in buildTypeLabel(oldData.emergencyTypeFullPath)"
                        :key="index">
              <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
              <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])"
                                              :value="item[1]"/></span>
            </el-tag>
                  </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="行政级别" prop="planSystemFullPath">
              <el-select v-model="form.planSystemFullPath" placeholder="请选择行政级别" clearable style="width: 100%">
                <el-option
                  v-for="dict in (type==='1'?dict.type['26']:dict.type['525'])"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
              <span class="spanStyle" v-if="form.planSystemFullPath!=oldData.planSystemFullPath">
                    原：<dict-tag :options="(type==='1'?dict.type['26']:dict.type['525'])" :value="oldData.planSystemFullPath"/>
                  </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编制单位" prop="preparationDeptId">
              <treeselect no-results-text="无部门数据"
                          disabled
                          v-model="form.preparationDeptId"
                          :options="deptData"
                          :normalizer="normalizer"
                          :show-count="true"
                          placeholder="选择编制单位"
                          style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="revisionRemark" label="修订说明">
              <el-input v-model="form.revisionRemark" placeholder="请输入修订说明" type="textarea" :row="2" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="planFileInfo" label="预案正文">
              <file-upload :value="form.planFile" :limit="1" :fileSize="10" :fileType="['doc', 'docx', 'pdf']"
                           @input="getFile"></file-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修订后版本号">
              <span>{{ 'v' + (form.versionNum + 1) + '.0' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <maintenance ref="maintenance" v-if="maintenanceVisible" @goBack="getList"></maintenance>
  </div>
</template>

<script>
import {amendmentPage} from "@/api/plans/planRecord";
import {planAmendment, getPlanInfo} from "@/api/plans/preplanRevision";
import maintenance from '../maintenance/index'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {listDeptTree} from "@/api/system/dept";
import {getDicts} from "@/api/system/dict/data";
import {planAmendmentQuery} from "@/api/plans/revision";
import {assessAmendmentQuery} from "@/api/plans/assess";

export default {
  dicts: ['4', '26','525', '601', '608', '611', '622','662','632'],
  components: {maintenance, Treeselect},
  data() {
    return {
      activeName: 'one',
      maintenanceVisible: false,
      // 单位树选项
      deptData: [],
      type: '1',
      options: [],
      props: {multiple: true},
      // 遮罩层
      loading: true,
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        planName: undefined,
        emergencyTypeList: [],
        planSystemFullPath: undefined,
        examineStatus: undefined,
        page: 1,
        size: 10,
      },
      // 表单参数
      form: {
        planId: undefined,
        planName: undefined,
        emergencyTypeFullPath: undefined,
        planSystemFullPath: undefined,
        preparationDeptId: this.$store.state.user.deptId,
        documentNumber: undefined,
        planFileInfo: undefined,
        planFile: undefined,
        revisionRemark: undefined,
        versionNum: undefined,
      },
      // 表单校验
      rules: {
        planName: [
          {required: true, message: "预案名称不能为空", trigger: "blur"}
        ],
        preparationDeptId: [
          {required: true, message: "编制单位不能为空", trigger: "blur"}
        ],
        type: [
          {required: true, message: "事件类别不能为空", trigger: "blur"}
        ],
        planSystemFullPath: [
          {required: true, message: "行政级别不能为空", trigger: "blur"}
        ],
        planTypeFullPath: [
          {required: true, message: "预案体系不能为空", trigger: "blur"}
        ],
        revisionRemark: [
          {required: true, message: "修订说明不能为空", trigger: "blur"}
        ],
      },
      // 总条数
      total: 0,
      oldData: {}
    };
  },
  created() {
    this.planAmendmentPage()
    this.getDeptData()
    this.buildOptions();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.maintenanceVisible = false
      this.loading = true;
      amendmentPage(this.queryParams).then(response => {
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
      if (val) {
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
        case 661:
          options = this.dict.type['662']
          break;
      }
      return options;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      switch (this.activeName) {
        case 'one':
          this.queryParams={
            "planName": undefined,
              "emergencyTypeList": [],
              "planSystemFullPath": undefined,
              "examineStatus": undefined,
              "page": 1,
              "size": 10,
          }
          this.planAmendmentPage()
          break;
        case 'tow':
          this.queryParams={
            "planName": undefined,
            "emergencyTypeList": [],
            "planSystemFullPath": undefined,
            "examineStatus": undefined,
            "page": 1,
            "size": 10,
          }
          this.assessAmendmentPage()
          break;
        case 'three':
          this.queryParams={
            "planName": undefined,
            "emergencyTypeList": [],
            "planSystemFullPath": undefined,
            "examineStatus": undefined,
            "page": 1,
            "size": 10,
          }
          this.getList()
          break;
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 修订按钮操作 */
    handleUpdate(row) {
      this.reset();
      getPlanInfo(row.planInfo.planId).then(response => {
        this.form = response.data;
        let typeStr = response.data.emergencyTypeFullPath;
        if (typeStr) {
          let pType = typeStr.split(';');
          let typeList = []
          pType.filter(Boolean).forEach(item => {
            let arr = item.split(',')
            typeList.push(arr.map(Number));
          })
          this.$set(this.form, 'type', typeList)
        }
        this.$set(this.form, 'emergencyTypeFullPath', response.data.emergencyTypeFullPath)
        this.$set(this.form, 'planSystemFullPath', +response.data.planSystemFullPath)
        this.form.planFile = response.data.planFileInfo ? JSON.parse(response.data.planFileInfo) : undefined
        this.open = true;
        this.title = "修改应急预案";
        this.oldData = JSON.parse(JSON.stringify(response.data))
      });
    },
    //维护
    handleMaintenance(row) {
      this.maintenanceVisible = true
      this.$nextTick(() => {
        this.$refs.maintenance.init(row)
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let str = "";
          this.form.type.forEach(item => {
            str += item.join(',') + ';'
          })
          this.form.emergencyTypeFullPath = str;
          this.form.planFileInfo = this.form.planFile ? JSON.stringify(this.form.planFile) : ''
          planAmendment(this.form).then(response => {
            if (response.code === 200) {
              this.$modal.msgSuccess("修订成功");
            }
            this.open = false;
            switch (this.activeName) {
              case 'one':
                this.planAmendmentPage()
                break;
              case 'tow':
                this.assessAmendmentPage()
                break;
              case 'three':
                this.getList()
                break;
            }
          });
        }
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
        revisionRemark: undefined,
        versionNum: undefined,
      };
    },
    getFile(file) {
      this.form.planFile = file
    },
    /** 查询单位 */
    getDeptData() {
      listDeptTree().then(response => {
        this.deptData = response.data;
      });
    },
    /**
     * 计划修编查询
     */
    planAmendmentPage() {
      this.loading = true;
      planAmendmentQuery(this.queryParams).then(response => {
        this.dataList = response.data.content;
        this.total = response.data.totalElements;
        this.loading = false;
      });
    },
    /**
     *评估修编查询
     */
    assessAmendmentPage() {
      this.loading = true;
      assessAmendmentQuery(this.queryParams).then(response => {
        this.dataList = response.data.content;
        this.total = response.data.totalElements;
        this.loading = false;
      });
    },

    /**
     * tab切换
     * @param tab
     * @param event
     */
    handleClick(tab, event) {
      switch (tab.name) {
        case 'one':
          this.planAmendmentPage()
          break;
        case 'tow':
         this.assessAmendmentPage()
          break;
        case 'three':
          this.getList()
          break;
      }
    },
    handleChangeType() {
      this.form.emergencyTypeFullPath = this.form.type;
    },

  }
};
</script>
<style>
.spanStyle {
  color: #9a6e3a;
  margin: 5px 0 -20px 0;
  display: flex;
}

#planRevision {
  padding: 10px;
}
</style>
