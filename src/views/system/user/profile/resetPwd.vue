<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    :before-close="cancel">
    <el-form ref="form" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password/>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password/>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
  </span>
  </el-dialog>

</template>

<script>
import {updateUserPwd} from "@/api/system/user";

export default {
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
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          {required: true, message: "旧密码不能为空", trigger: "blur"}
        ],
        newPassword: [
          {required: true, message: "新密码不能为空", trigger: "blur"},
          {min: 8, max: 20, message: "长度在 8 到 20 个字符", trigger: "blur"},
          {pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[~!@#$%^&*()_+?])[0-9a-zA-Z~!@#$%^&*()_?]{8,20}$/, message: "新密码必须包含字母、数字、特殊字符", trigger: "blur"}
        ],
        confirmPassword: [
          {required: true, message: "确认密码不能为空", trigger: "blur"},
          {required: true, validator: equalToPassword, trigger: "blur"}
        ]
      }
    };
  },
  methods: {
    init(){
      this.dialogVisible=true;
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.dialogVisible=false;
          });
        }
      });
    },
    cancel(){
      this.$refs["form"].resetFields();
      this.dialogVisible=false;
    }
  }
};
</script>
