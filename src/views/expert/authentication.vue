<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="专家姓名" prop="expertName">
        <el-input v-model="queryParams.expertName" placeholder="请输入专家姓名" clearable style="width: 240px"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="专业领域" prop="fieldFullPath">
        <el-select v-model="queryParams.fieldFullPath" clearable placeholder="请选择专业领域">
          <el-option v-for="item in dict.type['29']" :key="item.value" :label="item.label" :value="item.value"
                     @keyup.enter.native="handleQuery">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button style="margin-left: 20px" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-download" size="mini" @click="exportHandle">导出</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" v-loading="loading" style="margin-top: 10px">
      <el-col :span="8" v-for="item in typeList" :key="item.id">
        <el-card :body-style="{ padding: '15px',fontSize:'14px'}" style="margin-bottom: 10px">
          <el-row :gutter="50">
            <el-col :span="8">
              <img :src="item.expertPhoto" v-if="item.expertPhoto" style="width: 110px;height: 170px" alt="Base64 Image"/>
              <img v-else alt="Base64 Image" style="width: 110px;height: 170px" src="@/assets/images/expert.png"/>
            </el-col>
            <el-col :span="16">
              <p><span class="title">姓名：</span>{{ item.expertName }}</p>
              <p><span class="title">电话：</span>{{ item.phoneNumber }}</p>
<!--              <p><span class="title">领域：</span>-->
<!--                <dict-tag style="display: inline-block" :options="dict.type['29']" :value="item.fieldFullPath"/>-->
<!--              </p>-->
              <p><span class="title">职称：</span>
                <dict-tag style="display: inline-block;" :options="dict.type['31']"  :value="item.jobTitleFullPath"/>
              </p>
              <p><span class="title">认证状态：</span>
                <el-tag type="success" v-if="authStatus(item)">已认证</el-tag>
                <el-tag type="info" v-else>未认证</el-tag></p>
            </el-col>
          </el-row>
          <el-row>
            <div style="margin-top: 10px;position: relative">
              <span class="title">身份证号码：</span>{{ item.idNumber }}
              <div style="display: inline-block;position: absolute;right: 1px;bottom: -3px">
                <el-button size="small" type="text" @click="handleDetails(item)">详情</el-button>
                <el-button style="color:#13ce66" size="small" type="text" @click="authHandle(item)" v-if="!authStatus(item)">认证</el-button>
              </div>
            </div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!--详情-->
    <el-dialog :title="title" :visible.sync="details" width="70%" :close-on-click-modal="false" append-to-body>
      <el-descriptions class="margin-top" :column="2" border>
        <el-descriptions-item>
          <template slot="label">
            姓名
          </template>
          {{ form.expertName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            联系电话
          </template>
          {{ form.phoneNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            身份证号码
          </template>
          {{ form.idNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            所属区域
          </template>
          <dict-tag :options="businessType==1?dict.type['32']:dict.type['536']" :value="form.areaFullPath"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            电子邮箱
          </template>
          {{ form.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            最高学历
          </template>
          <dict-tag :options="dict.type['30']" :value="form.educationFullPath"/>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            应急类型
          </template>
          <el-tag v-if="form.emergencyTypeFullPath" style="margin-right: 10px"
                  v-for="(item,index) in buildTypeLabel(form.emergencyTypeFullPath)" :key="index">
            <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
            <span v-if="item[1]">/<dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])"
                                            :value="item[1]"/></span>
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            所学专业
          </template>
          {{ form.direction }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            工作单位
          </template>
          {{ form.unit }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            职称
          </template>
          <dict-tag :options="dict.type['31']" :value="form.jobTitleFullPath"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            专业领域
          </template>
          <dict-tag :options="dict.type['29']" :value="form.fieldFullPath"/>
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="details = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}

.card {
  width: 30%;
  margin: 10px;
}
.title {
  color: slategrey;
}
</style>

<script>
import {enExpertAuthPage, enExpertAuthInfo, enExpertAuth, enExpertExport} from "@/api/expert/authentication";
import {
  currentDept
} from "@/api/plans/preplanRevision";
import {
  listDeptTree
} from "@/api/system/dept";
import {
  formatType
} from "@/api/system/dict/type";
import fileDownload from "js-file-download";

export default {
  dicts: ["29", '4', '32','536', '30', '31', '601', '608', '611', '622','662'],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      sex: [{
        label: '男',
        value: '男'
      }, {
        label: '女',
        value: '女'
      }],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 计划表格数据
      typeList: [],
      //演练形式
      exerciseFormat: [],
      //演练规模
      exerciseScale: [],
      //应急类型
      emergencyType: [],
      //专业领域
      fieldType: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //详情弹出
      details: false,
      // 日期范围
      dateRange: [],
      //预案依据
      plans: [],
      //受理部门
      deptTree: [],
      businessType: sessionStorage.getItem('BUSINESS_TYPE'),
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        expertName: undefined,
        plan: {
          id: null
        },
        expertPhoto: undefined,
        unit: undefined,
        fieldFullPath: undefined,
        planDocumentNumber: undefined,
        emergencyTypeFullPath: undefined,
        age: undefined,
        sex: undefined,
        idNumber: undefined,
        exerciseFormatFullPath: undefined,
        exerciseScaleFullPath: undefined,
        contactPhone: undefined,
        contactName: undefined,
        finishTime: undefined,
        reportingDeptIds: {
          id: null
        },
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        drillName: [{
          required: true,
          message: "演练名称不能为空",
          trigger: "blur"
        }],
        exerciseFormatFullPath: [{
          required: true,
          message: "演练形式不能为空",
          trigger: "blur"
        }],
        exerciseScaleFullPath: [{
          required: true,
          message: "演练规模不能为空",
          trigger: "blur"
        }],
        exerciseStartTime: [{
          required: true,
          message: "演练开始时间不能为空",
          trigger: "blur"
        }],
        exerciseEndTime: [{
          required: true,
          message: "演练结束时间不能为空",
          trigger: "blur"
        }],
        contactName: [{
          required: true,
          message: "联系人不能为空",
          trigger: "blur"
        }],
        contactPhone: [{
          required: true,
          pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
          message: "请输入正确的手机号码",
          trigger: "blur"
        }],
        planDocumentNumber: [{
          required: true,
          message: "计划依据不能为空",
          trigger: "blur"
        }],
        reportingDeptIds: [{
          required: true,
          message: "受理部门不能为空",
          trigger: "blur"
        }],
        contact: [{
          required: true,
          message: "演练内容不能为空",
          trigger: "blur"
        }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询专家列表 */
    getList() {
      this.loading = true;
      enExpertAuthPage(this.queryParams).then(response => {
        response.data.content.forEach(item => {
          if (item.expertPhoto) {
            // 解码Base64字符串
            const binaryData = atob(item.expertPhoto);
            // 创建Uint8Array类型的数组
            const arrayBuffer = new ArrayBuffer(binaryData.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < binaryData.length; ++i) {
              uint8Array[i] = binaryData.charCodeAt(i);
            }
            // 转换为Blob URL
            const blobUrl = URL.createObjectURL(new Blob([uint8Array]));
            item.expertPhoto = blobUrl;
          }
        });
        this.typeList = response.data.content;
        this.total = response.data.totalElements
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        drillId: undefined,
        drillPlanName: undefined,
        documentNumber: undefined,
        status: "draft",
        remark: undefined,
        sex: undefined,
        idNumber: undefined
      };
      this.resetForm("form");
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
      this.queryParams.page = 1;
      this.getList();
    },
    /** 取消按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      const expertId = row.expertId
      enExpertAuthInfo(expertId).then(response => {
        this.form = response.data;
        this.details = true;
        this.title = "专家详情";
      });
    },
    handleSizeChange(val) {
      this.queryParams.size = val;
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.page = val;
      this.getList()
    },
    /**
     * 认证专家
     */
    authHandle(row) {
      this.$confirm('是否对当前专家经行认证操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enExpertAuth(row.expertId).then(res => {
          this.$modal.msgSuccess('认证成功')
          this.getList()
        })
      }).catch(() => {
      });
    },
    authStatus(row) {
      if (row.reportingDeptId) {
        return row.reportingDeptId.includes(this.$store.state.user.deptId)
      } else {
        return false
      }
    },
    /**
     * 导出
     */
    exportHandle() {
      enExpertExport(this.queryParams).then(res => {
        fileDownload(res, '专家信息.xlsx')
      })
    }
  }
};
</script>
