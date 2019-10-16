<template>
    <div class="flight-item" @click="isShow =!isShow ">
        <div >
            <!-- 显示的机票信息 -->
            <el-row type="flex" align="middle" class="flight-info">
                <el-col :span="6">
                    <span>{{item.airline_name}} </span> {{item.flight_no}}
                </el-col>
                <el-col :span="12">
                    <el-row type="flex" justify="space-between" class="flight-info-center">
                        <el-col :span="8" class="flight-airport">
                            <strong>{{item.dep_time}}</strong>
                            <span>{{item.org_airport_name}} {{item.org_airport_quay}}</span>
                        </el-col>
                        <el-col :span="8" class="flight-time">
                            <span>{{rankTime}}</span>
                        </el-col>
                        <el-col :span="8" class="flight-airport">
                            <strong>{{item.arr_time}}</strong>
                            <span>{{item.dst_airport_name}} {{item.dst_airport_quay}}</span>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6" class="flight-info-right">
                    ￥<span class="sell-price">{{item.base_price}}</span>起
                </el-col>
            </el-row>
        </div>
        <div class="flight-recommend" 
        v-if="isShow"
        v-for="(seat,index) in item.seat_infos"
        :key="index" 
        >
            <!-- 隐藏的座位信息列表 -->
            <el-row type="flex"  justify="space-between" align="middle"  >
                <el-col :span="4">低价推荐</el-col>
                <el-col :span="20">
                    <el-row type="flex" justify="space-between" align="middle" class="flight-sell">
                        <el-col :span="16" class="flight-sell-left">
                            <span>{{seat.group_name}}</span> | {{seat.supplierName}}
                        </el-col>
                        <el-col :span="5" class="price">
                            ￥{{seat.org_settle_price}}
                        </el-col>
                        <el-col :span="3" class="choose-button">
                            <nuxt-link :to="`/air/order?id=${item.id}&seat_xid=${seat.seat_xid}`">
                            <el-button 
                            type="warning" 
                            size="mini">
                            选定
                            </el-button>
                            </nuxt-link>
                            <p>剩余：{{seat.discount}}</p>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {

    props: {
        // 数据
        item: {
            type: Object,
            // 默认是空数组
            default: {}
        }
    },

    data(){
        return {
            isShow:false,
        }
    },
    computed:{
        // 计算时间差
        rankTime(){
            // 先获取到两个时间
            // 通过split方法以：切割成一个数组
            const dep = this.item.dep_time.split(":");
            const arr = this.item.arr_time.split(":")

            // 将两个时间都转换成分钟的时间单位进行计算,注意，数组当中的每一项都是字符串，要转换成数值计算，但是乘法会自动转换成数值。
            let depVal = dep[0] * 60 + (+dep[1])    // 出发时间
            let arrVal = arr[0] * 60 + (+arr[1])   // 到达时间
            
            // 加入判断条件，如果从今天飞到了明天，则到达的分钟数会小于出发的分钟数
            if(depVal > arrVal){
                arrVal += 1440
            }
            const dis = arrVal - depVal         // 计算分钟差
            // dis / 6取得小时数，向下取整得整数，  dis % 6得到剩余的分钟数，return回这个字符串打印在页面上
            return `${Math.floor(dis / 60)}时${dis % 6}分`     
        }
    },

    methods:{

    }
}
</script>

<style scoped lang="less">
    .flight-item{
        border:1px #ddd solid;
        margin-bottom: 10px;

        .flight-info{
            padding:15px;
            cursor: pointer;

            > div{
                &:first-child, &:last-child{
                    text-align: center;
                }
            }
        }

        .flight-info-center{
            padding:0 30px;
            text-align: center;

            .flight-airport{
                strong{
                    display: block;
                    font-size:24px;
                    font-weight: normal;
                }
                span{
                    font-size: 12px;
                    color:#999;
                }
            }

            .flight-time{
                span{
                    display: inline-block;
                    padding:10px 0;
                    border-bottom: 1px #eee solid;
                    color:#999;
                }
            }
        }

        .flight-info-right{
            
            .sell-price{
                font-size: 24px;
                color:orange;
                margin:0 2px;
            }
        }
    }

    .flight-recommend{
        background: #f6f6f6;
        border-top:1px #eee solid;
        padding:0 20px;

        .flight-sell{
            border-bottom:1px #eee solid;
            padding:10px 0;

            &:last-child{
                border-bottom: none;
            }

            .flight-sell-left{
                font-size: 12px;
                span{
                    color:green;
                }
            } 

            .price{
                font-size: 20px;
                color:orange;
            }

            .choose-button{
                text-align: center;
                color:#666;
                button{
                    display: block;
                    width:100%;
                    margin-bottom:5px;
                }
            }
        }
    }
</style>