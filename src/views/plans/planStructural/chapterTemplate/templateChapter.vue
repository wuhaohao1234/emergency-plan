<template>
  <div id="templateChapter">
    <el-page-header @back="goBack" content="模板详情" style="margin-bottom: 20px"></el-page-header>
      <el-row>
        <el-col :span="12">
          模板名称：{{data.templateName}}
        </el-col>
        <el-col :span="12">
          <span>模板使用用户：<dict-tag style="display: inline-block" :options="dict.type['598']" :value="data.userFullPath"></dict-tag></span>
        </el-col>
      </el-row>
      <el-row style="margin-top:5px;margin-bottom:5px;height: 2px;background: #c9c9c9;"></el-row>
      <el-row>
        <h4>章节目录 <span style="color: #b7b9b7;margin-left: 300px">填写提示</span></h4>
        <el-tree
          :data="chapter"
          :props="defaultProps"
          :highlight-current="true"
        >
          <template v-slot="{ node, data }">
            <span>
                <span>{{ data.chapterName }}</span>
                <span style="margin-left: 100px">{{ data.tips || '' }}</span>
            </span>
          </template>
        </el-tree>
      </el-row>
  </div>

</template>
<script>
export default {
  dicts: ['598'],
  data() {
    return {
      defaultProps: {
        label: 'chapterName',
        children: 'children',
      },
      //   章节目录
      chapter: [],
      data: {},
    };
  },
  methods:{
    goBack() {
      this.$emit('goBack')
    },
    init(data) {
      if(data){
        this.data = data;
        this.chapter = data.chapterList;
      }
    },
  }
}
</script>

<style scoped lang="scss">

</style>
