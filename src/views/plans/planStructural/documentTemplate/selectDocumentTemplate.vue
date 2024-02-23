<template>
  <div id="selectDocumentTemplate">
    <el-dialog
      :close-on-click-modal="false"
      title="提示"
      :visible.sync="visible"
      width="70%"
      hight="50%"
    >
      <el-alert
        title="左侧表格内容为可选择（勾选）的文书模板，右侧表格内容为当前选中文书模板对应的历史文书内容"
        type="info"
        show-icon>
      </el-alert>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="10">
          <div class="left-card">
            <el-card class="box-card" shadow="never">
              <el-table
                height="500px"
                :highlight-current-row="true"
                ref="multipleTable"
                row-key="id"
                :data="templateList"
                tooltip-effect="dark"
                style="width: 100%"
                @cell-click="cellClickHandle"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="文书模板"
                  min-width="120">
                  <template slot-scope="scope">{{ scope.row.documentName }}
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="right-card">
            <el-card class="box-card" shadow="never">
              <el-table
                height="500px"
                ref="rightTable"
                row-key="name"
                :data="contentList"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionContent">
                <el-table-column
                  :selectable="handleSelectable"
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  :label="tableLabel"
                  min-width="120">
                  <template slot-scope="scope">{{ scope.row.name }}
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="goBack">取 消</el-button>
    <el-button type="primary" @click="confirmHandle" :disabled="templateSelection<1">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
import {queryTemplate, getFormalTemplate, deleteDocumentById} from '@/api/plans/structural'

export default {
  name: "selectDocumentTemplate",
  data() {
    return {
      templateList: [],
      visible: true,
      template: 1,
      tableLabel: '文书内容',
      contentList: [],
      templateSelection: [],
      contentSelection: [],
      templateId: '',
      lastSelectionData: [],
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.lastSelectionData = data
      this.getDocumentTemplate(data)
    },
    /**
     * 获取左侧表格勾选内容
     */
    handleSelectionChange(val) {
      this.templateSelection = val;
    },
    /**
     * 获取右侧表格勾选内容
     */
    handleSelectionContent(val) {
      this.contentSelection = val
      this.contentList.forEach(item => {
        if (val[val.length - 1] === item) {
          this.$refs.rightTable.toggleRowSelection(item, true)
        } else {
          this.$refs.rightTable.toggleRowSelection(item, false)
        }
      })
      if (this.contentSelection.length) {
        this.templateList.forEach(item => {
          if (item.id == this.templateId) {
            let rID = Number(item.referenceId)
            item.referenceId = this.contentSelection[this.contentSelection.length - 1].id
            if (rID != this.contentSelection[this.contentSelection.length - 1].id) {
              item.templateContentData = JSON.parse(this.contentSelection[this.contentSelection.length - 1].templateContent)
            }
          }
        })
        this.templateSelection.forEach(item => {
          if (item.id == this.templateId) {
            let rID = Number(item.referenceId)
            item.referenceId = this.contentSelection[this.contentSelection.length - 1].id
            if (rID != this.contentSelection[this.contentSelection.length - 1].id) {
              item.templateContentData = JSON.parse(this.contentSelection[this.contentSelection.length - 1].templateContent)
            }
          }
        })
      }
    },
    /**
     * 取消返回
     */
    goBack() {
      this.$emit('goBack')
    },
    /**
     * 点击模板右侧表格显示模板名称
     */
    cellClickHandle(row, column, cell, event) {
      this.tableLabel = row.documentName
      this.templateId = row.id
      this.getContentList(row.id, row)
    },
    /**
     * 第一条模板高亮显示
     * @param row
     */
    triggerFirstRowClick(row) {
      this.$refs.multipleTable.setCurrentRow(row);
    },
    /**
     * 查询可选的文书模板
     * @param data
     * @returns {Promise<void>}
     */
    async getDocumentTemplate(data) {
      this.$refs.multipleTable.clearSelection();
      this.templateList = []
      let tempIds = []
      await queryTemplate().then(res => {
        if (res.data.length) {
          this.templateList = res.data
          if (data && data.length) {
            data.forEach(item => {
              tempIds.push(item.templateId)
              this.templateList.forEach(temp => {
                if (item.templateId === temp.id) {
                  temp.templateContentData = item.templateContentData
                  temp.referenceId = item.referenceId
                  temp.documentId = item.documentId
                }
              })
            })
          }
        }
      })
      if (this.templateList.length > 0) {
        this.triggerFirstRowClick(this.templateList[0])
        this.tableLabel = this.templateList[0].documentName
        this.templateId = this.templateList[0].id
        await this.getContentList(this.templateList[0].id, this.templateList[0])
        this.templateList.forEach(item => {
          if (tempIds.includes(item.id)) {
            this.$refs.multipleTable.toggleRowSelection(item);
          }
        })
      }
    },
    /**
     * 确定
     */
    confirmHandle() {
      let tIds = this.templateSelection.map(item => item.id)
      //未勾选文书默认删除
      this.lastSelectionData.forEach(item => {
        if (!tIds.includes(item.templateId)) {
          if (item.documentId) {
            deleteDocumentById(item.documentId).then(res => {

            })
          }
        }
      })
      this.$emit('goBack', this.templateSelection)
    },
    /**
     * 只有一条内容时不可取消勾选
     */
    handleSelectable(row, index) {
      let data = this.contentSelection[0]
      if (data && this.contentSelection.length <= 1 && row.id == data.id) {
        return false
      } else {
        return true
      }
    },
    /**
     *获取历史应急文书
     */
    async getContentList(tempId, temp) {
      let data = {templateId: tempId, id: temp.documentId}
      await getFormalTemplate(data).then(res => {
        this.contentList = [{id: 0, name: '初始模板（默认）', templateContent: '[]'}]
        if (res.code == 200 && res.data.length) {
          res.data.forEach(item => {
            this.contentList.push({
              id: item.id,
              name: item.createTime,
              templateContent: item.templateContent,
              isReference:item.isReference,
            })
          })
        }
      })
      if(temp.referenceId||temp.referenceId==0){
        //回显上次勾选的参考文书
        this.$refs.rightTable.toggleRowSelection(this.contentList.find(item => item.id == temp.referenceId));
      }else {
        let reference = this.contentList.find(item => item.isReference==1)
        if (reference) {
          //回显上次勾选的参考文书
          this.$refs.rightTable.toggleRowSelection(reference);
        } else {
          //默认勾选第一条
          this.$refs.rightTable.toggleRowSelection(this.contentList[0]);
        }
      }
    }
  }
}
</script>

<style lang="scss">
#selectDocumentTemplate {
  .left-card {
    .el-table__body tr.current-row > td.el-table__cell {
      background-color: #e8f4ff;
      color: #219dec;
    }
  }

  .right-card {
    .el-table__header-wrapper {
      .el-checkbox__inner {
        display: none !important;
      }
    }

    .el-checkbox__inner {
      border-radius: 8px;
      width: 17px;
      height: 17px;
    }

    .el-checkbox__inner::after {
      left: 6px;
      top: 2px;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #139a10;
      border-color: #139a10;
    }
  }

  .el-card__body {
    padding: 0;
  }
}
</style>
