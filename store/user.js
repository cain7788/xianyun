
export const state = () => {
    return {
        userInfo: {}
    }
}

export const mutations  = {
    // mutaion下的值必须是一个函数，函数中会有一个固定的参数state，第二个参数是用户调用方法时候传进来
    // data是登录成功后返回的对象数据
    setUserInfo(state,data){
        // 将上面收取的state的数据userInfo更改
        state.userInfo = data;
    }
}

// 存放的是异步修改state的方法
export const actions = {
    // 将登录功能封装,第一个参数store是固定的（调用的方法），第二个参数是传入的数据,根据在登录页中使用的async和await，要在定义函数之前加上async
    async login(store,data){
        var res = await this.$axios({
            url: "/accounts/login",
            method: "POST",
            data
          });

        //   后续操作只写必要的，不是每一个登录操作要执行的在调用方法的地方执行就可以了，
          if (res.status === 200) {

            store.commit("setUserInfo", res.data);
           
          }
        //   将res返回，以便后续操作
          return res
    },


    // 封装发送验证码的方法
    sendCaptcha(store,data){
        const res = this.$axios({
            url:"/captchas",
            method:"POST",
            data:{
                tel:data   // 将手机号码发送到服务器
            }
        })
        
        return res
    },

    // 封装注册功能
    register(store,data){
        var res = this.$axios({
                url:"/accounts/register",
                method:"POST",
                data
        })

        return res
    }
}