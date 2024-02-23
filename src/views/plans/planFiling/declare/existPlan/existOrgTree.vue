<!--组织结构-->
<template>
  <div id="orgTree">
    <vue2-org-tree
      :data="organizationData"
      :label-class-name="labelClassName"
      :collapsable="false"
      @on-expand="onExpand"
      :renderContent="renderContent"
    />
    <org-people ref="orgPeople" :deptData="deptData" v-if="peopleVisible"
                @cancel="(()=>{this.peopleVisible=false})" :handleType="handleType"
                @addOrgPeople="getPeople"></org-people>
    <el-dialog :close-on-click-modal="false"
               :title="operationType===1?'编辑机构':'添加机构'"
               :visible.sync="organizationVisible"
               width="70%"
               :before-close="handleClose">
      <el-form ref="organizeForm" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="机构名称" prop="orgName">
              <el-input v-model="form.orgName" placeholder="请输入机构名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="牵头单位" prop="leadingDept">
              <treeselect no-results-text="无部门数据"
                v-model="form.leadingDept"
                :options="deptData"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择牵头单位"
                ref="tagSelectRef"
                multiple
                :flat="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="值班电话" prop="dutyPhone">
              <el-input v-model="form.dutyPhone" placeholder="请输入值班电话" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="传真号码" prop="fax">
              <el-input v-model="form.fax" placeholder="请输入传真号码" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="deptResponsibilities" label="部门职责">
              <el-input type="textarea" rows="3" v-model="form.deptResponsibilities" placeholder="请输入部门职责" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="confirmHandle">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false"
               title="机构详情"
               :visible.sync="detailVisible"
               width="70%"
               :before-close="(()=>{this.detailVisible=false})">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="机构名称">
          <span>{{ orgInfo.orgName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="牵头单位">
          <span>{{ orgInfo.leadingUnitName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="值班电话"><span>{{ orgInfo.dutyPhone }}</span></el-descriptions-item>
        <el-descriptions-item label="传真号码">
          <span>{{ orgInfo.fax }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="部门职责">
          <span>{{ orgInfo.deptResponsibilities }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="detailVisible=false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import orgPeople from "./existOrgPeople";
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
  name: "orgTree",
  data() {
    const checkDept = ((rule, value, callback) => {
      if (value.length > 0) {
        callback()
      } else {
        callback(new Error('牵头单位不能为空'))
      }
    })
    return {
      operationType: 1,//1.修改 2.新增
      organizationVisible: false,
      detailVisible: false,
      labelClassName: "bg-color-orange",
      peopleVisible: false,
      organizationData: {
        "planOrgId": null,
        "temporaryId": new Date().getTime(),
        "orgName": "指挥中心",
        "parentId": null,
        "leadingUnit": null,
        "leadingUnitName": null,
        "dutyPhone": null,
        "fax": null,
        "deptResponsibilities": null,
        "children": null
      },
      // 表单校验
      rules: {
        orgName: [
          {required: true, message: "机构名称不能为空", trigger: "blur"}
        ],
        leadingDept: [
          {required: true, validator: checkDept, trigger: "change"}
        ],
        dutyPhone: [
          {required: true, message: "值班电话不能为空", trigger: "blur"}
        ],
        fax: [
          {required: true, message: "传真不能为空", trigger: "blur"}
        ],
        deptResponsibilities: [
          {required: true, message: "部门职责不能为空", trigger: "blur"}
        ],
      },
      // 表单参数
      form: {
        // 机构名称
        orgName: '',
        // 牵头单位
        leadingDept: [],
        // 值班电话
        dutyPhone: '',
        // 传真
        fax: '',
        // 部门职责
        deptResponsibilities: ''
      },
      orgInfo: {},//组织机构详情
    }
  },
  components: {
    orgPeople,
    Treeselect
  },
  methods: {
    //渲染节点
    renderContent(h, data) {
      return (
        <div>
          <span on-click={() => this.organizationInfo(data)}>{data.orgName}</span>
          <el-button type="text" on-click={() => this.addPeople(data)} style="margin-left:5px;">
            <i class="el-icon-user-solid"></i></el-button>
          <el-button type="text" on-click={() => this.appendChildren(data)}>
            <i class="el-icon-plus"></i></el-button>
          <el-button type="text" on-click={() => this.editOrganization(data)}>
            <i class="el-icon-edit"></i></el-button>
          <el-button type="text" on-click={() => this.delOrganization(data)}>
            <i class="el-icon-delete"></i></el-button>
        </div>
      );
    },
    //默认展开
    toggleExpand(data, val) {
      if (Array.isArray(data)) {
        data.forEach(item => {
          this.$set(item, "expand", val);
          if (item.children) {
            this.toggleExpand(item.children, val);
          }
        });
      } else {
        this.$set(data, "expand", val);
        if (data.children) {
          this.toggleExpand(data.children, val);
        }
      }
    },
    collapse(list) {
      list.forEach(child => {
        if (child.expand) {
          child.expand = false;
        }
        child.children && this.collapse(child.children);
      });
    },
    //展开
    onExpand(e, data) {
      if ("expand" in data) {
        data.expand = !data.expand;
        if (!data.expand && data.children) {
          this.collapse(data.children);
        }
      } else {
        this.$set(data, "expand", true);
      }
    },
    addPeople(data) {
      this.node = data
      this.peopleVisible = true
      this.$nextTick(() => {
        this.$refs.orgPeople.init(data)
      })
    },
    //添加子级机构
    appendChildren(data) {
      this.node = data
      this.organizationVisible = true
      this.operationType = 2
      this.$nextTick(() => {
        this.$refs['organizeForm'].resetFields()
        this.form.orgName = ''
        this.form.leadingDept = []
        this.form.dutyPhone = ''
        this.form.fax = ''
        this.form.deptResponsibilities = ''
        this.form.planOrgId = ''
        this.form.parentId = data.temporaryId
        this.form.temporaryId = new Date().getTime()
      })
    },
    //修改组织机构
    editOrganization(data) {
      this.node = data
      this.operationType = 1
      this.organizationVisible = true
      this.$nextTick(() => {
        this.form = {...data}
        let list = data.leadingUnit ? data.leadingUnit.split(',') : []
        list.forEach((item, index) => {
          list[index] = parseInt(list[index])
        })
        this.form.leadingDept = list
      })
    },
    //删除组织机构
    delOrganization(data, h) {
      if (!data.parentId) {
        this.$modal.msgWarning('当前组织机构不允许删除')
        return
      }
      this.getNode(this.organizationData.children, data)
    },
    //获取当前节点并删除
    getNode(children, data) {
      let i = -1
      children.forEach((item, index) => {
        if (item.temporaryId === data.temporaryId) {
          i = index;
          return
        }
        if (item.children && item.children.length) {
          this.getNode(item.children, data)
        }
      })
      if (i >= 0) {
        children.splice(i, 1)
      }
    },
    //取消编辑组织机构
    handleClose() {
      this.organizationVisible = false
    },
    //确定添加或修改组织
    confirmHandle() {
      this.$refs.organizeForm.validate(valid => {
        if (valid) {
          let depts = this.form.leadingDept.join(',')
          this.form.leadingUnit = depts;
          this.organizationVisible = false
          if (this.operationType === 1) {
            let {orgName, dutyPhone, fax, deptResponsibilities, leadingDept} = this.form
            this.node.orgName = orgName
            this.node.dutyPhone = dutyPhone
            this.node.fax = fax
            this.node.deptResponsibilities = deptResponsibilities
            this.node.leadingDept = leadingDept
            this.node.leadingUnit = depts
          } else {
            this.form.temporaryId = new Date().getTime()
            if (!this.node.children) {
              this.node.children = []
            }
            this.node.children.push(this.form)
          }
          this.organizationData = JSON.parse(JSON.stringify(this.organizationData))
        }
      })
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
    //机构详情
    organizationInfo(data) {
      this.detailVisible = true
      this.orgInfo = data
      if (data.leadingDept&&data.leadingDept.length) {
        let depts = this.treeToArr(this.deptData)
        let arr = depts.filter(item => data.leadingDept.includes(item.deptId))
        this.orgInfo.leadingUnitName =arr.map(item=>item.deptName).join("，")
      }
    },
    //获取组织人员信息
    getPeople(val) {
      this.node.peoples = val
    },
    //获取组织机构数据
    getOrgData() {
      this.$emit('getOrgData', this.organizationData)
    },
    treeToArr(data) {
      const result = [];
      data.forEach(item => {
        const loop = data => {
          result.push({
            deptId: data.deptId,
            deptName: data.deptName,
            parentId: data.parentId
          });
          let child = data.children
          if (child) {
            for (let i = 0; i < child.length; i++) {
              loop(child[i])
            }
          }
        }
        loop(item);
      })
      return result;
    }
  }

}
</script>

<style lang="scss">

#orgTree {
  .bg-color-orange {
    padding: 0 8px;
    line-height: 35px;
    border: 1px solid #1890ff;
    color: #1890ff;
    font-size: 13px;
  }

  .org-tree-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff
  }

  .org-tree {
    display: table;
    text-align: center
  }

  .org-tree:after,
  .org-tree:before {
    content: "";
    display: table
  }

  .org-tree:after {
    clear: both
  }

  .org-tree-node,
  .org-tree-node-children {
    position: relative;
    margin: 0;
    padding: 0;
    list-style-type: none
  }

  .org-tree-node-children:after,
  .org-tree-node-children:before,
  .org-tree-node:after,
  .org-tree-node:before {
    transition: all .35s
  }

  .org-tree-node-label {
    position: relative;
    display: inline-block
  }

  .org-tree-node-label .org-tree-node-label-inner {
    text-align: center;
    border-radius: 3px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .15)
  }

  .org-tree-node-btn {
    position: absolute;
    top: 100%;
    left: 50%;
    width: 20px;
    height: 20px;
    z-index: 10;
    margin-left: -11px;
    margin-top: 9px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    box-shadow: 0 0 2px rgba(0, 0, 0, .15);
    cursor: pointer;
    transition: all .35s ease
  }

  .org-tree-node-btn:hover {
    background-color: #e7e8e9;
    -webkit-transform: scale(1.15);
    transform: scale(1.15)
  }

  .org-tree-node-btn:after,
  .org-tree-node-btn:before {
    content: "";
    position: absolute
  }

  .org-tree-node-btn:before {
    top: 50%;
    left: 4px;
    right: 4px;
    height: 0;
    border-top: 1px solid #ccc
  }

  .org-tree-node-btn:after {
    top: 4px;
    left: 50%;
    bottom: 4px;
    width: 0;
    border-left: 1px solid #ccc
  }

  .org-tree-node-btn.expanded:after {
    border: none
  }

  .org-tree-node {
    padding-top: 20px;
    display: table-cell;
    vertical-align: top
  }

  .org-tree-node.collapsed,
  .org-tree-node.is-leaf {
    padding-left: 10px;
    padding-right: 10px
  }

  .org-tree-node:after,
  .org-tree-node:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 19px
  }

  .org-tree-node:after {
    left: 50%;
    border-left: 1px solid #ddd
  }

  .org-tree-node:not(:first-child):before,
  .org-tree-node:not(:last-child):after {
    border-top: 1px solid #ddd
  }

  .collapsable .org-tree-node.collapsed {
    padding-bottom: 30px
  }

  .collapsable .org-tree-node.collapsed .org-tree-node-label:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    width: 50%;
    height: 20px;
    border-right: 1px solid #ddd
  }

  .org-tree > .org-tree-node {
    padding-top: 0
  }

  .org-tree > .org-tree-node:after {
    border-left: 0
  }

  .org-tree-node-children {
    padding-top: 20px;
    display: table
  }

  .org-tree-node-children:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 20px;
    border-left: 1px solid #ddd
  }

  .org-tree-node-children:after {
    content: "";
    display: table;
    clear: both
  }

  .horizontal .org-tree-node {
    display: table-cell;
    float: none;
    padding-top: 0;
    padding-left: 20px
  }

  .horizontal .org-tree-node.collapsed,
  .horizontal .org-tree-node.is-leaf {
    padding-top: 10px;
    padding-bottom: 10px
  }

  .horizontal .org-tree-node:after,
  .horizontal .org-tree-node:before {
    width: 19px;
    height: 50%
  }

  .horizontal .org-tree-node:after {
    top: 50%;
    left: 0;
    border-left: 0
  }

  .horizontal .org-tree-node:only-child:before {
    top: 1px;
    border-bottom: 1px solid #ddd
  }

  .horizontal .org-tree-node:not(:first-child):before,
  .horizontal .org-tree-node:not(:last-child):after {
    border-top: 0;
    border-left: 1px solid #ddd
  }

  .horizontal .org-tree-node:not(:only-child):after {
    border-top: 1px solid #ddd
  }

  .horizontal .org-tree-node .org-tree-node-inner {
    display: table
  }

  .horizontal .org-tree-node-label {
    display: table-cell;
    vertical-align: middle
  }

  .horizontal.collapsable .org-tree-node.collapsed {
    padding-right: 30px
  }

  .horizontal.collapsable .org-tree-node.collapsed .org-tree-node-label:after {
    top: 0;
    left: 100%;
    width: 20px;
    height: 50%;
    border-right: 0;
    border-bottom: 1px solid #ddd
  }

  .horizontal .org-tree-node-btn {
    top: 50%;
    left: 100%;
    margin-top: -11px;
    margin-left: 9px
  }

  .horizontal > .org-tree-node:only-child:before {
    border-bottom: 0
  }

  .horizontal .org-tree-node-children {
    display: table-cell;
    padding-top: 0;
    padding-left: 20px
  }

  .horizontal .org-tree-node-children:before {
    top: 50%;
    left: 0;
    width: 20px;
    height: 0;
    border-left: 0;
    border-top: 1px solid #ddd
  }

  .horizontal .org-tree-node-children:after {
    display: none
  }

  .horizontal .org-tree-node-children > .org-tree-node {
    display: block
  }

}

</style>
