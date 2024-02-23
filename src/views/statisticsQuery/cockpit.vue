<template>
  <div class="chart">
    <div class="chart-left">
      <div class="chart-left-item">
        <p class="title">全市应急预案备案数量（个）</p>
        <p class="count">56789</p>
        <div id="main" style="width: 200px;height:100px;"></div>
      </div>
      <div class="chart-left-item">
        <p class="title">新增预案（个）</p>
        <p class="count">9852</p>
        <div id="main2" style="width: 200px;height:100px;"></div>
      </div>
      <div class="chart-left-item">
        <p class="title">年度演练计划（个）</p>
        <p class="count">40789</p>
        <div class="circle">
          <el-progress type="circle" color="#FF9502" :stroke-width="10" :width="100" :percentage="75"
            :format="format"></el-progress>
        </div>
      </div>
      <div class="chart-left-item">
        <p class="title">年度修编计划（个）</p>
        <p class="count">56789</p>
        <div class="circle">
          <el-progress type="circle" color="#FF9502" :stroke-width="10" :width="100" :percentage="75"
            :format="format"></el-progress>
        </div>
      </div>
      <div class="chart-left-item">
        <p class="title">新增预案修编数（个）</p>
        <p class="count">56789</p>
        <div id="main3" style="width: 200px;height:100px;"></div>
      </div>
    </div>
    <div class="chart-content">
      <div class="chart-content-item s1">
        <div class="chart-content-item-top">
          <p class="title">备案数量与修编数量变化曲线</p>
          <el-date-picker size="small" v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div id="main4" style="width: 100%;height:260px;"></div>
      </div>
      <div class="chart-content-item s2">
        <div class="chart-content-item-top">
          <p class="title">注册企业行业分布</p>
        </div>
        <div id="main5" style="width: 100%;height:260px;"></div>
      </div>
      <div class="chart-content-item s3">
        <div class="chart-content-item-top">
          <p class="title">预案种类分布（单位：个）</p>
        </div>
        <div id="main6" style="width: 100%;height:220px;"></div>
      </div>
      <div class="chart-content-item s4">
        <div class="chart-content-item-top">
          <p class="title">新增审核预案、备案预案数量趋势</p>
          <el-date-picker size="small" v-model="value2" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div id="main7" style="width: 100%;height:220px;"></div>
      </div>
      <div class="chart-content-item s5">
        <div class="chart-content-item-top">
          <p class="title">新增备案数量分布</p>
        </div>
        <div id="main8" style="width: 100%;height:220px;"></div>
      </div>
    </div>
    <div class="chart-right">
      <div class="chart-content-item s1">
        <div class="chart-content-item-top">
          <p class="title">业务处理平均天数</p>
        </div>
        <div id="main9" style="width: 100%;height:275px;margin: 0 auto;"></div>
      </div>
      <div class="chart-content-item s1" style="padding-bottom: 0;">
        <div class="chart-content-item-top">
          <p class="title">全市累计预案备案数量统计</p>
        </div>
        <div id="main10" style="width: 100%;height:180px;margin: 0 auto;top::10px"></div>
      </div>
      <div class="chart-content-item s1" style="padding-bottom: 0;background-color: transparent;">
        <div class="chart-content-item-top"></div>
        <div :id="id" class="o-echarts" style="width: 100%;height:320px;margin: 0 auto;top::10px"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import JSON from './chongqing.json';
  export default {
    name: "HelloWord",
    data() {
      return {
        value1: '',
        value2: '',
        id: 'echarts_' + new Date().getTime() + Math.floor(Math.random() * 1000),
        echartObj: null,
        radioList: {},
        radioActive: 'A',
        option: {
          title: {
            text: '',
            top: '3%',
            left: '5%',
            textStyle: {
              fontSize: 11,
              fontWeight: 300,
              color: '#b6d7ff'
            }
          },
          tooltip: {
            padding: 0,
            backgroundColor: 'transparent',
            // formatter: params => {
            //   // params.data
            //   return `<table class="map__tooltip o_font20">
            //                                 <thead>
            //                                    <tr>
            //                                        <th>总购买人数</th>
            //                                        <th>本年度总购买人数</th>
            //                                        <th>本月度总购买人数</th>
            //                                        <th>总完成人数</th>
            //                                     </tr>
            //                                 </thead>
            //                                 <tbody>
            //                                     <tr>
            //                                         <th>${params.data.obj.a}</th>
            //                                         <th>${params.data.obj.b}</th>
            //                                         <th>${params.data.obj.c}</th>
            //                                         <th>${params.data.obj.d}</th>
            //                                      </tr>
            //                                 </tbody>
            //                             </table>`;
            // }
          },
          legend: {
            orient: 'vertical',
            top: '9%',
            left: '5%',
            icon: 'circle',
            data: [],
            selectedMode: 'single',
            selected: {},
            itemWidth: 12,
            itemHeight: 12,
            itemGap: 30,
            inactiveColor: '#b6d7ff',
            textStyle: {
              color: '#ec808d',
              fontSize: 11,
              fontWeight: 300,
              padding: [0, 0, 0, 15]
            }
          },
          visualMap: {
            min: 0,
            max: 500,
            show: false,
            splitNumber: 5,
            inRange: {
              color: ['#ec808d', '#ec808d', '#fff', '#ec808d', '#fff'].reverse()
            },
            textStyle: {
              color: '#fff'
            }
          },
          geo: {
            map: '重庆',
            label: {
              normal: {
                fontSize: '10px',
                show: true,
                color: '#000'
              },
              emphasis: {
                show: true,
                color: '#fff'
              }
            },
            roam: false,
            itemStyle: {
              normal: {
                areaColor: '#ddd',
                borderColor: '#ddd',
                borderWidth: 1
              },
              emphasis: {
                areaColor: '#feb6aa' // hover效果
              }
            },
            left: '0%',
            right: '0%',
            top: '0%',
            bottom: '0%'
          },
          series: [{
            name: '',
            type: 'map',
            geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
            data: []
          }]
        }
      }
    },
    methods: {
      getOptions() {
        this.setOptions('legend', {
          data: Object.values(this.radioList),
          selected: (list => {
            const obj = {};
            Object.keys(list).map((item, index) => {
              obj[list[item]] = item === this.radioActive;
            });
            return obj;
          })(this.radioList)
        });
        this.setOptions('series', (() => {
          const arr = [];
          Object.values(this.radioList)
            .map((item, index) => {
              arr[this.radioList[this.radioActive] === item ? 'unshift' : 'push']({
                name: item,
                type: 'map',
                geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
                data: this.getSeriesData(item)
              });
            });
          return arr;
        })());
        return this.option;
      },
      getSeriesData(item) {
        return this.radioList[this.radioActive] === item ? JSON.features.map(item => {
          return {
            name: item.properties.name,
            value: Math.ceil(Math.random() * 500),
            obj: {
              a: Math.ceil(Math.random() * 500),
              b: Math.ceil(Math.random() * 500),
              c: Math.ceil(Math.random() * 500),
              d: Math.ceil(Math.random() * 500)
            }
          };
        }) : [];
      },
      setOptions(objKey, objVal) {
        if (this.option[objKey] && typeof this.option[objKey] === 'object' && !Array.isArray(this.option[objKey])) {
          this.option[objKey] = Object.assign(this.option[objKey], objVal);
        } else {
          this.option[objKey] = objVal;
        }
        this.$set(this.option, objKey, this.option[objKey]);
      },
      format(percentage) {
        return `完成率 ${percentage}%`;
      },
      drawChart() {
        //2. 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('main'));
        //3. 指定图表的配置项和数据
        let option = {
          title: {
            text: ''
          },
          color: ['#FF9502'],
          tooltip: {},
          legend: { //图例组件
            data: []
          },
          xAxis: {
            data: [],
            show: false
          },
          yAxis: {
            show: false
          },
          series: [{
            name: '',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20, 36, 10, 10, 20]
          }]
        };
        //4.使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      drawChart2() {
        //2. 基于准备好的dom，初始化echarts实例
        let myChart2 = this.$echarts.init(document.getElementById('main2'));
        //3. 指定图表的配置项和数据
        let option = {
          title: {
            text: ''
          },
          tooltip: {},
          legend: { //图例组件
            data: []
          },
          xAxis: {
            data: [],
            show: false
          },
          yAxis: {
            show: false
          },
          series: [{
            name: '',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20, 36, 10, 10, 20]
          }]
        };
        //4.使用刚指定的配置项和数据显示图表。
        myChart2.setOption(option);
      },
      drawChart3() {
        //2. 基于准备好的dom，初始化echarts实例
        let myChart3 = this.$echarts.init(document.getElementById('main3'));
        //3. 指定图表的配置项和数据
        let option = {
          title: {
            text: ''
          },
          color: ['#05AEE6'],
          tooltip: {},
          legend: { //图例组件
            data: []
          },
          xAxis: {
            data: [],
            show: false
          },
          yAxis: {
            show: false
          },
          series: [{
            name: '',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20, 36, 10, 10, 20]
          }]
        };
        //4.使用刚指定的配置项和数据显示图表。
        myChart3.setOption(option);
      },
      drawChart4() {
        //2. 基于准备好的dom，初始化echarts实例
        let myChart4 = this.$echarts.init(document.getElementById('main4'));
        //3. 指定图表的配置项和数据
        let option = {
          // legend: {
          //   data: ['Evaporation', 'Precipitation', 'Temperature']
          // },
          xAxis: [{
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow'
            }
          }],
          yAxis: [{
              type: 'value',
              name: 'Precipitation',
              min: 0,
              max: 250,
              interval: 50,
              axisLabel: {
                formatter: '{value} ml'
              }
            },
            {
              type: 'value',
              name: 'Temperature',
              min: 0,
              max: 25,
              interval: 5,
              axisLabel: {
                formatter: '{value} °C'
              }
            }
          ],
          series: [{
              name: 'Evaporation',
              type: 'bar',
              tooltip: {
                valueFormatter: function(value) {
                  return value + ' ml';
                }
              },
              data: [
                2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
              ]
            },
            {
              name: 'Precipitation',
              type: 'bar',
              tooltip: {
                valueFormatter: function(value) {
                  return value + ' ml';
                }
              },
              data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
              ]
            },
            {
              name: 'Temperature',
              type: 'line',
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: function(value) {
                  return value + ' °C';
                }
              },
              data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
          ]
        };
        //4.使用刚指定的配置项和数据显示图表。
        myChart4.setOption(option);
      },
      drawChart5() {
        //2. 基于准备好的dom，初始化echarts实例
        let myChart5 = this.$echarts.init(document.getElementById('main5'));
        //3. 指定图表的配置项和数据
        let option = {
          title: {
            text: ''
          },
          // legend: {
          //   data: ['小企业', '中小企业'],
          //   bottom:-10
          // },
          radar: {
            // shape: 'circle',
            indicator: [{
                name: '工贸'
              },
              {
                name: '有色'
              },
              {
                name: '建材'
              },
              {
                name: '机械'
              },
              {
                name: '轻工'
              },
              {
                name: '商贸'
              },
              {
                name: '烟草'
              },
              {
                name: '纺织'
              }
            ]
          },
          series: [{
            name: 'Budget vs spending',
            type: 'radar',
            data: [{
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: '小企业'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: '中小企业'
              }
            ]
          }]
        };
        //4.使用刚指定的配置项和数据显示图表。
        myChart5.setOption(option);
      },
      drawChart6() {
        //2. 基于准备好的dom，初始化echarts实例
        let myChart6 = this.$echarts.init(document.getElementById('main6'));
        //3. 指定图表的配置项和数据
        let option = {
          title: {
            text: ''
          },
          legend: {
            data: ['企事业', '政府机关']
          },
          radar: {
            // shape: 'circle',
            indicator: [{
                name: '总体预案'
              },
              {
                name: '专项预案'
              },
              {
                name: '部门预案'
              },
              {
                name: '综合预案'
              },
              {
                name: '专项预案'
              },
              {
                name: '现场处理'
              }
            ]
          },
          series: [{
            name: 'Budget vs spending',
            type: 'radar',
            data: [{
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: '小企业'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: '中小企业'
              }
            ]
          }]
        };
        //4.使用刚指定的配置项和数据显示图表。
        myChart6.setOption(option);
      },
      drawChart7() {
        //2. 基于准备好的dom，初始化echarts实例
        let myChart7 = this.$echarts.init(document.getElementById('main7'));
        //3. 指定图表的配置项和数据
        let option = {
          legend: {
            data: ['审核数', '备案数']
          },
          xAxis: [{
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow'
            }
          }],
          yAxis: [{
              type: 'value',
              name: '',
            },
            {
              type: 'value',
              name: '',
            }
          ],
          series: [{
              name: '审核数',
              type: 'bar',
              data: [
                2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
              ]
            },
            {
              name: '备案数',
              type: 'line',
              data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
          ]
        };
        //4.使用刚指定的配置项和数据显示图表。
        myChart7.setOption(option);
      },
      drawChart8() {
        //2. 基于准备好的dom，初始化echarts实例
        let myChart8 = this.$echarts.init(document.getElementById('main8'));
        //3. 指定图表的配置项和数据
        let option = {
          legend: {
            top: 5
          },
          xAxis: {},
          yAxis: {},
          series: [{
            name: '机关部门',
            symbolSize: 5,
            data: [
              [1.0, 12.04],
              [3.07, 13.95],
              [13.0, 24.58],
              [9.05, 31.81],
              [11.0, 51.33],
              [14.0, 18.66],
              [13.4, 16.81],
              [10.0, 26.33],
              [14.0, 18.96],
              [12.5, 16.82],
            ],
            type: 'scatter'
          }, {
            name: '企事业单位',
            symbolSize: 5,
            data: [
              [1.0, 5.04],
              [8.07, 1.95],
              [13.0, 2.58],
              [9.05, 3.81],
              [11.0, 5.33],
              [14.0, 8.66],
              [13.4, 6.81],
              [10.0, 10.33],
              [14.0, 12.96],
              [12.5, 16.82],
            ],
            type: 'scatter'
          }]
        };
        //4.使用刚指定的配置项和数据显示图表。
        myChart8.setOption(option);
      },
      drawChart9() {
        //2. 基于准备好的dom，初始化echarts实例
        let myChart9 = this.$echarts.init(document.getElementById('main9'));
        //3. 指定图表的配置项和数据
        let option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {},
          xAxis: {
            type: 'value',
          },
          yAxis: {
            type: 'category',
            data: ['评估报告受理', '备案审核', '预案审核']
          },
          series: [{
            name: '',
            type: 'bar',
            data: [1, 2, 3]
          }]
        };
        //4.使用刚指定的配置项和数据显示图表。
        myChart9.setOption(option);
      },
      drawChart10() {
        //2. 基于准备好的dom，初始化echarts实例
        let myChart10 = this.$echarts.init(document.getElementById('main10'));
        //3. 指定图表的配置项和数据
        let option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '0',
            left: 'center'
          },
          series: [{
            name: '数量',
            type: 'pie',
            radius: ['30%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [{
                value: 1048,
                name: '1000以上'
              },
              {
                value: 735,
                name: '500-999'
              },
              {
                value: 580,
                name: '300-499'
              },
              {
                value: 484,
                name: '0-299'
              }
            ]
          }]
        };
        //4.使用刚指定的配置项和数据显示图表。
        myChart10.setOption(option);
      },
    },
    mounted() {
      this.drawChart();
      this.drawChart2();
      this.drawChart3();
      this.drawChart4();
      this.drawChart5();
      this.drawChart6();
      this.drawChart7();
      this.drawChart8();
      this.drawChart9();
      this.drawChart10();
      this.echartObj = this.$echarts.init(document.getElementById(this.id));
      this.$echarts.registerMap('重庆', JSON);
      this.echartObj.setOption(this.getOptions(), true);
      // this.echartObj.on('legendselectchanged', params => {
      //   this.radioActive = Object.keys(this.radioList).filter(item => this.radioList[item] === params.name)[0];
      //   this.echartObj.clear();
      //   this.echartObj.setOption(this.getOptions());
      // });
      window.addEventListener('resize', () => {
        if (this.echartObj && this.echartObj.resize) {
          this.echartObj.resize();
        }
      });
    }
  }
</script>

<style lang="scss" scoped>
  .chart {
    display: flex;
    padding: 12px;
    justify-content: space-between;
    background-color: #658ccd !important;

    &-left {
      width: 22%;
      padding: 12px;
      background-color: rgba(211, 230, 255, .3);

      &-item {
        background-color: #fff;
        border-radius: 5px;
        padding: 12px 12px 0 12px;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .circle {
          padding: 10px 0;
          display: flex;
          align-items: center;
          justify-content: center;

          .el-progress__text {
            font-size: 10px !important;
          }
        }

        .title {
          color: #666;
          font-size: 13px;
        }

        .count {
          color: #666;
          font-size: 20px;
          font-weight: bold;
          margin-top: 5px;
        }
      }
    }

    &-content {
      width: 55%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      &-item {
        padding: 12px;
        margin-bottom: 12px;
        background-color: #fff;

        &:last-child {
          margin-bottom: 0;
        }

        .title {
          color: #666;
          font-size: 12px;
        }

        .count {
          color: #666;
          font-size: 20px;
          font-weight: bold;
          margin-top: 5px;
        }

        &-top {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          justify-content: space-between;

          .el-date-editor {
            width: 50%;
          }
        }
      }

      .s1 {
        width: 60%;
      }

      .s2 {
        width: 38%;
      }

      .s3 {
        width: 45%;
      }

      .s4 {
        width: 53%;
      }

      .s5 {
        width: 100%;
      }
    }

    &-right {
      width: 21%;
    }
  }

  p {
    margin: 0;
    padding: 0;
  }
</style>
