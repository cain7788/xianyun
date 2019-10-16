<template>
  <el-form
    :model="form"
    ref="form"
    :rules="rules"
    class="form"
    v-if="!$store.state.user.userInfo.token"
  >
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="handleLoginSubmit">登录</el-button>
  </el-form>

  <div v-else class="logined">
    <span class="login_tip">
      <img :src="$axios.defaults.baseURL + $store.state.user.userInfo.user.defaultAvatar" />
      <p>{{$store.state.user.userInfo.user.nickname}}</p>
      <em>您已登录...</em>
    </span>
    <p class="form-text">
      <nuxt-link to="#">切换子账号</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="handleLoginOut">退出登录</el-button>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校验规则，检查手机号码是否正确
    var phoneCheck = (rule, value, callback) => {
      if (!/^1[3456789]\d{9}$/.test(this.form.username)) {
        return callback(new Error("手机格式不正确"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        username: "",
        password: ""
      },
      // 表单规则
      rules: {
        username: [
          {
            required: true,
            message: "请输入手机号",
            validator: phoneCheck,
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入账号密码", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    handleLoginSubmit() {

      // 获取到表单数据并且进行验证（固定方法），传递一个参数为回调函数，这个回调函数会返回一个布尔类型的结果。
      this.$refs.form.validate(async valid => {
        // valid是表单验证的结果
        // 当返回的结果为true的时候进行操作

        if (valid) {

          // 调用封装的函数登录,调用这个方法会返回一个值，用变量res接收
          const res = await this.$store.dispatch("user/login",this.form)

          if (res.status === 200) {
          //   // 把用户信息token保存到本地，在头部组件中显示用户数据
          //   // 通过调用mutation下的方法掉修改state的值,commit方法调用mutation的方法
          //   // 非常类似于$emit
            // this.$store.commit("user/setUserInfo", data);
            this.$message.success("登录成功，正在跳转......");
            setTimeout(() => {
              this.$router.push("/");
            }, 1000);
          }
        }
      });
    },

    handleLoginOut(){
      this.$store.commit('user/setUserInfo',{})
      this.$message.success("账号登出成功")

      // this.$router.push('/user/login')
      // 如果是在页面操作的时候要求登陆,则登陆后应该是返回之前的页面
      this.$router.back('/')
    }
  }
  // computed:{
  //     nickname(){
  //       return this.$store.state.user.userInfo.user.nickname
  //     }
  // },

  // mounted() {
  //   // console.log(this.$store);
  // }
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
.logined {
  padding: 20px;
}
.login_tip {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img {
    width: 30%;
    // height: 30px;
    
  }
  em {
      margin-top: 10px;
      color: #409eff;
      font-size: 14px;
    }
}
</style>
