<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <div style="text-align: center">
          <img src="@/assets/images/avatar.png"/>
        </div>
      </el-col>
      <el-col :span="18">
        <ul class="list-group list-group-striped">
          <li class="list-group-item">
            <svg-icon icon-class="user"/>&emsp;用户账号
            <div class="user-info">{{ user.userName }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="documentation"/>&emsp;用户名称
            <div class="user-info">{{ user.nickName }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="phone"/>&emsp;手机号码
            <div class="user-info">{{ user.phoneNumber }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="tree"/>&emsp;所属部门
            <div class="user-info">{{ user.deptName }}</div>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <ul class="list-group list-group-striped">
          <li class="list-group-item">
            <svg-icon icon-class="post"/>&emsp;用户岗位
            <div class="user-info">{{ user.postName }}</div>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="peoples"/>&emsp;用户角色
            <el-tag style="margin-left: 5px" v-for="item in user.roles" :key="item.roleId">{{ item.roleName }}</el-tag>
          </li>
          <li class="list-group-item">
            <svg-icon icon-class="date"/>&emsp;创建日期
            <div class="user-info">{{ user.createTime }}</div>
            <el-button type="warning" size="mini" style="margin-left: 30px" @click="resetPwdHandle">修改密码</el-button>
          </li>
        </ul>
      </el-col>
    </el-row>
    <resetPwd v-if="resetPwdVisible" ref="resetPwd"></resetPwd>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import {getUserProfile} from "@/api/system/user";

export default {
  name: "Profile",
  components: {userAvatar, userInfo, resetPwd},
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo",
      resetPwdVisible: false
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    },
    //修改密码
    resetPwdHandle() {
     this.resetPwdVisible=true;
     this.$nextTick(()=>{
       this.$refs.resetPwd.init();
     })
    }
  }
};
</script>
<style scoped>
.user-info {
  display: inline-block;
  margin-left: 20px;
}
</style>
