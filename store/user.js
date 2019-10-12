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
export const actions = {}