<!--预案全文详情-->
<template>
  <div id="planContentDetail">
      <div class="left-content">
        <div style="margin-left: 30px">
          <img src="@/assets/images/detail/line.png" alt="" style="margin-top: 50px;">
          <div class="chapter-search">
            <input
              v-model="chapterName"
              placeholder="请输入章节名称"
              style="margin-left:10px;background: none;border:none;height:40px;width:170px;color: white"
            >
            <el-button style="background: none;border: none" icon="el-icon-search" @click="searchChapter"></el-button>
          </div>
          <el-tree
            :data="chapter"
            :props="defaultProps"
            accordion
            @node-click="handleNodeClick"
            :highlight-current="true"
            ref="tree"
            node-key="chapterId"
            :style="{ '--tree-highlight-background': '#87CEFA' }"
            class="chapter-tree"
          >
          </el-tree>
        </div>
      </div>
      <div class="right-content">
        <h2 style="margin-top: 60px;text-align: center" @click="getChapterDetail(planId)">{{planName}}</h2>
        <div v-html="allContent" class="content-detail"></div>
      </div>
  </div>
</template>
<script>
import {getTempInfoByPlanId,enGetTempInfoByPlanId} from "@/api/plans/structural";
export default {
  name: "planContentDetail",
  props: {
    planId: {
      type: Number,
      default: null
    },
    planName: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      chapter: [],
      defaultProps: {
        label: 'chapterName',
        children: 'children',
      },
      chapterName: "",
      allContent: "",
      currentChapter: null,
      businessType:1,
    };
  },
  watch: {
    planId: {
      immediate: true,
      handler(newPlanId) {
        this.getChapterDetail(newPlanId);
      }
    }
  },
  methods: {
    getChapterDetail(planId) {
      this.businessType = sessionStorage.getItem('BUSINESS_TYPE');//业务类型
      if (planId != null) {
        (this.businessType == 1 ? getTempInfoByPlanId : enGetTempInfoByPlanId)(planId).then(res => {
          if (res.data && res.data.contentList) {
            this.chapter = res.data.contentList;
            this.allContent = this.getAllContent(res.data.contentList);
          }
        })
      }
    },
    getAllContent(chapters) {
      let result = '';
      for (const chapter of chapters) {
        result += `<h3 style="color: #FF9400">${chapter.chapterName}</h3><div style="text-indent: 2em;">${chapter.content ? chapter.content : ""}</div>`;
        if (chapter.children != null) {
          result += this.getAllContent(chapter.children);
        }
      }
      return result;
    },
    handleNodeClick(node) {
      this.allContent = this.getAllContent([node]);
    },
  //   搜索目录
    searchChapter() {
      const matchedNodes = this.findNodesByKeyword(this.chapter, this.chapterName);
      if (matchedNodes.length > 0) {
        if (matchedNodes[0].parentId == null) {
          this.$refs.tree.setCurrentKey(matchedNodes[0].chapterId);
        }else {
          this.$refs.tree.setCurrentKey(matchedNodes[0].parentId);
          this.$refs.tree.setCurrentKey(matchedNodes[0].chapterId);
        }
        this.allContent = this.getAllContent(matchedNodes);
      }else {
        this.$message.warning('未找到相关文章');
      }
    },
    findNodesByKeyword(nodes, keyword) {
      const matchedNodes = [];
      for (const node of nodes) {
        if (node.chapterName.includes(keyword)) {
          matchedNodes.push(node);
        }
        if (node.children && node.children.length > 0) {
          const childMathes = this.findNodesByKeyword(node.children, keyword);
          matchedNodes.push(...childMathes);
        }
      }
      return matchedNodes;
    },
  },
}
</script>

<style scoped lang="scss">
#planContentDetail {
  display: flex;
  color: white;

  .left-content {
    width: 278px;
    height: 700px;
    background-image: url("../../../../assets/images/detail/left.png"); /* 替换为你的图片路径 */
    background-size: 278px 700px;
    background-repeat: no-repeat;
    background-position: center; /* 或者根据需要调整背景图的位置 */
    float: left;

    .chapter-search{
      width: 240px;
      height: 40px;
      background-image: url('../../../../assets/images/detail/search.png');
      background-size: 240px 40px;
      background-repeat: no-repeat;
      background-position: center; /* 或者根据需要调整背景图的位置 */
    }
    .chapter-search >.input :hover{
      border: none;
    }

    .chapter-tree {
      margin-top: 10px;
      background: none;
      color: white;
      height: 500px;
      overflow-y: scroll;
    }
  }
  .right-content {
    width: 1250px;
    height: 700px;
    margin-left: 20px;
    background-size: 1250px 700px;
    background-repeat: no-repeat;
    background-position: center; /* 或者根据需要调整背景图的位置 */
    background-image: url("../../../../assets/images/detail/contentbg.png");
    float: left;

    .content-detail {
      width: 97%;
      height: 550px;
      margin-left: 30px;
      overflow-y: scroll;
    }
  }
  .el-input{
    .el-input__inner{
      background: #00feff;
    }

  }
  .el-button{
    color: #00feff;
  }
  ::v-deep.el-tree-node__content{
    &:hover{
      background-color: #6198EF;
    }
  }
}
::v-deep.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #6198EF;
}

</style>
