<template>
  <div class="container">
    <script src="/QrCode.js"></script>
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥{{order.price | numFilter}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码，调用Qrcode插件的html代码 -->
            <!-- <canvas id="qrcode-stage"></canvas> -->
            <!-- 第二种方法 -->
            <div id="qrcode"></div>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// import QrCode from "qrcode";
export default {
  data() {
    return {
      order: 0,
      timer: null
    };
  },
  mounted() {
    // 将vuex中的机票总价获取到,使用vuex取机票价格的方法
    // this.allPrice = this.$store.state.order.allPrice;
    const { id } = this.$route.query;
    // vuex中的信息存储调用都是需要时间的，而渲染数据的速度大于读取的速度就会导致取到的数据为undefined
    // 所以要使用定时器给获取数据过程一点时间
    setTimeout(async () => {
      const res = await this.$axios({
        url: "/airorders/" + id,
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      });
      // 结果中的payInfo字段就是付款链接，需要根据链接生成二维码
      this.order = res.data;

      // 第一种：将二维码渲染出来：需要调用二维码生成的插件。
      //   const canvas = document.querySelector("#qrcode-stage");
      //   QrCode.toCanvas(canvas, this.order.payInfo.code_url, {
      //     width: 200
      //   });

      // 第二种获取到数据后将链接生成二维码
      new QRCode(
        document.getElementById("qrcode"),
        this.order.payInfo.code_url
      );

      //   查询支付情况:需要每隔几秒自动请求，通过返回的res判断用户是否已经付款
      // 添加定时器
      this.timer = setInterval(async () => {
        const res = await this.$axios({
          url: "/airorders/checkpay",
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
          },
          data: {
            id: this.$route.query.id,
            nonce_str: this.order.price,
            out_trade_no: this.order.orderNo
          }
        });

        // 请求完毕后，判断支付状态
        // 获取到返回的提示
        const { statusTxt } = res.data;
        if (statusTxt === "支付完成") {
          // 支付成功之后停止定时器
          this.$message.success(statusTxt);
          clearInterval(this.timer);
        }
      }, 3000);

    }, 20);
  },

  // 当我们离开这个页面的时候，便会调用这个函数(结束生命周期)
  // 组件销毁时候使用的，一般情况下用于清除定时器
  destroyed() {
    // 结束生命周期的时候停止定时器
    clearInterval(this.timer);
  },

  filters: {
    numFilter(value) {
      // 截取当前数据到小数点后两位
      return parseFloat(value).toFixed(2);
    }
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>