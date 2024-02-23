<template>
  <div class="home">
    <div id="top">
      <!--      <p>本月统计</p>-->
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item,index) in cardList" :key="index">
          <el-card class="box-card" shadow="hover">
            <el-row :gutter="20">
              <el-col :span="6">
                <img style="width: 45px;height:45px" :src="item.imgPath">
              </el-col>
              <el-col :span="18" style="text-align: center;margin-top: 5px;font-size: 14px">
                <span><strong>{{ item.title }}</strong></span>
                <p><strong>{{ item.num }}</strong></p>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div id="bottom" class="flex-container">
      <div id="left" class="flex-item-left">
        <div id="left_top">
          <el-card class="box-card" shadow="hover">
            <div class="annual_statistics">
              <!--      预案审核-->
              <div id="planReview" class="statistics_report"></div>
              <!--      预案备案-->
              <div id="planFiling" class="statistics_report"></div>
              <!--      应急演练-->
              <div id="emergencyDrill" class="statistics_report"></div>
              <!--      预案修编-->
              <div id="planRevise" class="statistics_report"></div>
              <!--      预案评估-->
              <div id="planEstimate" class="statistics_report"></div>
            </div>
          </el-card>
        </div>
        <div id="left_bottom">
          <el-card class="box-card" shadow="hover">
                <span style="font-weight: 900"><i class="el-icon-s-promotion"
                                                  style="color: #007eff;font-size: 20px"
                ></i>&emsp;便捷导航</span>
            <div style="overflow-y:auto;height:calc(100vh - 61vh);">
              <el-tag type="info" v-for="(item,index) in easyNavList" @click="menuJumpHandle(item)" :key="index"
                      style="margin:20px 10px 0 0"
              ><a>{{ item.meta.title }}</a></el-tag>
              <el-tag style="margin:20px 10px 0 0" @click="addEasyNavHandle"><a>添加</a></el-tag>
            </div>
          </el-card>
        </div>
      </div>
      <div id="right" class="flex-item-right">
        <div id="right-top" :style="{ height: `${leftTopHeight}px` }">
          <el-card class="box-card" shadow="never" :style="{ height: `${leftTopHeight}px` }">
            <div id="box_top">
                <span style="font-weight: 900;width: 50%"><i class="el-icon-message-solid"
                                                             style="color: #007eff;font-size: 20px"
                >
                </i>&emsp;通知列表</span>
              <el-button type="text" style="width: 50%;text-align: right" @click="noticeJumpHandle">更多通知
              </el-button>
            </div>
            <div id="box_bottom" :style="{ 'max-height': topStyle['max-height'] + 'px', 'overflow-y': topStyle['overflow-y'] }">
              <el-table :data="noticeData" :show-header="false" style="margin-bottom: 20px" class="my-table">
                <el-table-column prop="title"></el-table-column>
                <el-table-column prop="auditTime" align="right"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
        <div id="right-bottom" :style="{ height: `${leftBottomHeight}px` }">
          <el-card class="box-card" shadow="never" :style="{ height: `${leftBottomHeight}px` }">
            <div id="box_top1" style="font-weight: 900"><i class="el-icon-s-comment"
                                                           style="color: #007eff;font-size: 20px"
            ></i>&emsp;资讯要闻
            </div>
            <div :style="{ 'max-height': bottomStyle['max-height'] + 'px', 'overflow-y': bottomStyle['overflow-y'] }">
              <ul style="font-size: 16px">
                <li v-for="item in linkInfo" style="margin: 12px 5px">
                  <div class="link">
                    <a target="_blank" :href="item.url">{{ item.title }}</a>
                  </div>
                </li>
              </ul>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <easy-nav ref="easyNav" v-if="addVisible" @goBack="getMenus"></easy-nav>
  </div>
</template>

<script>

import {getNoticeInfo} from "@/api/notice/noticeList";
import easyNav from "./easy_nav";
import {
  getmonthDrillNum,
  getmonthDrillQyNum,
  getNews,
  getyearStatisticsNum,
  getyearStatisticsQyNum
} from "@/api/plans/drill";
export default {
  name: "Index",
  components:{easyNav},
  data() {
    return {
      businessType: sessionStorage.getItem('BUSINESS_TYPE'),
      cardList: [
        {imgPath: require('@/assets/images/yljh.png'), title: '本月演练计划数量', num: 0},
        {imgPath: require('@/assets/images/yabs.png'), title: '本月收到预案报审数量', num: 0},
        {imgPath: require('@/assets/images/babs.png'), title: '本月收到备案报审数量', num: 0},
        {imgPath: require('@/assets/images/pgbg.png'), title: '本月收到评估报告数量', num: 0},
      ],
      planNumList: {},
      activeName: 'first',
      noticeName: 'first',
      collapseNames: 1,
      noticeSearch: '',
      organBusiness: [],
      deptBusiness: [],
      noticeData: [],
      linkInfo: [],//资讯列表
      easyNavList: [],//便捷导航
      topStyle:{
        "max-height": null,
        "overflow-y": "auto"
      },
      bottomStyle:{
        "max-height": null,
        "overflow-y": "auto"
      },
      leftTopHeight: null,
      leftBottomHeight: null,
      addVisible:false,
    };
  },
  mounted() {
    // 获取 left_top 和 left_bottom 元素
    const leftTop = document.getElementById('left_top');
    const boxTop = document.getElementById('box_top');
    const leftBottom = document.getElementById('left_bottom');
    const boxTop1 = document.getElementById('box_top1');

    // 获取 left_top 和 left_bottom 的高度
    this.leftTopHeight = leftTop.offsetHeight;
    const boxTopHeight = boxTop.offsetHeight;
    const boxTopHeight1 = boxTop1.offsetHeight;
    this.leftBottomHeight = leftBottom.offsetHeight;
    this.topStyle["max-height"] = this.leftTopHeight-boxTopHeight-20;
    this.bottomStyle["max-height"] = this.leftBottomHeight-boxTopHeight1-20;
    this.getDrillNum()
    this.getStatisticsNum()
    this.getNoticeList()
    this.getMenus()
    this.getLinkInfo();
  },
  methods: {
    //获取统计数量
    getDrillNum() {
      (this.businessType == 1 ? getmonthDrillNum() : getmonthDrillQyNum()).then(res => {
        this.cardList[0].num=res.data.drillNum
        this.cardList[1].num=res.data.submitAuditNum
        this.cardList[2].num=res.data.recordReportNum
        this.cardList[3].num=res.data.assessNum
      });
    },
    //获取年度统计数量
    getStatisticsNum() {
      const self = this; // 缓存 this
      (this.businessType == 1 ? getyearStatisticsNum() : getyearStatisticsQyNum()).then(res => {
        self.planNumList = res.data;
        self.$nextTick(() => {
          self.planReview()
          self.planFiling()
          self.emergencyDrill()
          self.planRevise()
          self.planEstimate()
        });
      });
    },
    getLinkInfo() {
      getNews().then(res => {
        this.linkInfo = res.data;
      });
    },
    // 获取通知列表
    getNoticeList() {
      getNoticeInfo(3).then(res => {
        this.noticeData = res.data;
      });
    },
    //预案审核
    planReview() {
      let value=(this.planNumList.auditNum.done/this.planNumList.auditNum.shouldDo)*100
      let filingChart = this.$echarts.init(
        document.getElementById("planReview")
      );
      filingChart.setOption(
        {
          // backgroundColor: '#fff',
          title: {
            text: "年度预案审核数",
            textStyle: {
              color: '#262525',
              fontSize: 14,
              // fontWeight: 'bold'
            },
            left: 'center',
            top: '80%',
          },
          tooltip: {
            show: false,
          },
          color: '#009AFF',
          series: [
            {
              name: '年度预案审核数',
              type: 'pie',
              //起始刻度的角度，默认为 90 度，即圆心的正上方。0 度为圆心的正右方。
              startAngle: 90,
              hoverAnimation: false,
              tooltip: {},
              radius: ["70%", "77%"],
              center: ['50%', '40%'],
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  color: '#393838',
                  fontSize: "12",
                  formatter: (params)=> {
                    return "应审核：" + `${this.planNumList.auditNum.shouldDo}` + "\n\n已审核：" + `${this.planNumList.auditNum.done}`
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {//显示的数据
                  value: value? value : 0,
                  itemStyle: {
                    normal: {
                      // color: this.state.count.OnlineMaster==0?"rgba(80,150,224,0.1)":"#009AFF"
                      color: value?"#009AFF":"rgba(80,150,224,0.1)"
                    }
                  }

                },
                {//总数-显示的数据
                  value: Math.max(100-(value?value:1),0),
                  itemStyle: {
                    normal: {
                      color: value ? "rgba(80,150,224,0.1)":"#009AFF"
                    }
                  }
                },

              ]
            },
          ]
        })
    },
    //预案备案
    planFiling() {
      const self = this; // 缓存 this
      let value=(self.planNumList.revisionNum.done/self.planNumList.revisionNum.shouldDo)*100
      let filingChart = self.$echarts.init(
        document.getElementById("planFiling")
      );
      filingChart.setOption(
        {
          // backgroundColor: '#fff',
          title: {
            text: "年度预案备案数",
            textStyle: {
              color: '#262525',
              fontSize: 14,
              // fontWeight: 'bold'
            },
            left: 'center',
            top: '80%',
          },
          tooltip: {
            show: false,
          },
          color: '#009AFF',
          series: [
            {
              name: '年度预案备案数',
              type: 'pie',
              //起始刻度的角度，默认为 90 度，即圆心的正上方。0 度为圆心的正右方。
              startAngle: 90,
              hoverAnimation: false,
              tooltip: {},
              radius: ["70%", "77%"],
              center: ['50%', '40%'],
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  color: '#393838',
                  fontSize: "14",
                  formatter: function (params) {
                    return "应审核：" + `${self.planNumList.revisionNum.shouldDo}` + "\n\n已审核：" + `${self.planNumList.revisionNum.done}`
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {//显示的数据
                  value: value? value : 1,
                  itemStyle: {
                    normal: {
                      // color: this.state.count.OnlineMaster==0?"rgba(80,150,224,0.1)":"#009AFF"
                      color: value?"#15b63d":"rgba(80,150,224,0.1)"
                    }
                  }

                },
                {//总数-显示的数据
                  value: Math.max(100-(value?value:1),0),
                  itemStyle: {
                    normal: {
                      color: value ?"rgba(80,150,224,0.1)":"#15b63d"
                    }
                  }
                },

              ]
            },
          ]
        })
    },
    //应急演练
    emergencyDrill() {
      const self = this; // 缓存 this
      let value=(self.planNumList.drillNum.done/self.planNumList.drillNum.shouldDo)*100
      let drillChart = self.$echarts.init(
        document.getElementById("emergencyDrill")
      );
      drillChart.setOption(
        {
          // backgroundColor: '#fff',
          title: {
            text: "年度应急演练数",
            textStyle: {
              color: '#262525',
              fontSize: 14,
              // fontWeight: 'bold'
            },
            left: 'center',
            top: '80%',
          },
          tooltip: {
            show: false,
          },
          color: '#009AFF',
          series: [
            {
              name: '年度应急演练数',
              type: 'pie',
              //起始刻度的角度，默认为 90 度，即圆心的正上方。0 度为圆心的正右方。
              startAngle: 90,
              hoverAnimation: false,
              tooltip: {},
              radius: ["70%", "77%"],
              center: ['50%', '40%'],
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  color: '#393838',
                  fontSize: "14",
                  formatter: function (params) {
                    return "计划：" + `${self.planNumList.drillNum.shouldDo}` + "\n\n已完成：" + `${self.planNumList.drillNum.done}`
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {//显示的数据
                  value: value ? value : 1,
                  itemStyle: {
                    normal: {
                      // color: this.state.count.OnlineMaster==0?"rgba(80,150,224,0.1)":"#009AFF"
                      color: value?"#9a74b4":"rgba(80,150,224,0.1)"
                    }
                  }

                },
                {//总数-显示的数据
                  value: Math.max(100-(value?value:1),0),
                  itemStyle: {
                    normal: {
                      color: value ? "rgba(80,150,224,0.1)" :"#9a74b4"
                    }
                  }
                },

              ]
            },
          ]
        })
    },
    //预案修编
    planRevise() {
      const self = this; // 缓存 this
      let value=(self.planNumList.revisionNum.done/self.planNumList.revisionNum.shouldDo)*100
      let reviseChart = self.$echarts.init(
        document.getElementById("planRevise")
      );
      reviseChart.setOption(
        {
          // backgroundColor: '#fff',
          title: {
            text: "年度预案修编数",
            textStyle: {
              color: '#262525',
              fontSize: 14,
              // fontWeight: 'bold'
            },
            left: 'center',
            top: '80%',
          },
          tooltip: {
            show: false,
          },
          color: '#009AFF',
          series: [
            {
              name: '年度预案修编数',
              type: 'pie',
              //起始刻度的角度，默认为 90 度，即圆心的正上方。0 度为圆心的正右方。
              startAngle: 90,
              hoverAnimation: false,
              tooltip: {},
              radius: ["70%", "77%"],
              center: ['50%', '40%'],
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  color: '#393838',
                  fontSize: "14",
                  formatter: function (params) {
                    return "计划：" + `${self.planNumList.revisionNum.shouldDo}` + "\n\n已完成：" + `${self.planNumList.revisionNum.done}`
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {//显示的数据
                  value: value? value : 1,
                  itemStyle: {
                    normal: {
                      // color: this.state.count.OnlineMaster==0?"rgba(80,150,224,0.1)":"#009AFF"
                      color: value?"#07a8a8":"rgba(80,150,224,0.1)"
                    }
                  }

                },
                {//总数-显示的数据
                  value: Math.max(100-(value?value:1),0),
                  itemStyle: {
                    normal: {
                      color: value ?  "rgba(80,150,224,0.1)" :"#07a8a8"
                    }
                  }
                },

              ]
            },
          ]
        })
    },
    //预案评估
    planEstimate() {
      const self = this; // 缓存 this
      let value=(self.planNumList.assessNum.done/self.planNumList.assessNum.shouldDo)*100
      let estimateChart = self.$echarts.init(
        document.getElementById("planEstimate")
      );
      estimateChart.setOption(
        {
          // backgroundColor: '#fff',
          title: {
            text: "年度预案评估数",
            textStyle: {
              color: '#262525',
              fontSize: 14,
              // fontWeight: 'bold'
            },
            left: 'center',
            top: '80%',
          },
          tooltip: {
            show: false,
          },
          color: '#009AFF',
          series: [
            {
              name: '年度预案评估数',
              type: 'pie',
              //起始刻度的角度，默认为 90 度，即圆心的正上方。0 度为圆心的正右方。
              startAngle: 90,
              hoverAnimation: false,
              tooltip: {},
              radius: ["70%", "77%"],
              center: ['50%', '40%'],
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  color: '#393838',
                  fontSize: "14",
                  formatter: function (params) {
                    return "应评估：" + `${self.planNumList.assessNum.shouldDo}` + "\n\n已完成：" + `${self.planNumList.assessNum.done}`
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {//显示的数据
                  value: value? value : 1,
                  itemStyle: {
                    normal: {
                      // color: this.state.count.OnlineMaster==0?"rgba(80,150,224,0.1)":"#009AFF"
                      color: value?"#f6c207":"rgba(80,150,224,0.1)"
                    }
                  }

                },
                {//总数-显示的数据
                  value: Math.max(100-(value?value:1),0),
                  itemStyle: {
                    normal: {
                      color: value ?"rgba(80,150,224,0.1)":"#f6c207",
                    }
                  }
                },

              ]
            },
          ]
        })
    },

    //获取业务快捷菜单
    getMenus() {
      let businessType = sessionStorage.getItem('BUSINESS_TYPE');//业务类型
      if (businessType == '1') {
        this.easyNavList = JSON.parse(sessionStorage.getItem('OG_EASY_NAV'));//机关快捷菜单
      } else {
        this.easyNavList = JSON.parse(sessionStorage.getItem('EN_EASY_NAV'));//部门快捷菜单
      }
    },
    // 更多通知
    noticeJumpHandle() {
      let path = '/notice/noticeList';
      this.$router.push({path})
    },
    //菜单跳转操作
    menuJumpHandle(data) {
      let pPath=''
      if(data.parent.path!='/'){
        pPath=data.parent.path+'/'
      }
      let path = pPath + data.path
      this.$router.push({path})
    },
    /**
     * 添加便捷导航
     */
    addEasyNavHandle() {
      this.addVisible=true;
      this.$nextTick(()=>{
        this.$refs.easyNav.init()
      })
    }
  },
};
</script>

<style lang="scss">
.my-table th {
  border: none;
}

.my-table td, .my-table th.is-leaf {
  border: none;
}

/* 表格最外边框 */
.el-table--border, .el-table--group {
  border: none;
}

/* 头部边框 */
.my-table thead tr th.is-leaf {
  border-bottom: 1px solid #EBEEF5;
  border-right: none;
}

.my-table thead tr th:nth-last-of-type(2) {

}

/* 表格最外层边框-底部边框 */
.el-table--border::after, .el-table--group::after {
  width: 0;
}

.my-table::before {
  width: 0;
}

.my-table .el-table__fixed-right::before, .el-table__fixed::before {
  width: 0;
}

/* 表格有滚动时表格头边框 */
.el-table--border th.gutter:last-of-type {
  border: 1px solid #EBEEF5;
  border-left: none;
}

/* 自定义样式 */
.el-table .el-table__row {
  background-color: #F5F6F7; /* 设置奇数行背景色为灰色 */
}

.el-table .el-table__row:nth-child(even) {
  background-color: #ffffff; /* 设置偶数行背景色为白色 */
}

.home {
  height: 100%;
  background-color: #f1f0f0;

  /* Flex container */
  .flex-container {
    height: 80%;
    display: flex;
    flex-direction: row;
  }

  .flex-item-left {
    width: 59%;
    display: flex;
    flex-direction: column;
  }
  .flex-item-right {
    margin-left: 1%;
    width: 40%;
    display: flex;
    flex-direction: column;
  }
  .statistics_report {
    width: 20%;
    height: 230px
  }

  p {
    line-height: 5px;
    font-size: 14px;
    font-weight: 700;
  }

  margin: 0;


  #top {
    padding: 10px 10px 0 10px;
    height: 20%;

    .el-card__body {
      padding: 10px 10px 0 10px;
    }
  }

  #bottom {
    width: 100%;
    height: 80%;
    padding: 20px 10px 0 10px;

    #left {
      .annual_statistics {
        display: flex;
        height: 100%;
      }

      #left_top {
        .el-card__body {
          padding: 10px 10px 0 10px;
        }
      }

      #left_bottom {
        margin-top: 20px;

        .business_hover:hover {
          .business_info {
            color: #1890ff;

            .item {
              font-size: 5px;
            }
          }
        }

        .business_icon {
          font-size: 45px;
          color: #5470c6;
        }

        .el-tag {
          color: #1d1e1f;
          padding: 0 30px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
        }
      }
    }

    .el-tabs__item {
      font-size: 14px;
    }

    #right {

      #right-top {
        .el-card__body {
          padding: 10px 10px 0 10px;
        }
        #box_top {
          display: flex;
          //line-height: 30px;
          margin: 10px 0 10px 10px;
        }

        #box_bottom {
          .el-collapse-item__header {
            font-weight: 700;
          }

          .el-collapse-item__header:hover {
            background: #f6f6f6;
          }

          .notice_content {
            font-size: 14px;
            color: #8f8f90
          }
        }
      }

      #right-bottom {
        margin-top: 20px;

        #box_top1 {
          margin: 10px 0 10px 10px;
        }

        .link {
          white-space: nowrap; /* 防止换行 */
          overflow: hidden; /* 隐藏超出部分 */
          text-overflow: ellipsis;
          width: 97%;

          a:hover {
            color: #189ff8;
            text-decoration: none;
          }
        }
      }

    }
  }


}
</style>

