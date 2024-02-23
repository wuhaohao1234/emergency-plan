<!--定制应急文书模板-->
<template>
  <div class="app-container">
    <div v-if="!customVisible">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="80px">
        <el-form-item label="文书名称" prop="documentName">
          <el-input
            v-model="queryParams.documentName"
            placeholder="请输入文书模板名称"
          />
        </el-form-item>
        <el-form-item label="文书分类" prop="type">
          <el-cascader
            collapse-tags
            v-model="queryParams.typeList"
            style="width: 300px;"
            :options="options"
            :props="props"
            placeholder="请选择文书分类"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
<!--      <el-row :gutter="10" class="mb8">-->
<!--        <el-col :span="1.5">-->
<!--          <el-button-->
<!--            type="primary"-->
<!--            icon="el-icon-plus"-->
<!--            size="mini"-->
<!--            @click="handleAdd"-->
<!--          >文书模板-->
<!--          </el-button>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <!--    列表-->
      <div class="list-container">
        <el-table :data="dataList" highlight-current-row v-loading="loading" style="width: 100%;">
          <el-table-column label="文书名称" min-width="200" align="left" :show-overflow-tooltip="true" prop="documentName"/>
<!--          <el-table-column label="文书分类" min-width="180" align="left" :show-overflow-tooltip="true" prop="templateName">-->
<!--            <template slot-scope="scope">-->
<!--              <el-tag style="margin-right: 10px" v-for="(item,index) in buildTypeLabel(scope.row.type)" :key="index">-->
<!--                <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>-->
<!--                /-->
<!--                <dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])" :value="item[1]"/>-->
<!--              </el-tag>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="创建部门" width="180" :show-overflow-tooltip="true" prop="crateDeptName">
          </el-table-column>
          <el-table-column label="创建人" width="180" :show-overflow-tooltip="true" prop="crateDeptName">
            <template slot-scope="scope">
              {{ scope.row.crateUserName+"-"+scope.row.crateUserPhone }}
            </template>
          </el-table-column>

          <el-table-column label="创建时间" width="200" header-align="center" align="center" :show-overflow-tooltip="true"
                           prop="createTime"/>
          <el-table-column label="启用状态" width="100" header-align="center" align="center" :show-overflow-tooltip="true"
                           prop="status">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==0" type="danger">禁用</el-tag>
              <el-tag v-if="scope.row.status==1" type="success">启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="定制状态" width="100" header-align="center" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.templateFile" type="success">已定制</el-tag>
              <el-tag v-else type="info">未定制</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="180" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleDetail(scope.row.id)">详情</el-button>
              <el-button size="mini" type="text" style="color: red" @click="handleDelete(scope.row)">删除</el-button>
              <el-button size="mini" type="text" @click="handleCustom(scope.row)">定制</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.size"
          @pagination="handleQuery"/>
      </div>
      <el-dialog :title="title" :visible.sync="open" :close-on-click-modal="false" append-to-body width="70%">
        <el-form :model="form" ref="form" label-width="100px" :rules="rules">
          <el-row>
            <el-col :span="24">
              <el-form-item label="文书名称" prop="documentName" label-width="100px">
                <el-input
                  v-model="form.documentName"
                  placeholder="请输入文书名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="使用部门" prop="checkedKeys">
                <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
                <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
                <div style="overflow-y: auto;max-height: calc(100vh - 70vh)">
                  <el-tree
                    v-model="form.checkedKeys"
                    ref="dept"
                    class="tree-border"
                    :data="deptData"
                    :props="treeProps"
                    node-key="deptId"
                    show-checkbox
                    :check-strictly="true"
                    empty-text="加载中，请稍候"
                    @check-change="handleCheckChange">
                  </el-tree>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="文书分类" prop="typeList">
                <el-cascader
                  v-model="form.typeList"
                  style="width: 100%;"
                  :options="options"
                  :props="props"
                  placeholder="请选择文书分类"
                  clearable></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="文书文件" prop="fileData">
                <file-upload :value="form.fileData" :limit="1" :fileSize="5" :fileType="['doc', 'docx']"
                             @input="getFile"></file-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="footer" align="right" style="margin-top: 50px">
            <el-form-item>
              <el-button @click="()=>{this.open=false}">取消</el-button>
              <el-button type="primary" @click="saveHandle">确定</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-dialog>
      <el-dialog title="文书模板详情" :visible.sync="detailVisible" :close-on-click-modal="false" append-to-body width="70%">
        <el-descriptions class="margin-top" :column="2" border>
          <el-descriptions-item :span="2">
            <template slot="label">文书名称</template>
            {{ detailInfo.documentName }}
          </el-descriptions-item>
          <el-descriptions-item :span="2">
            <template slot="label">
              使用单位
            </template>
            <el-tag style="margin:0 5px 5px 0" type="primary" v-if="detailInfo.useDept"
                    v-for="(item,index) in detailInfo.useDeptName"
                    :key="index">{{item}}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :span="2">
            <template slot="label">
              文书分类
            </template>
            <el-tag style="margin:0 10px 10px 0" v-if="detailInfo.type"
                    v-for="(item,index) in buildTypeLabel(detailInfo.type)" :key="index">
              <dict-tag style="display: inline-block" :showType="2" :options="dict.type['4']" :value="item[0]"/>
              /
              <dict-tag style="display: inline-block" :showType="2" :options="getOptions(item[0])" :value="item[1]"/>
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">启用状态</template>
            <el-tag v-if="detailInfo.status==0" type="danger">禁用</el-tag>
            <el-tag v-if="detailInfo.status==1" type="success">启用</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              创建时间
            </template>
            {{ detailInfo.createTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              创建部门
            </template>
            {{ detailInfo.crateDeptName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              创建人
            </template>
            {{ detailInfo.crateUserName+"-"+detailInfo.crateUserPhone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              文书文件
            </template>
            <download-file v-if="detailInfo.sourceFile" v-for="item in detailInfo.sourceFile" :key="item.fileKey"
                           :fileName="item.fileName" :fileKey="item.fileKey"></download-file>
          </el-descriptions-item>
        </el-descriptions>
        <div class="footer" align="right" style="margin-top: 50px">
          <el-button @click="()=>{this.detailVisible=false}" type="primary">确定</el-button>
        </div>
      </el-dialog>
    </div>
    <upload-custom-template ref="uploadCustomTemplate" v-if="customVisible" @goBack="pageList"></upload-custom-template>
  </div>
</template>

<script>
import {documentPageList, saveOrUpdate, findById, deleteById, updateStatus} from '@/api/plans/structural'
import {listDeptTree, childrenDept} from "@/api/system/dept";
import {getDicts} from '@/api/system/dict/data'
import UploadCustomTemplate from "./uploadCustomTemplate";

export default {
  dicts: ['4', '26', '601', '608', '611', '622', '531','662'],
  components: {UploadCustomTemplate},
  data() {
    return {
      queryParams: {
        page: 1,
        size: 10,
        documentName: undefined,
        type: undefined
      },
      dataList: [],
      loading: false,
      total: 0,
      title: '添加文书模板',
      open: false,
      detailVisible: false,
      customVisible: false,
      form: {
        documentName: '',
        type: undefined,
        applyDeptType: [],
        deptType: [],
        fileData: [],
        typeList: [],
        checkedKeys:[]
      },
      deptData: [],
      rules: {
        documentName: [
          {required: true, message: "文书名称不能为空", trigger: "blur"}
        ],
        typeList: [
          {required: true, message: "文书类型不能为空", trigger: "blur"}
        ],
        fileData: [
          {required: true, message: "文书文件不能为空", trigger: "blur"}
        ],
        checkedKeys: [
          {required: true, message: "使用部门不能为空", trigger: "blur"}
        ],
      },
      options: [],
      props: {multiple: true},
      detailInfo: {
        type: '',
        applyDeptType: ''
      },
      treeProps: {
        label: 'deptName',
        children: 'children'
      },
      allKeys: [],
      deptExpand: false,
      deptNodeAll: false,
    }
  },
  created() {
    this.getChildrenDept()
    this.buildOptions()
    this.pageList()
  },
  methods: {
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
      let treeList = this.deptData;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.dept.store.nodesMap[treeList[i].deptId].expanded = value
      }
    },
    // 树权限（全选/全不选）
    async handleCheckedTreeNodeAll(value) {
      if (value) {
        await this.getAllKeys(this.deptData)
        this.$refs.dept.setCheckedKeys(this.allKeys, true)
      } else {
        this.$refs.dept.setCheckedKeys([], true)
      }

    },
    // 获取所有节点的key
    getAllKeys(deptData) {
      deptData.forEach(node => {
        this.allKeys.push(node.deptId)
        if (node.children) {
          this.getAllKeys(node.children)
        }
      });
    },
    pageList() {
      this.customVisible = false
      documentPageList(this.queryParams).then(res => {
        this.dataList = res.data.content;
        this.total = res.data.totalElements;
        this.loading = false;
      })
    },
    handleAdd() {
      this.deptExpand = false
      this.eptNodeAll = false
      this.title = '添加文书模板'
      this.open = true
      this.form = {}
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
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
    getFile(file) {
      this.form.fileData = file
    },

    /**
     *构建文件类别
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /**
     * 保存
     */
    saveHandle() {
      let str = ''
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.typeList.forEach(item => {
            str += item.join(',') + ';'
          })
          this.form.type = str
          this.form.sourceFile = JSON.stringify(this.form.fileData)
          this.form.useDept = this.form.checkedKeys.join(',')
          saveOrUpdate(this.form).then(res => {
            if (res.code === 200) {
              this.open = false
              this.$message.success('操作成功')
              this.pageList()
            }
          })
        }
      })
    },
    /**
     * 修改状态
     */
    updateStatusHandle(val, row) {
      this.$confirm(`是否确定${val == 1 ? '启用' : '禁用'}当前文书模板？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {id: row.id, status: val}
        updateStatus(data).then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
          }
        })
      }).finally(() => {
        this.pageList()
      });
    },
    /**
     * 获取文书详情
     */
    handleDetail(id) {
      findById(id).then(res => {
        if (res.code === 200) {
          this.detailInfo = res.data
          this.detailInfo.sourceFile = JSON.parse(res.data.sourceFile)
          this.detailVisible = true
        }
      })
    },
    /**
     * 修改文书信息
     */
    handleUpdate(id) {
      this.deptExpand = false
      this.eptNodeAll = false
      findById(id).then(res => {
        if (res.code === 200) {
          this.form = res.data
          this.$set(this.form,'checkedKeys',res.data.useDept?res.data.useDept.split(','):[])
          this.form.fileData = JSON.parse(res.data.sourceFile)
          let typeStr = res.data.type;
          let pType = typeStr.split(';');
          this.form.typeList = []
          pType.filter(Boolean).forEach(item => {
            let arr = item.split(',')
            this.form.typeList.push(arr.map(Number));
          })
          this.open = true
          this.title = '编辑文书模板'
          this.$nextTick(()=>{
            this.$refs.dept.setCheckedKeys(this.form.checkedKeys, true)
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为 "' + row.documentName + '" 的文书模板？').then(() => {
        deleteById(row.id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.pageList()
          }
        });
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
    /**
     * 定制
     */
    handleCustom(row) {
      this.customVisible = true
      this.$nextTick(() => {
        this.$refs.uploadCustomTemplate.init(row.id)
      })
    },
    /**
     * 勾选单位
     * @param data
     * @param checked
     * @param indeterminate
     */
    handleCheckChange(data, checked, indeterminate) {
      this.form.checkedKeys = this.$refs.dept.getCheckedKeys()
    },

    /**
     * 获取下级单位
     */
    getChildrenDept() {
      childrenDept(this.$store.state.user.deptId, 1).then(res => {
        if (res.code == 200) {
          this.deptData = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-descriptions-item__label.is-bordered-label {
  width: 100px;
}
</style>
