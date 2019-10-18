<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select
          size="mini"
          v-model="airport"
          placeholder="起飞机场"
          @change="handleAirport"
          clearable
        >
          <el-option
            v-for="(item,index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          size="mini"
          v-model="flightTimes"
          placeholder="起飞时间"
          @change="handleFlightTimes"
          clearable
        >
          <el-option
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select
          size="mini"
          v-model="company"
          placeholder="航空公司"
          @change="handleCompany"
          clearable
        >
          <el-option
            v-for="(item,index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize" clearable>
          <el-option
            v-for="(item,index) in sizeOptions"
            :key="index"
            :label="item.name"
            :value="item.size"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {},
      flights: {},
      info: {},
      options: {
        airport: [],
        company: [],
        flightTimes: []
      }
    }
  },

  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", // 机型大小
      sizeOptions: [
        { size: "L", name: "大" },
        { size: "M", name: "中" },
        { size: "S", name: "小" }
      ],
      newCondition:{
        org_airport_name: "", // 机场
        dep_time: [], // 出发时间
        airline_name: "", // 航空公司
        plane_size: "", // 机型大小
      },
    };
  },
  mounted() {},
  watch:{
    newCondition:{
      deep:true,
      handler:function(){

      var obj = {}
      for(var key in this.newCondition){
        console.log(key,this.newCondition[key]);
        obj={...obj,key:this.newCondition.key}
        // if(this.newCondition[key]){
        //     obj={...obj,key:this.newCondition.key}
        // }
      }
      console.log(obj);
      

        // if(this.dep_time === []){

        // } else {
        //   const [from, to] = this.dep_time.split(",");

        //   const timeArr = this.data.flights.filter(v => {
        //     const start = +v.dep_time.split(":")[0];
        //     return start >= from && start < to;
        //   });
        //   // timeArr是已经通过时间筛选过后的数组数据
        // }
          


        // const arr = this.newCondition.filter(item => {
        //   // v中有四项数据org_airport_name，airline_name
          
          

        //   return 

        // })
        
      }
    }
  },
  methods: {
    // 选择机场时候触发
    handleAirport(value) {
        if(!value){
          this.newCondition.org_airport_name = ""
          return
        }
        this.newCondition.org_airport_name = value
        console.log("机场",this.newCondition);
      // if (!value) {
      //   this.$emit("setDataList",false);
      //   return;
      // }
      // // 循环遍历传过来的航班信息列表，找到机场相同的航班信息存储在新的数组当中，最后将这个数组返回给父组件，替换掉要渲染的数组
      // const arr = this.data.flights.filter(v => {
      //   // 将以下满足条件的每一项存储到新的数组（arr）当中
      //   return v.org_airport_name === value;
      // });
      // // 将数据通过$emit传给父组件
      // this.$emit("setDataList", arr);
    },

    // 选择出发时间时候触发
    handleFlightTimes(value) {
      if(!value){
          return
        }
        this.newCondition.dep_time = value

      if (!value) {
        this.$emit("setDataList",false);
        return;
      }
      // console.log(value); // [6.12]
      // 将value中的两个时间解构出来
      const [from, to] = value.split(",");

      const arr = this.data.flights.filter(v => {
        const start = +v.dep_time.split(":")[0];
        return start >= from && start < to;
      });
      this.$emit("setDataList", arr);
    },

    // 选择航空公司时候触发
    handleCompany(value) {
      if(!value){
          this.newCondition.airline_name = ""
          return
        }
        this.newCondition.airline_name = value
        console.log("公司",this.newCondition);
    //  if (!value) {
    //     this.$emit("setDataList",false);
    //     return;
    //   }

    //   // 利用相同的方法将航空公司的数据进行筛选，选出新数组传给父组件
    //   const arr = this.data.flights.filter(v => {
    //     // 将以下满足条件的每一项存储到新的数组（arr）当中
    //     return v.airline_name === value;
    //   });
    //   // 将数据通过$emit传给父组件
    //   this.$emit("setDataList", arr);
    },

    // 选择机型时候触发
    handleAirSize(value) {
      if(!value){
          this.newCondition.plane_size = ""
          return
        }
        this.newCondition.plane_size = value
        console.log("机型",this.newCondition);
      // if (!value) {
      //   this.$emit("setDataList",false);
      //   return;
      // }
      // // 利用相同的方法将航空公司的数据进行筛选，选出新数组传给父组件
      // const arr = this.data.flights.filter(v => {
      //   // 将以下满足条件的每一项存储到新的数组（arr）当中
      //   return v.plane_size === value;
      // });
      // console.log(arr);

      // // 将数据通过$emit传给父组件
      // this.$emit("setDataList", arr);
    },

    // 撤销条件时候触发
    handleFiltersCancel() {
        this.airport=""
        this.flightTimes=""
        this.company=""
        this.airSize=""
        this.$emit("setDataList",false);
    }
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>