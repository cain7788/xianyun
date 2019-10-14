<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha" ref="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="form.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
      <el-input placeholder="确认密码" type="password" v-model="form.checkPassword"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
import { async } from 'q';
export default {
  data() {
    // 自定义检验规则
    // 手机号校验
    var phoneCheck = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(this.form.username)) {
        return callback(new Error("手机格式不正确"));
      } else {
        callback();
      }
    };
    //   密码和确认密码
    var passwordCheck = (rule, value, callback) => {
        if(this.form.password !== this.form.checkPassword){
            return callback(new Error("两次输入密码不一致"))
        } else {
            callback()
        }
    };

    return {
      // 表单数据
      form: {
        username: "",
        password: "",
        captcha: "",
        nickname: "",
        checkPassword: ""
      },
      newCaptcha:"",
      // 表单规则
      rules: {
        username: [
          { required: true, message: "请输入用户手机号", trigger: "blur"},
          { validator: phoneCheck,trigger: "blur"}
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur"},
          { validator: passwordCheck,trigger: "blur"}
        ],
        checkPassword: [
          { required: true, trigger: "blur"},
          { validator: passwordCheck,trigger: "change"}
        ]
      }
    };
  },
  methods: {
    // 发送验证码
    async handleSendCaptcha() {
            
        // 发送验证码要先取到手机号，所以要保证用户已经填写了手机号
        if(!this.form.username){
            this.$message.error("手机号不能为空！")
            return;  //手机号为空的话直接停止执行
        }
        
        const res = await this.$store.dispatch("user/sendCaptcha",this.form.username)
        // const res = await this.$axios({
        //     url:"/captchas",
        //     method:"POST",
        //     data:{
        //         tel:this.form.username   // 将手机号码发送到服务器
        //     }
        // })

        const {code} = res.data
        if(code){
            this.$message.success("当前的手机验证码为"+ code)

            this.newCaptcha = code
        }
        

    },

    // 注册
    handleRegSubmit() {
    const {checkPassword,...props} = this.form
    this.$refs.form.validate(async valid =>{
        if(valid){
            // var res = await this.$axios({
            //     url:"/accounts/register",
            //     method:"POST",
            //     data:props
            // })
            // 调用封装在vuex中的方法发送注册请求
            const res = await this.$store.dispatch("user/register",props)

            if(res.status === 200){
                this.$message.success('注册成功')
                // 注册成功后自动登录并且跳转到首页上
                const data = res.data
                this.$store.commit("user/setUserInfo",data)
                this.$router.push('/')
            }
        }
    })
      
    }
  },

  watch:{
      newCaptcha(){
          this.form.captcha = this.newCaptcha
      }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>