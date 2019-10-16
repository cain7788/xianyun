<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div>
          <FlightsFilters :data="flightsListCopy" @setDataList="setDataList" />
        </div>

        <!-- 航班头部布局 -->
        <div>
          <div v-if="flightsList.flights.length === 0 && !loading" class="no_flights">该航班暂无数据</div>
          <FlightsListHead v-else />
        </div>

        <!-- 航班信息 -->
        <div>
          <FlightsItem v-for="(item,index) in dataList" :key="index" :item="item" />
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="flightsListCopy.flights.length"
            ></el-pagination>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside @reload="reload"/>
      </div>
    </el-row>
  </section>
</template>

<script>
import moment from "moment";
import FlightsListHead from "@/components/air/flightsListHead.vue";
import FlightsItem from "@/components/air/flightsItem.vue";
import FlightsFilters from "@/components/air/flightsFilters.vue";
import FlightsAside from "@/components/air/flightsAside.vue";

export default {
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  data() {
    return {
      flightsListCopy: {
        flights: [],
        info: {},
        options: []
      },
      flightsList: {
        flights: [],
        info: {},
        options: []
      },
      pageIndex: 1,
      pageSize: 5,
      loading: true
    };
  },

  computed: {
    dataList() {
      const arr = this.flightsList.flights.slice(
        (this.pageIndex - 1) * this.pageSize,
        this.pageIndex * this.pageSize
      );
      return arr;
    }
  },

  mounted() {
    this.getData();

  },
  // 当路由改变的时候重新加载页面
  watch:{
    $route(){
      this.getData()
    }
  },

  methods: {
    getData() {
      this.$axios({
        url: "/airs",
        params: this.$route.query
      }).then(res => {
        const data = res.data;
        this.flightsList = data;
        this.flightsListCopy = { ...data };
        // 请求完毕后则显示页面
        this.loading = false;
      });
    },

    // 当清空历史记录后传回的方法调用刷新
    reload(){
      this.getData()
    },
    //   当切换每页显示总条数的时候触发
    handleSizeChange(val) {
      this.pageSize = val;
    },

    // 当页面页码改变的时候触发
    handleCurrentChange(val) {
      this.pageIndex = val;
    },

    // 接收筛选组件传回来的新数组，更换当前获取到的数组进行渲染刷新
    setDataList(arr) {
      console.log(arr);
      if (!arr) {
        this.flightsList = { ...this.flightsListCopy };
        return;
      }
      // 航班信息数组更换,数组长度重新计算
      this.flightsList.flights = arr;
      // this.flightsList.flights = this.$store.state.flights.dataList
      // 更换后默认显示第一页
      this.pageIndex = 1;

      //   // 再次更新分页显示的数据
      //   this.dataList = this.flightsList.flights.slice(
      //     (this.pageIndex - 1) * this.pageSize,
      //     this.pageIndex * this.pageSize
      //   );
    }
  }
};
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}

.no_flights {
  width: 100%;
  padding: 20px;
  text-align: center;
  color: #aaa;
}
</style>