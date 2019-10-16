<template>
    <div class="aside">
        <div class="statement">
            <el-row type="flex" justify="space-between" class="statement-list">
                <el-col :span="8">
                    <i class="iconfont iconweibiaoti-_huabanfuben" style="color:#409EFF;"></i>
                    <span>航协认证</span>
                </el-col>
                <el-col :span="8">
                    <i class="iconfont iconbaozheng" style="color:green;"></i>
                    <span>出行保证</span>
                </el-col>
                <el-col :span="8">
                    <i class="iconfont icondianhua" style="color:#409EFF;"></i>
                    <span>7x24</span>
                </el-col>
            </el-row>
            <p class="service-tel">
                免费客服电话：4006345678转2
            </p>
        </div>

        <!-- 天气预报 -->

        <el-row class="weather">
            <table>
                <caption>{{citys}}天气实况</caption>
                <tbody>
                    <tr>
                        <td rowspan="4" width="40%">
                            <div class="icon"><img :src="`${searchInfo.Icon}`" width="60"/></div>
                            <p class="title">{{searchInfo.dayTemp}}℃ {{searchInfo.weather}}</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-left" width="60%">
                            <p>{{searchInfo.wind}}</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-left">
                            <p>相对湿度：{{searchInfo.humidity}}%</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-left">
                            <p>空气质量(pm2.5)：<span class="level-2">{{searchInfo.pm25}}</span></p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-row>

        <div class="history">
            <div class="history_header">
                <h5>历史查询</h5>
                <span @click="handleDetHistory">清空历史</span>
            </div>
                
                <el-row type="flex" 
                justify="space-between" 
                align="middle"
                class="history-item"
                v-for="(item,index) in $store.state.flights.searchForm" 
                :key="index"
                 v-if="`${$store.state.flights.searchForm}`">
                    <div class="air-info">
                        <div class="to-from">{{item.departCity}} - {{item.destCity}}</div>
                        <p>{{item.departDate}}</p>
                    </div>
                    <nuxt-link :to="`/air/flights?departCity=${item.departCity}&departCode=${item.departCode}&destCity=${item.destCity}&destCode=${item.destCode}&departDate=${item.departDate}`">
                    <span>选择</span>
                    </nuxt-link>
                </el-row>
                <div class="nohistory" v-else>
                    暂无历史记录
                </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            searchForm:[],
            searchInfo:{},
            citys:"",
            }
        },
    

    mounted(){
        // 取到本地当中的历史搜索信息
        this.searchForm = this.$store.state.flights.searchForm

        // 获取到地址栏中的数据
        this.searchInfo = this.$route.query
        // console.log(this.searchInfo);

        // 请求回天气数据

        this.$axios({
            url:"http://api.ip138.com/weather/?code=440100&token=14be5f462053edbd27a1fe6243cccea4",
        }).then(res=>{
            const {data} = res.data

            const {city} = {...res.data}
            this.citys = city
            this.searchInfo = data
            // console.log(this.searchInfo.data);

        })
        
        
    },

    methods:{
        // 点击删除历史记录
        handleDetHistory(){
            // 调用vuex方法删除掉vuex中的数据
            this.$store.commit("flights/delSearchForm",null)
            this.$emit("reload")
        }
    }

}
</script>

<style scoped lang="less">
.statement{
    border:1px #ddd solid;

    .statement-list{
        padding: 10px 0;
        > div{
            text-align: center;
            i{
                display: block;
                font-size: 40px;
            }
            span{
                font-size:12px;
            }
        }
    }
    .service-tel{
        height: 32px;
        line-height: 32px;
        padding:0 10px;
        background: #f6f6f6;
        font-size: 14px;
    }
}

.history{
    border:1px #ddd solid;
    padding:10px;
    margin-top:10px;
    .history_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        border-bottom:1px #eee solid;
        span {
            font-size: 14px;
            color: #666;
            cursor: pointer;
        }
        h5{
        font-size: 16px;
        font-weight: normal;
        
    }
    }
    

    .history-item{
        padding:10px 0;
        font-size: 14px;
        border-bottom: 1px #eee solid;

        &:last-child{
            border:none;
        }

        .to-from{
            margin-bottom: 5px;
        }

        p{
            font-size: 12px;
            color:#666;
        }

        span{
            color:#fff;
            display: block;
            padding:2px 10px;
            background: orange;
            border-radius: 4px;
            font-size:12px;
            cursor: pointer;
        }
    }
}

// 天气模块样式
.weather {
    padding: 5px;
    background-color: rgb(247, 247, 247);
    font-size: 14px;
    color: rgb(78, 162, 196);
    margin-top: 10px;
}
</style>