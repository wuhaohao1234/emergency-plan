<template>
  <div id="structuralSetting">
    <el-page-header @back="goBack" content="模板" style="margin-bottom: 20px"></el-page-header>
      <el-form :model="form" ref="queryForm" label-width="80px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板名称" prop="templateName">
              <el-input
                v-model="form.templateName"
                placeholder="请输入模板名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板使用用户" prop="userFullPath" label-width="140px">
              <el-select v-model="form.userFullPath" placeholder="请选择模板使用用户" clearable style="width: 100%">
                <el-option
                  v-for="dict in dict.type[598]"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" style="float: right;">
          <el-button
            type="primary"
            size="mini"
            @click="handleSave">
            保存</el-button>
        </el-col>
        <el-col :span="1.5" style="float: right;">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            v-if="isTemplateId"
            @click="handleAdd">
            新增章节</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:5px;width: 100%;height: 2px;background: #c9c9c9;"></el-row>
      <el-form :model="chapterFirstForm" style="margin-top: 10px">
        <el-table ref="chapterFirstForm" :data="chapterFirstForm.chapterFirstList">
          <!-- 内层嵌套表格 -->
          <el-table-column type="expand">
            <template #default="scopeSecond">
              <el-table
                :data="scopeSecond.row.children || []"
                :show-header="false"
                ref="chapterSecondForm">
                <!-- 最内层嵌套表格 -->
                <el-table-column type="expand">
                  <template #default="scopeThird">
                    <el-table
                      :data="scopeThird.row.children || []"
                      :show-header="false"
                      ref="chapterThirdForm"
                      :row-key="row => row.chapterId">
                      <el-table-column label="章节名称" prop="chapterName" align="right" width="300">
                        <template slot-scope="scopeThirdDoble">
                          <el-input
                            v-model="scopeThirdDoble.row.chapterName"
                            v-if="scopeThirdDoble.row.editable"
                          ></el-input>
                          <span v-else>{{ scopeThirdDoble.row.chapterName }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="填写提示" prop="tips" align="left">
                        <template slot-scope="scopeThirdDoble">
                          <el-input v-model="scopeThirdDoble.row.tips" v-if="scopeThirdDoble.row.editable"></el-input>
                          <el-tooltip
                            :content="scopeThirdDoble.row.tips"
                            class="tooltip-content"
                            effect="light"
                            placement="top"
                            v-else
                          >
                            <span class="single-line-ellipsis">{{scopeThirdDoble.row.tips}}</span>
                          </el-tooltip>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="center" width="300">
                        <template #default="scopeThirdDoble">
                          <span v-if="scopeThirdDoble.row.editable">
                            <el-button @click="submitChapterItem(scopeThirdDoble.row)" type="text" icon="el-icon-check">保存</el-button>
                            <el-button @click="cancelThirdHandle(scopeThirdDoble.row)" type="text" style="color: red" icon="el-icon-close">取消</el-button>
                          </span>
                          <span v-else>
                              <el-button @click="handelEditChapter(scopeThirdDoble.row)" type="text" icon="el-icon-edit">修改</el-button>
                              <el-button @click="handelDelChapter(scopeThirdDoble.row)" type="text" style="color: red" icon="el-icon-delete">删除</el-button>
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="章节名称" prop="chapterName" align="center" width="300">
                  <template slot-scope="scopeSecondDoble">
                    <el-input
                      v-model="scopeSecondDoble.row.chapterName"
                      v-if="scopeSecondDoble.row.editable"
                    ></el-input>
                    <span v-else>{{ scopeSecondDoble.row.chapterName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="填写提示" prop="tips" align="left">
                  <template slot-scope="scopeSecondDoble">
                    <el-input v-model="scopeSecondDoble.row.tips" v-if="scopeSecondDoble.row.editable"></el-input>
                    <el-tooltip
                      :content="scopeSecondDoble.row.tips"
                      class="tooltip-content"
                      effect="light"
                      placement="top"
                      v-else
                    >
                      <span class="single-line-ellipsis">{{scopeSecondDoble.row.tips}}</span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="300">
                  <template #default="scopeSecondDoble">
                    <span v-if="scopeSecondDoble.row.editable">
                      <el-button @click="submitChapterItem(scopeSecondDoble.row)" type="text" icon="el-icon-check">保存</el-button>
                      <el-button @click="cancelSecondHandle(scopeSecondDoble.row)" type="text" style="color: red" icon="el-icon-close">取消</el-button>
                    </span>
                    <span v-else>
                      <el-button @click="handelEditChapter(scopeSecondDoble.row)" type="text" icon="el-icon-edit">修改</el-button>
                      <el-button @click="handelAddSecond(scopeSecondDoble.row)" type="text" icon="el-icon-plus">新增</el-button>
                      <el-button @click="handelDelChapter(scopeSecondDoble.row)" type="text" style="color: red" icon="el-icon-delete">删除</el-button>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="章节名称" prop="chapterName" align="left" width="300">
            <template slot-scope="scope">
              <el-input v-model="scope.row.chapterName" v-if="scope.row.editable"></el-input>
              <span v-else>{{scope.row.chapterName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="填写提示" prop="tips" align="left">
            <template slot-scope="scope">
              <el-input v-model="scope.row.tips" v-if="scope.row.editable"></el-input>
              <el-tooltip
                :content="scope.row.tips"
                class="tooltip-content"
                placement="top-start"
                effect="light"
                v-else
                >
                <span class="single-line-ellipsis">{{scope.row.tips}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template #default="scopeFirst">
              <span v-if="scopeFirst.row.editable">
                <el-button @click="submitChapterItem(scopeFirst.row)" type="text" icon="el-icon-check">保存</el-button>
                <el-button @click="cancelHandle(scopeFirst.row)" type="text" style="color: red" icon="el-icon-close">取消</el-button>
              </span>
              <span v-else>
                <el-button @click="handelEditChapter(scopeFirst.row)" type="text" icon="el-icon-edit">修改</el-button>
                <el-button @click="handelAddFirst(scopeFirst.row)" type="text" icon="el-icon-plus">新增</el-button>
                <el-button @click="handelDelChapter(scopeFirst.row)" type="text" style="color: red" icon="el-icon-delete">删除</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
  </div>
</template>
<script>

import {
  delStructuralChapter,
  getTemplateDetail,
  saveChapter,
  saveStructrual
} from "@/api/plans/structural";

export default {
  dicts: ['598'],
  data() {
    return {
      data: {},
      form:{},
    //   判断是否有模板id
      isTemplateId: false,
      // 加载
      loading: false,
      // 章节
      chapterList: [],
      expandedRows: [],  // 用于存储展开的行的数据或标识
      // 第一级目录表单
      chapterFirstForm:{
        //   第一级目录
        chapterFirstList:[

        ]
      },
      // 表单校验
      rules: {
        templateName: [
          { required: true, message: "模板名称不能为空", trigger: "blur" }
        ],
        userFullPath: [
          { required: true, message: "用户字典不能为空", trigger: "change" }
        ]
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    init(data) {
      if(data){
        this.isTemplateId = true;
        this.data = data;
        this.form = data;
        this.form.userFullPath = +data.userFullPath;
        this.chapterFirstForm.chapterFirstList = data.chapterList;
      }
    },
    // 模板保存
    handleSave() {
      this.$refs["queryForm"].validate(valid=>{
        if(valid) {
          saveStructrual(this.form).then(res => {
            if (res.code===200){
              this.$message.success('保存成功')
              this.form.templateId = res.data;
              this.isTemplateId = true;
            }
          });
        }
      })
    },
    // 添加顶部节点
    handleAdd() {
      const newRow = {
        chapterId: null,
        chapterName: '',
        tips: '',
        editable: true,
        parentId: null,
        children: [],
      };
      this.chapterFirstForm.chapterFirstList.push(newRow);
    },
    // 保存标题
    submitChapterItem(row) {
      row.templateId = this.form.templateId;
      saveChapter(row).then(res => {
        if(res.code===200){
          this.$message.success('保存成功');
          row.chapterId = res.data;
          row.editable = false;
        }
      });
    },
    // 取消一级标题的保存
    cancelHandle(row) {
      if (!row.chapterId) {
        const index = this.chapterFirstForm.chapterFirstList.indexOf(row);
        this.chapterFirstForm.chapterFirstList.splice(index, 1);
      }else {
        this.getOriginalData();
      }
      row.editable = false;
    },
    // 取消二级标题的保存
    cancelSecondHandle(row) {
      if (!row.chapterId) {
        const parentRow = this.chapterFirstForm.chapterFirstList.find(
          (item) => item.children && item.children.includes(row)
        );
        if (parentRow) {
          const index = parentRow.children.indexOf(row);
          parentRow.children.splice(index, 1);
        }
      }else {
        this.getOriginalData();
      }
      row.editable = false;
    },
    // 取消三级标题的保存
    cancelThirdHandle(row) {
      if (!row.chapterId) {
        let parentRow = {};
        this.chapterFirstForm.chapterFirstList.forEach(item=>{
          if(item.children) {
            parentRow = item.children.find(
              (para) => para.children && para.children.includes(row)
            );
            if (parentRow) {
              const index = parentRow.children.indexOf(row);
              parentRow.children.splice(index, 1);
            }
          }
        })
      } else {
        this.getOriginalData();
      }
      row.editable = false;
    },
    getOriginalData() {
      getTemplateDetail(this.form.templateId).then(res => {
        this.chapterFirstForm.chapterFirstList = res.data.chapterList;
      })
    },
  //   修改标题
    handelEditChapter(row) {
      this.$set(row, 'editable', true);
    },
  //   新增二级标题
    handelAddFirst(row) {
      const newChapter = {
        chapterId: null,
        chapterName: '',
        tips: '',
        editable: true,
        parentId: row.chapterId,
        children: [],
      };
      if(!row.children){
        this.$set(row, 'children', []);
      }
      row.children.push(newChapter);
      this.$nextTick(() => {
        // 获取折叠行对应的内嵌表格实例
        const nestedTable = this.$refs[`chapterSecondForm`];
        // 展开折叠行
        nestedTable.toggleRowExpansion(row);
        // 设置新增行为当前行
        nestedTable.setCurrentRow(newChapter);
      });
    },
    //   新增三级标题
    handelAddSecond(row) {
      const newChapter = {
        chapterId: null,
        chapterName: '',
        tips: '',
        editable: true,
        parentId: row.chapterId,
      };
      if(!row.children){
        this.$set(row, 'children', []);
      }
      row.children.push(newChapter);
      this.$nextTick(() => {
        // 获取折叠行对应的内嵌表格实例
        const nestedTable = this.$refs[`chapterThirdForm`];
        // 展开折叠行
        nestedTable.toggleRowExpansion(row);
        // 设置新增行为当前行
        nestedTable.setCurrentRow(newChapter);
      });
    },
  //   删除标题
    handelDelChapter(row) {
      if(row.children){
        this.$message.warning('包含子章节，请先将其移除');
      }else {
        this.$modal.confirm('是否确认删章节名称为"' + row.chapterName + '"的数据项？').then(()=>{
          delStructuralChapter(row.chapterId).then(res => {
            if(res.code===200){
              this.$message.success('删除章节成功');
              this.getOriginalData();
            }
          });
        })
      }
    },
  },
}
</script>
<style scoped lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.dictDataFormCss{
  margin-top:0.5%;
  margin-bottom:-18px;
}
.DataSubmitBtn{
  margin-top:6px;
  margin-left: 10%;
}
.tooltip-content {
  width: 200px;

}
.single-line-ellipsis {
  white-space: nowrap;       /* 不换行 */
  overflow: hidden;          /* 隐藏溢出部分 */
  text-overflow: ellipsis;   /* 使用省略号显示溢出部分 */
  max-width: 100%;           /* 最大宽度为父元素宽度 */
}
</style>
