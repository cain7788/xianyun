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
        <el-select size="mini" v-model="filters.airport" placeholder="起飞机场" clearable>
          <el-option
            v-for="(item,index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="filters.flightTimes" placeholder="起飞时间" clearable>
          <el-option
            v-for="(item,index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="filters.company" placeholder="航空公司" clearable>
          <el-option
            v-for="(item,index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="filters.airSize" placeholder="机型" clearable>
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
      filters: {
        airport: "", // 机场
        flightTimes: "", // 出发时间
        company: "", // 航空公司
        airSize: "" // 机型大小
      },

      sizeOptions: [
        { size: "L", name: "大" },
        { size: "M", name: "中" },
        { size: "S", name: "小" }
      ]

      // condition: {
      //   airport:{name:"org_airport_name",value:""}, // 机场
      //   flightTimes: {name:"dep_time",value:[]}, // 出发时间
      //   company:{name:"airline_name",value:""}, // 航空公司
      //   airSize: {name:"plane_size",value:""} // 机型大小
      // }
    };
  },

  mounted() {},
  watch: {
    filters: {
      deep: true,
      handler() {
        console.log(this.filters);

        // 要统一实现四个条件的过滤
        // 开关思想：先假设所有的数据都符合条件，在筛选出不符合条件的数据
        var arr = this.data.flights.filter(v => {
          // 首先假设所有的数据都是符合条件的
          var valid = true;

          // 执行思路：判断当前这条数据。  先判断筛选条件是否存在，再判断这个值是否等于当前数据中对应的值，如果不相等，则
          // valid为false，则当天这条数据不会添加到arr当中
          // 判断机场
          if (
            this.filters.airport &&
            this.filters.airport !== v.org_airport_name
          ) {
            valid = false;
          }

          // 判断时间
          if (this.filters.flightTimes) {
            const start = +v.dep_time.split(":")[0];
            const arr = this.filters.flightTimes.split(",");
            if (start < +arr[0] || start >= +arr[1]) {
              valid = false;
            }
          }

          // 判断航空公司
          if (this.filters.company && this.filters.company !== v.airline_name) {
            valid = false;
          }

          // 判断机型
          if (this.filters.airSize && this.filters.airSize !== v.plane_size) {
            valid = false;
          }

          return valid;
        });

        this.$emit("setDataList", arr);
      }
    }
  },
  methods: {
    // 撤销条件时候触发
    handleFiltersCancel() {
      this.airport = "";
      this.flightTimes = "";
      this.company = "";
      this.airSize = "";
      this.$emit("setDataList", false);
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