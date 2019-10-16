<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          v-model="form.departCity"
          @blur="handleBlur('depart')"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
          v-model="form.destCity"
          @blur="handleBlur('dest')"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          v-model="form.departDate"
          @change="handleDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      form: {
        departCity: "", //出发城市（注意没有市字）
        departCode: "", //出发城市代码
        destCity: "", //到达城市（注意没有市字）
        destCode: "", //到达城市代码
        departDate: "" //出发日期
      },

      cities: []
    };
  },
  methods: {
    // tab切换时触发 "换"
    handleSearchTab(item, index) {
      if (index === 1) {
        this.$alert("目前不支持往返", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    },

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表（传递的参数是一个数组）
    // 数组中的元素必须是一个对象，对象中必须要有value属性
    queryDepartSearch(value, cb) {
      // 在输入出发城市之前先判断输入框是否有值，主要是停止当输入框为空的时候不断请求造成卡顿和错误
      if (!value) {
        this.cities = [];
        cb([]); // 回调函数的函数是数组，让它为空
        return;
      }

      this.$axios({
        url: "/airs/city?name=" + value
      }).then(res => {
        const { data } = res.data;

        // 获取到的data是一个数组，但是返回的数据当中并没有value这个属性
        // map方法return返回的是数组中的每一项
        const newData = data.map(v => {
          v.value = v.name.replace("市", "");
          return v;
        });
        // 将更新后的数组保存在本地当中,方便后面调用数据
        this.cities = newData;
        // 执行回调函数打印出推荐的城市
        cb(newData);
      });
    },

    // 出发城市下拉选择时触发，点击的时候应该将城市名字和城市代码写入到本地data中，将上面请求回来的城市名字和代码保存起来，在这里调用
    handleDepartSelect(item) {
      // console.log(item);
      // 传入的item是弹出的推荐词的数组中，点击选中的那一项，是上面newData中的一项
      this.form.departCity = item.value;
      this.form.departCode = item.sort;
      // console.log(this.form);
    },

    // 如果用户输入后不选择下拉框中的推荐关键词，则要对输入框中的值进行处理
    // 传入的参数是对应本地data中的输入框的名字，由此来判断调用的是哪一个输入框
    handleBlur(type) {
      // 当失去焦点的时候，选中下拉框的第一个
      // 先判断下拉框的数组是否为空
      if (this.cities.length === 0) return;
      // this.form.departCity = this.cities[0].value
      // this.form.departCode = this.cities[0].sort
      // 将type加入进去
      this.form[type + "City"] = this.cities[0].value;
      this.form[type + "Code"] = this.cities[0].sort;
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      // 因为目的地输入框的时间处理和出发地的一样，可以直接调用上面的方法，但是要注意传入的参数要改变
      this.queryDepartSearch(value, cb);
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      // 和出发城市的一样，只是数值要改一下
      this.form.destCity = item.value;
      this.form.destCode = item.sort;
    },

    // 确认选择日期时触发
    handleDate(value) {
      // 将获取到的value时间转换成正常的格式后赋值给本地data中的时间
      this.form.departDate = moment(value).format("YYYY-MM-DD");
    },

    // 触发和目标城市切换时触发
    handleReverse() {
      // 实现效果：将出发地和目的地对应的两个值都分别互换
      // 先将data中的数据提取出来，不然直接调换会出错
      const { departCity, departCode, destCity, destCode } = this.form;
      this.form.departCity = destCity;
      this.form.departCode = destCode;
      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },

    // 提交表单是触发
    handleSubmit() {
      //    在提交之前要对输入框进行判断，各项值是否为空
      // 自定义规则
      const rules = {
        // 定义错误信息和输入框的值
        departCity: { message: "请输入出发城市", value: this.form.departCity },
        destCity: { message: "请输入目的地城市", value: this.form.destCity },
        departDate: { message: "请输入出发日期", value: this.form.departDate }
      };
      // 利用开关思想进行判断
      let valid = true;

      // 遍历rules这个对象，判断其中每一项的value是否为空即可,Object.keys(rules)可以将rules转成数组

      Object.keys(rules).forEach(v => {
        // 当数组当中任一一项value为空，即valid为false的时候，就停止
        if (!valid) return;

        // 将每一项中的message和value解构出来
        const { message, value } = rules[v]; // 在这里的rules还是一个对象，并没有转成数组
        if (!value) {
          this.$message.error(message);
          // 当其中一项的value为空的时候，valid改为false
          valid = false;
        }
      });

      if (!valid) return;

      // 提交表单的时候将数据保存到本地当中，以便调取渲染侧边栏渲染历史记录
      this.$store.commit("flights/setSearchForm",this.form)

      //    通过push传递对象的方法，将一组参数传进地址栏当中
       this.$router.push({
           path:"/air/flights",
           query:this.form
       })
    }
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
