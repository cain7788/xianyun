<template>
  <div class="aside">
    <div class="air-info">
      <el-row type="flex" justify="space-between" class="info-top">
        <div>{{data.dep_date}}</div>
        <div>{{data.org_city_name}} - {{data.dst_city_name}}</div>
      </el-row>
      <el-row type="flex" justify="space-between" align="middle" class="info-step">
        <el-col :span="5" class="flight-airport">
          <strong>{{data.dep_time}}</strong>
          <span>{{data.org_airport_name}}{{data.org_airport_quay}}</span>
        </el-col>
        <el-col :span="14" class="flight-time">
          <span>--- {{rankTime}} ---</span>
          <span>{{data.airline_name}}{{data.flight_no}}</span>
        </el-col>
        <el-col :span="5" class="flight-airport">
          <strong>{{data.arr_time}}</strong>
          <span>{{data.dst_airport_name}} {{data.dst_airport_quay}}</span>
        </el-col>
      </el-row>
    </div>
    <el-row type="flex" justify="space-between" class="info-bar">
      <span>订单总价</span>
      <span>金额</span>
      <span>数量</span>
    </el-row>
    <el-row type="flex" justify="space-between" class="info-bar">
      <span>成人机票</span>
      <span>￥{{data.seat_infos.settle_price}}</span>
      <span>x1</span>
    </el-row>
    <el-row type="flex" justify="space-between" class="info-bar">
      <span>机建＋燃油</span>
      <span>¥{{data.airport_tax_audlet}}/人/单程</span>
      <span>x1</span>
    </el-row>
    <el-row type="flex" justify="space-between" align="middle" class="info-bar">
      <span>应付总额：</span>
      <span class="price">￥{{allPrice}}</span>
    </el-row>
  </div>
</template>

<script>
export default {
    props:{
        // 总金额
        allPrice: {
            type: Number,
            default: 0
        }
    },
//   props: {
//     data: {
//       type: Object,
//       default: {},
//       seat_infos: {}
//     }
//     // infoData: {},
//     // rankTime: ""
//   },
  data() {
    return {
      data: {
        seat_infos: {},
      },
      allPrice:0,
    };
  },
    computed:{
    //   当添加乘机人的时候计算总费用
      allPrice(){
        // 保险总价
        // 循环过滤得出选中保险的金额
        var insurancePrice = 0
        this.insurances.forEach(v=>{
            switch (v) {
            // 第一项是"航空意外险"
			case 1 : insurancePrice += this.details.insurances[0].price
            break;
            // 第二项是"航空延误险"
            case 2 : insurancePrice += this.details.insurances[1].price
            }
        })
        //   机票总价格
          const price = this.users.length * (+this.details.base_price + insurancePrice)
        //   console.log(price);
          this.$store.commit("order/saveAllPrice",price)
          return price
      }
  },

  mounted() {
    this.allPrice = this.$store.state.order.allPrice
    console.log(this.allPrice);
    
    // query中包含了id和seat_xid
    const { query } = this.$route;
    this.$axios({
      url: `airs/${query.id}`,
      params: {
        seat_xid: query.seat_xid
      }
    }).then(res => {
      this.data = res.data;
    });
  },

  computed: {
    rankTime() {
      // 数据还未请求回来
      if (!this.data.dep_time) return "";

      // 转化为分钟
      const dep = this.data.dep_time.split(":");
      const arr = this.data.arr_time.split(":");
      const depVal = dep[0] * 60 + +dep[1];
      const arrVal = arr[0] * 60 + +arr[1];

      // 到达时间相减得到分钟
      let dis = arrVal - depVal;

      // 如果是第二天凌晨时间段，需要加24小时
      if (dis < 0) {
        dis = arrVal + 24 * 60 - depVal;
      }

      // 得到相差时间
      return `${Math.floor(dis / 60)}时${dis % 60}分`;
    }
  }
};
</script>

<style scoped lang="less">
/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}

.air-info {
  padding: 15px;

  .info-top {
    margin-bottom: 10px;
    > div:last-child {
      font-size: 14px;
    }
  }

  .info-step {
    .flight-airport {
      strong {
        display: block;
        font-size: 22px;
        font-weight: normal;
      }

      span {
        font-size: 12px;
        color: #999;
      }
    }

    .flight-time {
      text-align: center;
      font-size: 12px;
      color: #999;
      span {
        display: block;
      }
    }
  }
}

.info-bar {
  border-top: 1px #ddd dashed;
  padding: 10px 15px;
  font-size: 14px;
  color: #666;

  .price {
    font-size: 28px;
    color: orange;
  }
}
</style>