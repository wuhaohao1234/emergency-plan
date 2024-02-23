<!--预测预警结构化-->
<template>
  <div id="warnStructural">
    <el-alert
      title="请勾选预警级别，勾选后完善对应信息，取消勾选级别后默认删除级别下对应信息"
      type="info"
      show-icon>
    </el-alert>
    <div class="top-checkbox">
      <el-checkbox-group v-model="earlyWarningList">
        <el-checkbox :label="1" class="first-level">I级</el-checkbox>
        <el-checkbox :label="2" class="second-level">II级</el-checkbox>
        <el-checkbox :label="3" class="third-level">III级</el-checkbox>
        <el-checkbox :label="4">IV级</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="bottom-tab">
      <el-tabs v-model="activeName" ref="tabs" tab-position="left"
               style="margin-top: 20px;">
        <el-tab-pane name="six">
          <span slot="label"><i class="el-icon-document-copy"></i> 预警分级</span>
          <GradeInfo ref="six" :levels="earlyWarningList" :detailType="13" :planId="planId"
                     :levelList="earlyWarningClassification"
                     @getData="getDetailInfo($event,13)" @validate="getResults($event,13)"></GradeInfo>
        </el-tab-pane>
        <el-tab-pane name="one">
          <span slot="label"><i class="el-icon-edit-outline"></i> 预警发布</span>
          <GradeInfo ref="one" :levels="earlyWarningList" :detailType="1" :planId="planId"
                     :levelList="earlyWarningPublish"
                     @getData="getDetailInfo($event,1)" @validate="getResults($event,1)"></GradeInfo>
        </el-tab-pane>
        <el-tab-pane name="two">
          <span slot="label"><i class="el-icon-tickets"></i> 信息报告</span>
          <GradeInfo ref="two" :levels="earlyWarningList" :detailType="2" :planId="planId" :levelList="infoReport"
                     @getData="getDetailInfo($event,2)" @validate="getResults($event,2)"></GradeInfo>
        </el-tab-pane>
        <el-tab-pane name="three">
          <span slot="label"><i class="el-icon-date"></i> 预警行动</span>
          <GradeInfo ref="three" :levels="earlyWarningList" :detailType="3" :planId="planId"
                     :levelList="earlyWarningRespond"
                     @getData="getDetailInfo($event,3)" @validate="getResults($event,3)"></GradeInfo>
        </el-tab-pane>
        <el-tab-pane name="four">
          <span slot="label"><i class="el-icon-document-delete"></i> 预警解除</span>
          <GradeInfo ref="four" :levels="earlyWarningList" :detailType="4" :planId="planId"
                     :levelList="earlyWarningSecure"
                     @getData="getDetailInfo($event,4)" @validate="getResults($event,4)"></GradeInfo>
        </el-tab-pane>
        <el-tab-pane name="five">
          <span slot="label"><i class="el-icon-reading"></i> 预警发布流程</span>
          <GradeInfo ref="five" :levels="earlyWarningList" :detailType="5" :planId="planId"
                     :levelList="publishFlowChart"
                     @getData="getDetailInfo($event,5)" @validate="getResults($event,5)"></GradeInfo>
        </el-tab-pane>
      </el-tabs>
      <div class="save-button">
        <el-button size="small" v-if="earlyWarningList.length" icon="el-icon-check" type="primary" @click="saveHandle">
          保存数据
        </el-button>
      </div>
    </div>

  </div>
</template>

<script>
import GradeInfo from "./gradeInfo";
import {findLevelInfo, saveOrUpdateBatch} from "@/api/plans/planLevel"

export default {
  name: "warnStructural",
  props: {
    planId: {
      type: Number,
      default: undefined
    }
  },
  components: {GradeInfo},
  data() {
    return {
      earlyWarningList: [],
      activeName: 'six',
      earlyWarningClassification: [],
      earlyWarningPublish: [],
      infoReport: [],
      earlyWarningRespond: [],
      earlyWarningSecure: [],
      publishFlowChart: [],
      result: false,
      levelData: [],
    }
  },
  mounted() {
    this.findWarnStructuralInfo()
  },
  methods: {
    //查询预测预警级别信息
    async findWarnStructuralInfo() {
      await findLevelInfo(this.planId, 2).then(res => {
        if (res.data && res.data.length) {
          this.earlyWarningList = res.data.map(item => item.level)
          this.levelData = res.data
        }
        this.earlyWarningPublish = this.findLevelInfo(1)
        this.earlyWarningClassification = this.findLevelInfo(13)
        this.infoReport = this.findLevelInfo(2)
        this.earlyWarningRespond = this.findLevelInfo(3)
        this.earlyWarningSecure = this.findLevelInfo(4)
        this.publishFlowChart = this.findLevelInfo(5)
      })
    },
    //获取预警发布数据
    getDetailInfo(data, type) {
      switch (type) {
        case 1:
          this.earlyWarningPublish = data;
          break;
        case 2:
          this.infoReport = data;
          break;
        case 3:
          this.earlyWarningRespond = data;
          break;
        case 4:
          this.earlyWarningSecure = data;
          break;
        case 5:
          this.publishFlowChart = data;
          break;
        case 13:
          this.earlyWarningClassification = data;
          break;
      }
    },
    //保存
    saveHandle() {
      //触发子组件校验
      this.$refs[this.activeName].validateHandle()
      if (this.result) {
        let levelList = []
        let arr = [this.earlyWarningPublish, this.infoReport,
          this.earlyWarningRespond, this.earlyWarningSecure, this.publishFlowChart, this.earlyWarningClassification]
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
                    imgData.push({content: JSON.stringify(img), detailType: 5})
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
          })
          saveOrUpdateBatch(levelList).then(res => {
            this.$modal.msgSuccess('操作成功')
          })
        }
      }
    },
    //获取校验结果
    getResults(result, type) {
      this.result = result
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
          levelType: 2,
          exist: this.earlyWarningList.includes(1),
          imgList: [],
          incidentData: []
        },
        {
          label: 'II级',
          value: 2,
          level: 2,
          isGrade: 1,
          planId: this.planId,
          levelType: 2,
          exist: this.earlyWarningList.includes(2),
          imgList: [],
          incidentData: []
        },
        {
          label: 'III级',
          value: 3,
          level: 3,
          isGrade: 1,
          planId: this.planId,
          levelType: 2,
          exist: this.earlyWarningList.includes(3),
          imgList: [],
          incidentData: []
        },
        {
          label: 'IV级',
          value: 4,
          level: 4,
          isGrade: 1,
          planId: this.planId,
          levelType: 2,
          exist: this.earlyWarningList.includes(4),
          imgList: [],
          incidentData: []
        }
      ]
      if (this.levelData) {
        this.levelData.forEach(item => {
          levelList[item.level - 1].exist = true
          switch (type) {
            case 1:
              levelList[item.level - 1].incidentData = item.earlyWarningPublish
              levelList[item.level - 1].isGrade = item.earlyWarningPublish.length ? item.earlyWarningPublish[0].isGrade : 1
              break;
            case 2:
              levelList[item.level - 1].incidentData = item.infoReport
              levelList[item.level - 1].isGrade = item.infoReport.length ? item.infoReport[0].isGrade : 1
              break;
            case 3:
              levelList[item.level - 1].incidentData = item.earlyWarningRespond
              levelList[item.level - 1].isGrade = item.earlyWarningRespond.length ? item.earlyWarningRespond[0].isGrade : 1
              break;
            case 4:
              levelList[item.level - 1].incidentData = item.earlyWarningSecure
              levelList[item.level - 1].isGrade = item.earlyWarningSecure.length ? item.earlyWarningSecure[0].isGrade : 1
              break;
            case 5:
              levelList[item.level - 1].imgList = item.publishFlowChart ? item.publishFlowChart.map(chart => JSON.parse(chart.content)) : []
              levelList[item.level - 1].isGrade = item.publishFlowChart.length ? item.publishFlowChart[0].isGrade : 1
              break;
            case 13:
              levelList[item.level - 1].incidentData = item.earlyWarningClassification
              levelList[item.level - 1].isGrade = item.earlyWarningClassification.length ? item.earlyWarningClassification[0].isGrade : 1
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
#warnStructural {
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

    .first-level .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #ea3636;
      border-color: #ea3636;
    }

    .second-level .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #f1af37;
      border-color: #f1af37;
    }

    .third-level .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #e0e02e;
      border-color: #e0e02e;
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
      top: 270px;
    }
  }
}
</style>
