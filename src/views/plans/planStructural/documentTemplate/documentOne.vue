<!--文书模板一 <森林火情信息报告> -->
<template>
  <div id="documentOne">
    <div class="top-content">
      <div class="header-title title content-center ">森林火情信息报告</div>
      <p class="content-center text-font">
        <el-input style="width: 10%" v-model="issue" placeholder="请输入"></el-input>
      </p>
      <div class="header-content text-font">
        <span>{{ $store.state.user.deptName }}</span>
        <span class="datetime">{{ nowTime }}</span>
      </div>
      <hr>
    </div>
    <p class="second-title content-center title">
      <el-input style="width: 50%" v-model="secondTitle" placeholder="请输入"></el-input>
    </p>
    <div class="bottom">
      <h3>一、基本情况</h3>
      <p class="text-font">
        <el-input style="width: 200px" v-model="occurrenceTime" placeholder="请输入"></el-input>
        ，重庆市北碚区
        <el-input style="width: 180px" v-model="towns" placeholder="请输入"></el-input>
        乡
        <el-input style="width: 180px" v-model="villages" placeholder="请输入"></el-input>
        村
        <el-input style="width: 180px" v-model="position" placeholder="请输入"></el-input>
        方位
        发生森林火情。火场植被为
        <el-input style="width: 180px" v-model="vegetation" placeholder="（荒草、灌木、树种等）"></el-input>
        。
        火场天气
        <el-input style="width: 180px" v-model="weather" placeholder="（晴、多云、阴、雨）"></el-input>
        ，
        风向
        <el-input style="width: 180px" v-model="windDirection" placeholder="请输入"></el-input>
        ，
        风力
        <el-input style="width: 180px" v-model="windPower" placeholder="请输入"></el-input>
        级，
        温度
        <el-input style="width: 180px" v-model="temperature" placeholder="请输入"></el-input>
        ℃。
      </p>
      <h3>二、处置情况</h3>
      <p class="text-font p-end">
        目前，
        <el-input style="width: 180px" v-model="rescueRanks" placeholder="请输入"></el-input>
        队伍
        <el-input style="width: 180px" v-model="rescuePeople" placeholder="请输入"></el-input>
        人
        正在进行扑救，调集
        <el-input style="width: 180px" v-model="reinforceRanks" placeholder="请输入"></el-input>
        队伍
        <el-input style="width: 180px" v-model="reinforcePeople" placeholder="请输入"></el-input>
        人赶赴现场增援。
        火场火势
        <el-input style="width: 250px" v-model="fireIntensity" placeholder="（平稳、较弱、中等、较强、剧烈）"></el-input>
        ，
        向
        <el-input style="width: 180px" v-model="direction" placeholder="（东、南、西、北）"></el-input>
        方向发展，
        蔓延速度较
        <el-input style="width: 180px" v-model="speed" placeholder="（快、慢）"></el-input>
        ，
        目前
        <el-input style="width: 180px" v-model="whether" placeholder="（已经、没有）"></el-input>
        得到控制。
        预估过火面积
        <el-input style="width: 180px" v-model="area" placeholder="请输入"></el-input>
        公顷。
      </p>
      <p class="text-font p-start">
        市长胡衡华15603193066常务副市长陈鸣波18903199989重庆市森防办主任汪绍敏13932979527（重庆市森防办副主任谭益军13722908666）为扑火指挥。</p>
      <h3>三、其它情况</h3>
      <p class="text-font">
        火场周边
        <el-input style="width: 180px" v-model="have" placeholder="（有、无）"></el-input>
        重要目标、军事设置及居民区。
      </p>
    </div>
    <hr>
  </div>
</template>

<script>
import {parseTime} from "../../../../utils/ruoyi";
export default {
  name: "documentOne",
  props: {
    contentData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      issue: new Date().getFullYear() + '第1期',
      nowTime: parseTime(new Date(), '{y}年{m}月{d}日{h}时{i}分'),
      secondTitle: '重庆市北培区森林火情报告',
      occurrenceTime: parseTime(new Date(), '{y}年{m}月{d}日{h}时{i}分'),
      towns: '',
      villages: '',
      position: '',
      vegetation: '',
      weather: '',
      windDirection: '',
      windPower: '',
      temperature: '',
      rescueRanks: '',
      rescuePeople: '',
      reinforceRanks: '',
      reinforcePeople: '',
      fireIntensity: '',
      direction: '',
      speed: '',
      whether: '',
      area: '',
      have: ''
    }
  },
  watch: {
    contentData: {
      handler(newVal,oldVal){
        this.getData(newVal)
      },
      deep:true,
      immediate:true
    }
  },
  mounted() {
    // 每隔60秒执行一次
    setInterval(() => {
      this.nowTime = parseTime(new Date(), '{y}年{m}月{d}日{h}时{i}分')
    }, 60000);
  },
  methods: {
    saveHandle() {
      let arr = [this.issue, this.nowTime, this.secondTitle, this.occurrenceTime, this.towns, this.villages,
        this.position, this.vegetation, this.weather, this.windDirection, this.windPower, this.temperature,
        this.rescueRanks, this.rescuePeople, this.reinforceRanks, this.reinforcePeople,
        this.fireIntensity, this.direction, this.speed, this.whether, this.area, this.have, this.$store.state.user.deptName]
      this.$emit('saveTemp', arr)
    },
    getData(data) {
      if (data && data.length) {
        this.issue = data[0];
        this.secondTitle = data[2];
        this.occurrenceTime = data[3];
        this.towns = data[4];
        this.villages = data[5];
        this.position = data[6];
        this.vegetation = data[7];
        this.weather = data[8];
        this.windDirection = data[9];
        this.windPower = data[10];
        this.temperature = data[11];
        this.rescueRanks = data[12];
        this.rescuePeople = data[13];
        this.reinforceRanks = data[14];
        this.reinforcePeople = data[15];
        this.fireIntensity = data[16];
        this.direction = data[17];
        this.speed = data[18];
        this.whether = data[19];
        this.area = data[20];
        this.have = data[21];
      } else {
        Object.assign(this.$data, this.$options.data())
      }
    }


  }
}
</script>

<style scoped lang="scss">
#documentOne {
  padding: 10px 30px 10px 30px;

  hr {
    background-color: red;
    height: 3px;
  }

  .content-center {
    text-align: center;
  }

  .title {
    font-family: FZShuTi, sans-serif;
  }

  .text-font {
    font-family: STFangsong, sans-serif;
    font-size: 20px;
  }

  .top-content {
    .header-title {
      font-size: 45px;
      color: red;
    }

    .header-content {
      padding: 0 20px;
    }

    .datetime {
      float: right;
    }
  }

  .second-title {
    font-size: 35px;
  }

  .bottom {
    margin-bottom: 40px;

    .p-end {
      margin-block-end: 0;
    }

    .p-start {
      margin-block-start: 0;
    }

    h3 {
      margin-left: 20px;
      line-height: 0.3;
    }

    p {
      text-indent: 40px;
      line-height: 38px;
    }

    .el-input {
      text-indent: 0;
    }
  }
}
</style>
