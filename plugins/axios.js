import {Message} from "element-ui";

// context是nuxt下的所有方法，其中包含了$axios的方法
export default (context) => {
    
    // 调用$axios的方法进行拦截
    context.$axios.onError(res=>{
        // res是错误的对象, Error的对象可以通过response获取详细信息
        // console.log(res);
        // res.response 是原生js中的方法
        const {message, statusCode} = res.response.data;

                if(statusCode === 400){
                    Message.warning(message)
                }
            
    })
}


// import { Message } from 'element-ui';

// // nuxt插件的固定写法
// // context包含nuxt下所有的方法，固定有的参数
// export default (context) => {
//     // 拦截错误的响应信息， 根以前项目的中main.js中拦截器不一样.
//     // main.js中拦截器: 拦截所有的请求响应
//     // 当前的拦截只拦截错误,如果请求错误就会执行onError中的函数
//     context.$axios.onError(res => {
//         // res是错误的对象, Error的对象可以通过response获取详细信息
//         const {message, statusCode} = res.response.data;

//         if(statusCode === 400){
//             Message.error(message)
//         }
//     })
// }

// export default function({$axios, redirect}){
//     $axios.onError(err => {
//         const {statusCode, message} = err.response.data;
        
//         // 还未使用
//         // if(statusCode === 401 || statusCode === 403){
//         //     Message.warning({message: "请先登录"});
//         //     redirect("/user/login");
//         // }

//         if(statusCode === 400){
//             Message.warning({message});
//         }
//     })
// }