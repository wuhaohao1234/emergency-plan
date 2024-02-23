<!--应急文书-->
<template>
  <div id="emergencyDocuments">
    <div class="top-content">
      <div :class="editableTabs.length?'top-button1':'top-button2'">
        <el-button
          size="small"
          icon="el-icon-plus"
          @click="selectTemplateHandle(editableTabsValue)">
          选择模板
        </el-button>
        <el-button
          v-if='editableTabs.length'
          style="margin-right: 10px"
          size="small"
          type="primary"
          icon="el-icon-check"
          @click="saveTemplateHandle()">
          保存文书
        </el-button>
        <el-popover
          v-if='editableTabs.length'
          placement="top-start"
          width="380"
          trigger="hover">
          <span><i class="el-icon-warning" style="color: #ee940d"></i>&nbsp;请检查文书内容完善情况，确定无误后点击导出。</span>
          <el-button
            slot="reference"
            size="small"
            type="success"
            icon="el-icon-download"
            @click="exportHandle()">
            导出文书
          </el-button>
        </el-popover>


      </div>
      <el-tabs v-model="editableTabsValue" tab-position="left" @tab-click="handleClick" closable
               @tab-remove="removeTab">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :templateId="item.templateId"
          :documentId="item.documentId"
          :referenceId="item.referenceId"
        >
          <!--          根据模板编号控制显示模板-->
          <document-one :ref="item.name" v-if="item.name==='WSMB01'" :contentData="templateContentData"
                        @saveTemp="getTemplateData"></document-one>
        </el-tab-pane>
      </el-tabs>

    </div>
    <select-document-template ref="selectDocumentTemplate" v-if="selectVisible"
                              @goBack="closeSelectHandle"></select-document-template>
  </div>
</template>

<script>
import DocumentOne from "../../../planStructural/documentTemplate/documentOne";
import SelectDocumentTemplate from "../../../planStructural/documentTemplate/selectDocumentTemplate";
import {generationTemplate, saveOrUpdateDocument, getPlanDocument, deleteDocumentById} from '@/api/plans/structural'
import fileDownload from "js-file-download";
import {parseTime} from "../../../../../utils/ruoyi";

export default {
  name: "emergencyDocuments",
  props: {
    planInfo: {
      type: Object,
      default: undefined
    }
  },
  components: {SelectDocumentTemplate, DocumentOne},
  data() {
    return {
      editableTabsValue: '2',
      editableTabs: [],
      tabIndex: 0,
      selectVisible: false,
      templateCode: '',
      templateContentData: [],
      templateName: '',
      templateId: '',
      documentId: '',
      referenceId: ''
    }
  },
  created() {
    this.getDocuments()
  },
  methods: {
    selectTemplateHandle(targetName) {
      this.selectVisible = true;
      this.$nextTick(() => {
        this.$refs.selectDocumentTemplate.init(this.editableTabs)
      })

    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
            if (tab.documentId) {
              //删除文书
              deleteDocumentById(tab.documentId).then(res => {
              })
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    //关闭
    closeSelectHandle(data) {
      this.selectVisible = false;
      if (data) {
        this.editableTabs = []
        data.forEach(item => {
          this.editableTabs.push({
            title: item.documentName,
            name: item.templateCode,
            templateId: item.id,
            documentId: item.documentId,
            templateContentData: item.templateContentData,
            referenceId: item.referenceId
          });
          this.editableTabsValue = item.templateCode;
          this.templateCode = item.templateCode
          this.templateName = item.documentName
          this.templateId = item.id
          this.templateContentData = item.templateContentData ? item.templateContentData : []
          this.documentId = item.documentId
          this.referenceId = item.referenceId
        })
      }
    },

    /**
     * 保存
     */
    async saveTemplateHandle() {
      await this.triggerSubelement()
      let data = {
        planId: this.planInfo.planId,
        templateId: this.templateId,
        templateContent: JSON.stringify(this.templateContentData),
        status: 1,//保存为草稿
        id: this.documentId
      }
      saveOrUpdateDocument(data).then(res => {
        if (res.code == 200) {
          this.$message.success('保存成功')
          for (let i = 0; i < this.editableTabs.length; i++) {
            if (this.editableTabs[i].templateId === this.templateId) {
              this.editableTabs[i].documentId = res.data
              this.documentId = res.data
              return
            }
          }
        }
      })
    },
    /**
     * 触发子组件方法
     */
    async triggerSubelement() {
      await this.$nextTick(() => {
        switch (this.templateCode) {
          case 'WSMB01'://根据模板编号获取对应数据
            this.$refs.WSMB01[this.tabIndex].saveHandle();
            break;
        }
      })
    },

    /**
     * tab切换
     */
    handleClick(tab, event) {
      this.tabIndex = tab.index
      this.templateCode = tab.name
      this.templateName = tab.title
      this.templateId = tab.$attrs.templateId
      this.documentId=tab.$attrs.documentId
      this.referenceId=tab.$attrs.referenceId
    },

    /**
     * 获取模板填充内容
     * @param data
     */
    getTemplateData(data) {
      this.templateContentData = data
    },
    /**
     * 导出文书
     */
    async exportHandle() {
      await this.triggerSubelement()
      //导出文书
      let data = {templateCode: this.templateCode, dataList: this.templateContentData}
      generationTemplate(data).then(res => {
        fileDownload(res, this.templateName + '_' + this.planInfo.planName + '_' + parseTime(new Date(), '{y}-{m}-{d}') + '.docx')
      })
      //保存文书内容
      let document = {
        planId: this.planInfo.planId,
        templateId: this.templateId,
        templateContent: JSON.stringify(this.templateContentData),
        status: 2,//保存为正式版本
        id: this.documentId,
        referenceId:this.referenceId
      }
      saveOrUpdateDocument(document).then(res => {
        if (res.code == 200) {
          for (let i = 0; i < this.editableTabs.length; i++) {
            if (this.editableTabs[i].templateId === this.templateId) {
              this.editableTabs[i].documentId = res.data
              this.documentId = res.data
              return
            }
          }
        }
      })
    },
    /**
     * 获取当前预案应急文书
     */
    getDocuments() {
      getPlanDocument(this.planInfo.planId).then(res => {
        if (res.code == 200 && res.data.length) {
          res.data.forEach(item => {
            this.editableTabs.push({
              title: item.templateInfo.documentName,
              name: item.templateInfo.templateCode,
              templateId: item.templateInfo.id,
              documentId: item.id,
              templateContentData: JSON.parse(item.templateContent)
            });
          })
          this.editableTabsValue = res.data[0].templateInfo.templateCode
          this.templateCode = res.data[0].templateInfo.templateCode
          this.templateName = res.data[0].templateInfo.documentName
          this.templateId = res.data[0].templateInfo.id
          this.templateContentData = JSON.parse(res.data[0].templateContent)
          this.documentId = res.data[0].id
        }
      })
    }

  }
}
</script>

<style lang="scss">
#emergencyDocuments {
  width: 100%;
  height: 100%;

  .top-content {
    position: relative;

    .top-button1 {
      position: absolute;
      right: 1px;
      z-index: 2;
    }

    .top-button2 {
      float: right;
    }

  }

  .el-tabs__item {
    padding: 0 20px 0 0;
  }

}
</style>
