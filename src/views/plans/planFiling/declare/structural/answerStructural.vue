<!--应急响应结构化-->
<template>
  <div id="answerStructural">
    <el-alert
      title="请勾选响应级别，勾选后完善对应信息，取消勾选级别后默认删除级别下对应信息"
      type="info"
      show-icon>
    </el-alert>
    <div class="top-checkbox">
      <el-checkbox-group v-model="earlyAnswerList">
        <el-checkbox :label="1">I级</el-checkbox>
        <el-checkbox :label="2">II级</el-checkbox>
        <el-checkbox :label="3">III级</el-checkbox>
        <el-checkbox :label="4">IV级</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="bottom-tab">
      <el-tabs v-model="activeName" ref="tabs" tab-position="left"
               style="margin-top: 20px;">
        <el-tab-pane name="one">
          <span slot="label"><i class="el-icon-document-delete"></i> 先期处置</span>
          <GradeInfo ref="one" :levels="earlyAnswerList" :detailType="11" :planId="planId" :levelList="earlyDisposal"
                     @getData="getDetailInfo($event,11)" @validate="getResults($event,11)"
          ></GradeInfo>
        </el-tab-pane>
        <el-tab-pane name="two">
          <span slot="label"><i class="el-icon-edit-outline"></i> 启动条件</span>
          <GradeInfo ref="two" :levels="earlyAnswerList" :detailType="6" :planId="planId" :levelList="startCondition"
                     @getData="getDetailInfo($event,6)" @validate="getResults($event,6)"
          ></GradeInfo>
        </el-tab-pane>
        <el-tab-pane name="three">
          <span slot="label"><i class="el-icon-tickets"></i> 启动程序</span>
          <GradeInfo ref="three" :levels="earlyAnswerList" :detailType="7" :planId="planId" :levelList="startProgram"
                     @getData="getDetailInfo($event,7)" @validate="getResults($event,7)"
          ></GradeInfo>
        </el-tab-pane>
        <el-tab-pane name="four">
          <span slot="label"><i class="el-icon-date"></i> 响应措施</span>
          <GradeInfo ref="four" :levels="earlyAnswerList" :detailType="8" :planId="planId" :levelList="respondMeasure"
                     @getData="getDetailInfo($event,8)" @validate="getResults($event,8)"
          ></GradeInfo>
        </el-tab-pane>
        <el-tab-pane name="six">
          <span slot="label"><i class="el-icon-document-delete"></i> 组织机构</span>
          <level-organization ref="six" :levels="earlyAnswerList" :detailType="12" :planId="planId"
                              :levelList="orgList" @getData="getDetailInfo($event,12)"
                              @validate="getResults($event,12)"></level-organization>
        </el-tab-pane>
        <el-tab-pane name="seven">
          <span slot="label"><i class="el-icon-document-delete"></i> 响应调整和终止</span>
          <GradeInfo ref="seven" :levels="earlyAnswerList" :detailType="9" :planId="planId" :levelList="adjust"
                     @getData="getDetailInfo($event,9)" @validate="getResults($event,9)"
          ></GradeInfo>
        </el-tab-pane>
        <el-tab-pane name="five">
          <span slot="label"><i class="el-icon-reading"></i> 应急响应流程图</span>
          <GradeInfo ref="five" :levels="earlyAnswerList" :detailType="10" :planId="planId"
                     :levelList="respondFlowChart"
                     @getData="getDetailInfo($event,10)" @validate="getResults($event,10)"
          ></GradeInfo>
        </el-tab-pane>
      </el-tabs>
      <div class="save-button" v-if="earlyAnswerList.length > 0">
        <el-button size="small" icon="el-icon-check" type="primary" @click="saveHandle">
          保存数据
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {findLevelInfo, saveOrUpdateBatch} from "@/api/plans/planLevel";
import GradeInfo from "@/views/plans/planFiling/declare/structural/gradeInfo.vue";
import LevelOrganization from "./levelOrganization";

export default {
  props: {
    planId: {
      type: Number,
      default: undefined
    }
  },
  components: {LevelOrganization, GradeInfo},
  data() {
    return {
      earlyAnswerList: [],
      activeName: 'one',
      result: false,
      levelData: [],
      startCondition: [],//启动条件
      startProgram: [],//启动程序
      respondMeasure: [],//响应措施
      orgList: [],//组织机构
      earlyDisposal: [],//早期处置
      adjust: [],//相应调整和终止
      respondFlowChart: [],//流程图
    }
  },
  mounted() {
    this.findAnswerStructuralInfo()
  },
  methods: {
    //查询响应级别信息
    async findAnswerStructuralInfo() {
      await findLevelInfo(this.planId, 3).then(res => {
        if (res.data && res.data.length) {
          this.earlyAnswerList = res.data.map(item => item.level)
          this.levelData = res.data
        }
        this.startCondition = this.findLevelInfo(6)
        this.startProgram = this.findLevelInfo(7)
        this.respondMeasure = this.findLevelInfo(8)
        this.orgList = this.findLevelInfo(12)
        this.earlyDisposal = this.findLevelInfo(11)
        this.adjust = this.findLevelInfo(9)
        this.respondFlowChart = this.findLevelInfo(10)
      })
    },
    //获取预警发布数据
    getDetailInfo(data, type) {
      switch (type) {
        case 6:
          this.startCondition = data;
          break;
        case 7:
          this.startProgram = data;
          break;
        case 8:
          this.respondMeasure = data;
          break;
        case 12:
          this.orgList = data;
          break;
        case 9:
          this.adjust = data;
          break;
        case 11:
          this.earlyDisposal = data;
          break;
        case 10:
          this.respondFlowChart = data;
          break;
      }
    },
    //获取校验结果
    getResults(result, type) {
      this.result = result
    },
    saveHandle() {
      //触发子组件校验
      this.$refs[this.activeName].validateHandle()
      if (this.result) {
        let levelList = []
        let arr = [this.startCondition, this.startProgram,
          this.respondMeasure, this.adjust, this.earlyDisposal, this.respondFlowChart]
        let levelDetail = [[], [], [], []]
        arr.forEach((item, index) => {
          if (item.length) {
            //过滤存在的级别
            let existLevel = item.filter(i => i.exist)
            levelList = existLevel
            existLevel.forEach(exist => {
              //级别存在详情数据
              if (exist.incidentData.length || exist.imgList.length) {
                levelDetail[exist.level - 1] = levelDetail[exist.level - 1].concat(exist.incidentData)
                if (exist.imgList.length) {
                  let imgData = []
                  exist.imgList.forEach(img => {
                    imgData.push({content: JSON.stringify(img), detailType: 10})
                  })
                  levelDetail[exist.level - 1] = levelDetail[exist.level - 1].concat(imgData)
                }
              }
            })
          }
        })
        if (levelList.length) {
          levelList.forEach(level => {
            level.detailList = levelDetail[level.level - 1]
            if (this.orgList.length) {
              level.orgList = this.orgList[level.level - 1].orgList
            }
          })
          saveOrUpdateBatch(levelList).then(res => {
            this.$modal.msgSuccess('操作成功')
          })
        }
      }
    },
    //根据级别获取已保存数据
    findLevelInfo(type) {
      let levelList = [
        {
          label: 'I级',
          value: 1,
          level: 1,
          isGrade: 1,
          planId: this.planId,
          levelType: 3,
          exist: this.earlyAnswerList.includes(1),
          imgList: [],
          incidentData: [],
          orgList: {}
        },
        {
          label: 'II级',
          value: 2,
          level: 2,
          isGrade: 1,
          planId: this.planId,
          levelType: 3,
          exist: this.earlyAnswerList.includes(2),
          imgList: [],
          incidentData: [],
          orgList: {}
        },
        {
          label: 'III级',
          value: 3,
          level: 3,
          isGrade: 1,
          planId: this.planId,
          levelType: 3,
          exist: this.earlyAnswerList.includes(3),
          imgList: [],
          incidentData: [],
          orgList: {}
        },
        {
          label: 'IV级',
          value: 4,
          level: 4,
          isGrade: 1,
          planId: this.planId,
          levelType: 3,
          exist: this.earlyAnswerList.includes(4),
          imgList: [],
          incidentData: [],
          orgList: {}
        }
      ]
      if (this.levelData) {
        this.levelData.forEach(item => {
          levelList[item.level - 1].exist = true
          switch (type) {
            case 6:
              levelList[item.level - 1].incidentData = item.startCondition
              levelList[item.level - 1].isGrade = item.startCondition.length ? item.startCondition[0].isGrade : 1
              break;
            case 7:
              levelList[item.level - 1].incidentData = item.startProgram
              levelList[item.level - 1].isGrade = item.startProgram.length ? item.startProgram[0].isGrade : 1
              break;
            case 8:
              levelList[item.level - 1].incidentData = item.respondMeasure
              levelList[item.level - 1].isGrade = item.respondMeasure.length ? item.respondMeasure[0].isGrade : 1
              break;
            case 12:
              levelList[item.level - 1].orgList = item.orgList ? item.orgList : {}
              levelList[item.level - 1].isGrade = item.orgList ? item.orgList.isGrade : 1
              break;
            case 9:
              levelList[item.level - 1].incidentData = item.adjust
              levelList[item.level - 1].isGrade = item.adjust.length ? item.adjust[0].isGrade : 1
              break;
            case 11:
              levelList[item.level - 1].incidentData = item.earlyDisposal
              levelList[item.level - 1].isGrade = item.earlyDisposal.length ? item.earlyDisposal[0].isGrade : 1
              break;
            case 10:
              levelList[item.level - 1].imgList = item.respondFlowChart ? item.respondFlowChart.map(chart => JSON.parse(chart.content)) : []
              levelList[item.level - 1].isGrade = item.respondFlowChart.length ? item.respondFlowChart[0].isGrade : 1
              break;
          }
        })
      }
      return levelList
    }
  }
}
</script>

<style lang="scss">
#answerStructural {
  .top-checkbox {
    margin-left: 30px;
    margin-top: 20px;

    .el-checkbox__inner {
      width: 20px;
      height: 20px;
    }

    .el-checkbox__inner::after {
      left: 8px;
      top: 3px;
    }
  }

  .el-tabs__item {
    padding: 0 20px 0 0;
  }

  .bottom-tab {
    position: relative;

    .save-button {
      position: absolute;
      left: 20px;
      top: 280px;
    }
  }
}
</style>
