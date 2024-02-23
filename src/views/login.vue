<template>
  <div class="login">
    <div class="login-left">
      <vue-particles
        id="particles-js"
        color="#fff"
        :particleOpacity="0.7"
        :particlesNumber="100"
        shapeType="circle"
        :particleSize="4"
        linesColor="#fff"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="130"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
      <div class="login-left-content">
        <p>加强应急预案实战化管理</p>
        <p style="margin-left: 43%">提升防灾救灾智能化水平</p>
      </div>
    </div>
    <div class="login-right">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <img src="../assets/logo/logo.png" alt="" style="width: 100px;height: 60px">
        <h2 style="color: #198FFF">重庆市应急预案管理系统</h2>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
          >
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            show-password
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="captchaEnabled">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" alt=""/>
          </div>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:100%;margin-top: 20px;font-size: 17px;border-radius: 20px"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <div style="float: right;" v-if="register">
            <router-link class="link-type" :to="'/register'">立即注册</router-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {getCodeImg} from "@/api/login";
import Cookies from "js-cookie";
import {encrypt, decrypt} from '@/utils/jsencrypt';
export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: true,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          {required: true, trigger: "blur", message: "请输入您的账号"}
        ],
        password: [
          {required: true, trigger: "blur", message: "请输入您的密码"}
        ],
        code: [{required: true, trigger: "change", message: "请输入验证码"}]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
    sessionStorage.removeItem('BUSINESS_TYPE')
    sessionStorage.removeItem('ALL_MENU')
    sessionStorage.removeItem('PW_NEED_CHANGE')
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        if (res.code === 200 && res.data) {
          this.captchaEnabled = true
          this.codeUrl = "data:image/gif;base64," + res.data.img;
          this.loginForm.uuid = res.data.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, {expires: 30});
            Cookies.set("password", encrypt(this.loginForm.password), {expires: 30});
            Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 30});
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            //用户首次登录修改密码
            let changePW=sessionStorage.getItem('PW_NEED_CHANGE')
            if(changePW=='true'){
              this.$router.push({path: '/changePassword'})
            }else {
              this.$router.push({path: '/businessSelect'})
            }
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.login{
  height: 100%;
  display: flex;

  .login-left{
    position: relative;
    float: left;
    width: 70%;
    height: 100%;
    background-image: url("../assets/images/business-bg.png");
    background-size: 100% 100%;
    text-align: center;

    .login-left-content {
      color: #F9CA4F;
      font-size: 35px;
      margin-top: 12%;
      z-index: 1;
    }
  }
  #particles-js{
    margin-top: -30px;
    width: 100%;
    height: calc(100% - 100px);
    position: absolute;
    z-index: 1;
  }

  .login-right {
    float: left;
    width: 30%;
    height: 100%;
    text-align: center;

    .login-form{
      width: 80%;
      height: 60%;
      margin-top: 30%;
      margin-left: 10%;

      .el-input {
        height: 38px;

        input {
          height: 38px;
        }
      }

      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
        color: #198FFF;
      }

      .login-code {
        width: 33%;
        height: 38px;
        float: right;

        img {
          width: 100%;
          height: 100%;
          cursor: pointer;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
