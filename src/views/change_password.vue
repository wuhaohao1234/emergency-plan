<!--修改密码-->
<template>
  <div id="changePassword">
    <el-dialog
      style="margin-top: 10%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :closable="false"
      title="修改密码"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="()=>this.dialogVisible=false">
      <el-alert
        title="您当前密码为系统初始密码，为保障账户信息安全请修改您的密码。"
        type="error"
        style="margin-bottom: 20px"
        show-icon>
      </el-alert>
      <el-form ref="form" :model="user" :rules="rules" label-width="80px">
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="logout">退 出</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {changePwd} from "@/api/system/user";

export default {
  name: "change_password",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: true,
      user: {
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        newPassword: [
          {required: true, message: "新密码不能为空", trigger: "blur"},
          {min: 8, max: 20, message: "长度在 8 到 20 个字符", trigger: "blur"},
          {
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[~!@#$%^&*()_+?])[0-9a-zA-Z~!@#$%^&*()_?]{8,20}$/,
            message: "新密码必须包含字母、数字、特殊字符",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {required: true, message: "确认密码不能为空", trigger: "blur"},
          {required: true, validator: equalToPassword, trigger: "blur"}
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          changePwd(this.user.newPassword).then(response => {
            sessionStorage.setItem('PW_NEED_CHANGE','false')
            this.$modal.msgSuccess("修改成功,请您重新登录");
            this.dialogVisible = false;
            this.$store.dispatch('LogOut').then(() => {
              location.href = '/index';
            })
          });
        }
      });
    },
    logout(){
      sessionStorage.setItem('PW_NEED_CHANGE','false')
      this.dialogVisible = false;
      this.$store.dispatch('LogOut').then(() => {
        location.href = '/index';
      })
    }
  }
}
</script>

<style scoped>

</style>
