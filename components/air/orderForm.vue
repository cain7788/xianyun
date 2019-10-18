<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>

      <!-- 循环遍历添加乘机人 -->
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item,index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in details.insurances" :key="index">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"
            border
            @change="handleChange(item)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
        <input type="hidden" :value="allPrice">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      details: {
        seat_infos:[],
      },
      // 保险信息
      insurances: [],
      // 用户信息
      users: [
        {
          username: "",
          id: ""
        }
      ],
      // 联系人手机号
      contactPhone: "",
      // 联系人名字
      contactName: "",
      // 是否需要发票
      invoice: true,
      // 手机验证码
      captcha: ""
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
          const price = this.users.length * (+this.details.seat_infos.org_settle_price + insurancePrice + this.details.airport_tax_audlet)
        //   console.log(price);
        // 将数据传递给父组件
          this.$emit("setAllPrice", price)
          return price
      }
  },

  mounted() {
    // query中包含了id和seat_xid
    const { query } = this.$route;
    this.$axios({
      url: `airs/${query.id}`,
      params: {
        seat_xid: query.seat_xid
      }
    }).then(res => {
        
        this.details = res.data;
        console.log(this.details);
        //   获取到数据之后将数据保存在vuex中
        this.$store.commit("order/setOrderForm",this.details)
    });
  },

  methods: {
    // 添加乘机人
    handleAddUsers() {
      // 当点击添加乘机人的时候相当于在users数组中添加多一对象,包含username和id
      this.users.push({
        username: "",
        id: ""
      });
    },

    // 移除乘机人
    handleDeleteUser(index) {
      // 直接删除掉数组当中的一项
      this.users.splice(index, 1);
    },

    // 点击改变保险选中状态,通过保险类型的id处理,通过查询提交订单详情的接口可以知道,保险信息提交的是一个数组,里面包含id就可以了
    handleChange(item) {
      const id = item.id;
      // 先判断当前的选框是否被选中了,判断条件是看是否存在对应的id,indexof会返回查询到的索引值
      const index = this.insurances.indexOf(id);
      // 判断如果index是存在的话
      if (index > -1) {
        // 存在的时候要将它删除
        this.insurances.splice(index, 1);
      } else {
        // 不存在的时候要添加进去
        this.insurances.push(id);
      }
    },

    // 发送手机验证码
    async handleSendCaptcha() {
      // 先判断输入的手机号是否为空
      if (!this.contactPhone) {
        this.$message.error("手机号不能为空！");
        return; //手机号为空的话直接停止执行
      }
      // 调用vuex中封装好的方法,传入手机号
      // 将返回的数据用res接收
      const res = await this.$store.dispatch(
        "user/sendCaptcha",
        this.contactPhone
      );
      // console.log(res);

      // 将返回的验证码打印出来
      this.$message.success("本次验证码为:" + res.data.code);
      // 将请求回来的验证码直接打印到验证码输入框当中
      this.captcha = res.data.code;
    },

    // 提交订单
    handleSubmit() {
        
      // 先将传入的数据整理好
      const data = {
        insurances: this.insurances,
        users: this.users,
        contactPhone: this.contactPhone,
        contactName: this.contactName,
        invoice: this.invoice,
        captcha: this.captcha,
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id
      };

      //   点击提交后提示正在提交跳转支付页面
      this.$message({
        message: "正在生成订单！请稍等",
        type: "success"
      });


      this.$axios({
        url: "/airorders",
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        },
        data
      })
        .then(res => {
          console.log(res);

          this.$router.push("/air/pay");
        })
        .catch(err => {
          const { message } = err.response.data;
          // 警告提示
          this.$confirm(message, "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "warning"
          });
        });
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>