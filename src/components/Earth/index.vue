<script>
import Earth from "3d-earth";
export default {
  name: "index",
  data() {
    return {};
  },
  mounted() {
    const cityList = {
      "北京": { name: "北京", longitude: 116.3, latitude: 39.9 },
      "上海": { name: "上海", longitude: 121.0, latitude: 31.0 },
      "西安": { name: "西安", longitude: 108.0, latitude: 34.0 },
      "成都": { name: "成都", longitude: 103.0, latitude: 31.0 },
      "重庆": { name: "重庆", longitude: 106.55, latitude: 29.56 },
      "乌鲁木齐": { name: "乌鲁木齐", longitude: 87.0, latitude: 43.0 },
      "拉萨": { name: "拉萨", longitude: 91.06, latitude: 29.36 },
      "广州": { name: "广州", longitude: 113.0, latitude: 23.06 },
      "哈尔滨": { name: "哈尔滨", longitude: 127.0, latitude: 45.5 },
      "沈阳": { name: "沈阳", longitude: 123.43, latitude: 41.8 },
      "武汉": { name: "武汉", longitude: 114.0, latitude: 30.0 },
      "海口": { name: "海口", longitude: 110.0, latitude: 20.03 },
      "纽约": { name: "纽约", longitude: -74.5, latitude: 40.5 },
      "伦敦": { name: "伦敦", longitude: 0.1, latitude: 51.3 },
      "巴黎": { name: "巴黎", longitude: 2.2, latitude: 48.5 },
      "开普敦": { name: "开普敦", longitude: 18.25, latitude: -33.5 },
      "悉尼": { name: "悉尼", longitude: 151.1, latitude: -33.51 },
      "东京": { name: "东京", longitude: 139.69, latitude: 35.69 },
      "里约热内卢": { name: "里约热内卢", longitude: -43.11, latitude: -22.54 },
    };

    //城市之间的连线，可以定义颜色（数据来自业务系统）
    const bizLines = [
      {
        from: "北京",
        to: [
          "上海",
          "西安",
          "成都",
          "重庆",
          "乌鲁木齐",
          "拉萨",
          "广州",
          "哈尔滨",
          "沈阳",
          "武汉",
          "海口",
          "纽约",
          "伦敦",
          "巴黎",
          "开普敦",
          "悉尼",
          "东京",
          "里约热内卢",
        ],
        color: `#51C0F4`,
      },
      {
        from: "上海",
        to: [
          "北京",
          "上海",
          "西安",
          "成都",
          "重庆",
          "乌鲁木齐",
          "拉萨",
          "广州",
          "哈尔滨",
          "沈阳",
          "武汉",
          "海口",
          "纽约",
          "伦敦",
          "巴黎",
          "开普敦",
          "悉尼",
          "东京",
          "里约热内卢",
        ],
        color: `#0F307B`,
      },
      {
        from: "重庆",
        to: [
          "北京",
          "上海",
          "西安",
          "成都",
          "重庆",
          "乌鲁木齐",
          "拉萨",
          "广州",
          "哈尔滨",
          "沈阳",
          "武汉",
          "海口",
          "纽约",
          "伦敦",
          "巴黎",
          "开普敦",
          "悉尼",
          "东京",
          "里约热内卢",
        ],
        color: `#0F307B`,
      },
      {
        from: "西安",
        to: ["北京", "上海", "成都", "广州", "乌鲁木齐", "海口"],
        color: `#51C0F4`,
      },
      {
        from: "成都",
        to: ["北京", "上海", "广州", "武汉", "海口", "纽约", "悉尼"],
        color: `#51C0F4`,
      },
      {
        from: "乌鲁木齐",
        to: ["北京", "上海", "西安"],
        color: `#51C0F4`,
      },
      {
        from: "广州",
        to: [
          "北京",
          "上海",
          "成都",
          "拉萨",
          "武汉",
          "海口",
          "纽约",
          "伦敦",
          "巴黎",
          "悉尼",
          "东京",
          "里约热内卢",
        ],
        color: `#51C0F4`,
      },
      { from: "哈尔滨", to: ["北京", "沈阳"], color: `#51C0F4` },
      { from: "沈阳", to: ["北京", "哈尔滨"], color: `#51C0F4` },
      {
        from: "海口",
        to: ["北京", "上海", "成都", "广州"],
        color: `#51C0F4`,
      },
      {
        from: "纽约",
        to: ["北京", "上海", "成都", "广州"],
        color: `#51C0F4`,
      },
      {
        from: "伦敦",
        to: ["北京", "上海", "广州"],
        color: `#51C0F4`,
      },
      {
        from: "巴黎",
        to: ["北京", "上海", "广州"],
        color: `#51C0F4`,
      },
      { from: "开普敦", to: ["北京", "上海"], color: `#51C0F4` },
      {
        from: "悉尼",
        to: ["北京", "上海", "成都", "广州"],
        color: `#51C0F4`,
      },
      {
        from: "东京",
        to: ["北京", "上海", "广州"],
        color: `#51C0F4`,
      },
      {
        from: "里约热内卢",
        to: ["北京", "上海", "广州"],
        color: `#51C0F4`,
      },
    ];

    let e = new Earth("container",cityList,bizLines,{
      autoRotate:true,
      zoomChina:false,
      starBackground: true,
      resolution: 2048, // 设置分辨率
      center: [106.55, 29.56], // 设置地球的中心为重庆的经度和纬度
      zoom: 2, // 设置初始缩放级别（可以根据需要调整）
    });
    e.load()
  }
}
</script>

<template>
  <div class="hello" id="container">

  </div>
</template>

<style scoped lang="scss">
.hello{
  width: 700px;
  height: 80vh;
  opacity: 0.8;
}
</style>
