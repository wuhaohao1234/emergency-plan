<!--备案审核意见提交-->
<template>
  <div id="audit">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row :guter="24">
        <el-col :span="12">
          <div style="margin-left: 20px;font-size: 14px;line-height: 40px">
            <div v-for="(item,index) in dataList" :key="index">
              <el-checkbox v-model="item.isConform" style="margin-right: 10px"></el-checkbox>
              <span>{{ item.name }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <el-col :span="24">
            <el-form-item label="备案结论" prop="auditStatus">
              <el-radio-group v-model="form.auditStatus">
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="0">退回</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.auditStatus===0">
            <el-form-item label="退回意见" prop="reason">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入退回意见"
                v-model="form.reason">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div style="float: right;margin-bottom: 20px">
              <el-button type="primary" size="mini" @click="auditHandle"
                         :disabled="!(form.auditStatus===0||(form.sealedRecordForm&&form.sealedRecordForm.length>0))">备案意见提交</el-button>
            </div>
          </el-col>
          <el-col :span="24" v-if="form.auditStatus===1">
<!--            抄送部门-->
            <el-form-item label="抄送部门" prop="sendDeptId">
              <treeselect no-results-text="无部门数据"
                          v-model="form.sendDeptId"
                          :options="deptOptions"
                          :normalizer="normalizer"
                          :show-count="true"
                          placeholder="选择抄部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.auditStatus===1">
            <el-alert
              title="请优先下载备案登记表，盖章后上传备案登记表"
              show-icon
              :closable="false"
              type="warning">
            </el-alert>
          </el-col>
          <el-col :span="24" style="margin: 10px 0 0 30px" v-if="form.auditStatus===1">
            <el-button type="text" @click="downloadRecordRegisterHandle">①&nbsp;备案登记表下载&emsp;&emsp;
              <i class="el-icon-download" style="font-size: 17px"></i>
            </el-button>
            <div >
              <file-upload :fileType="['doc','docx','pdf','png','jpeg','jpg']" :isShowTip="false" :buttonType="'svg'"
                           :limit="1" :buttonText="'②\xa0盖章后登记表上传'" :value="form.sealedRecordForm"
                           @input="getFileData"></file-upload>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {auditReturned, auditReviewed,enAuditReturned,enAuditReviewed,downloadRecordRegister} from '@/api/plans/planRecord'
import Treeselect from "@riophae/vue-treeselect";
import {listDeptTree} from "@/api/system/dept";
export default {
  name: "audit",
  components: {Treeselect},
  props:{
    recordId:{
      type:Number,
      default:null
    }   ,
    planInfo:{
      type:Object,
      default:null
    },
    deptOptions:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      form: {
        auditStatus:1,
        reason:'',
        sendDeptId: null,
        sealedRecordForm:[]
      },
      rules: {
        auditStatus: [
          {required: true, message: "审核结论不能为空", trigger: "blur"}
        ],
        reason: [
          {required: true, message: "退回原因不能为空", trigger: "blur"}
        ],
      },
      deptData: [],
      dataList: [
        {isConform: true, name: '应急预案文本（含电子文本）'},
        {isConform: true, name: '风险评估报告'},
        {isConform: true, name: '应急资源调查报告'},
        {isConform: true, name: '应急预案征求意见和采纳意见情况说明、分歧意见的处理依据和结果'},
        {isConform: true, name: '专家评审或论证意见'},
        {isConform: true, name: '需要说明的其他事项'},
      ],
      businessType:1,
    }
  },
  watch: {
    'form.auditStatus'(newVal) {
      this.dataList.forEach((item, index) => {
        item.isConform = newVal !== 0
      })
    }
  },
  init() {
    this.getDeptData();
  },
  methods: {
    /** 查询部门信息 */
    getDeptData() {
      listDeptTree().then(response => {
        this.deptData = response.data;
      });
    },
    getFileData(data) {
      this.$set(this.form,'sealedRecordForm',data)
    },
    goBack(){
      this.$emit('goBack')
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
    //审核
    auditHandle() {
      this.businessType=sessionStorage.getItem('BUSINESS_TYPE');
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.recordId = this.recordId
          this.form.agentName=this.$store.state.user.name
          this.form.agentPhone=this.$store.state.user.phone
          this.form.sealedRecordFormFileInfo = this.form.sealedRecordForm ? JSON.stringify(this.form.sealedRecordForm) : ''
          // this.form.auditItems = JSON.stringify(this.dataList)
          if (this.form.auditStatus === 1) {
            //审核通过
            (this.businessType==1?auditReviewed:enAuditReviewed)(this.form).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess('审核成功！')
              }
            }).finally(()=>{
              this.goBack()
            })
          } else {
            //退回
            (this.businessType==1?auditReturned:enAuditReturned)(this.form).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess('审核成功！')
              }
            }).finally(()=>{
              this.goBack()
            })
          }
        }
      })
    },
    /**
     * 应急预案备案登记表下载
     */
    downloadRecordRegisterHandle(){
        let data = {
          planName:this.planInfo.planName,
          preparationDeptName:this.planInfo.preparationDeptName,
          contactName: this.$store.state.user.name,
          contactPhone: this.$store.state.user.phone,
          reportingDeptName: this.$store.state.user.deptName,
        }
      downloadRecordRegister(data).then(res=>{
          let fileType = 'application/msword'
          // 转换为 Blob 对象
          const blob = new Blob([res], {type: fileType});
          // 创建临时下载链接
          const downloadUrl = URL.createObjectURL(blob);
          // 创建 <a> 标签
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = '应急预案备案登记表.docx'; // 设置新的文件名及扩展名
          // 手动触发下载
          link.click();
          // 清理临时下载链接
          URL.revokeObjectURL(downloadUrl);
        })
    },
  }
}
</script>

<style scoped>

</style>
