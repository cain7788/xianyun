<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->
        <div>
          <FlightsListHead />
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
              :total="flightsList.flights.length"
            ></el-pagination>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import moment from "moment";
import FlightsListHead from "@/components/air/flightsListHead.vue";
import FlightsItem from "@/components/air/flightsItem.vue";

export default {
  components: {
    FlightsListHead,
    FlightsItem
  },
  data() {
    return {
      flightsList: {
          flights: []
      },
      pageIndex: 1,
      pageSize: 5,
    };
  },

  computed:{
      dataList(){
          const arr = this.flightsList.flights.slice(
              (this.pageIndex - 1) * this.pageSize,
              this.pageIndex * this.pageSize,
          )
          return arr
      }
  },

  mounted() {
    // console.log(this.$route.query);

    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      console.log(res);
      const data = res.data;
      this.flightsList = data;

    // 获得总数据条数
    // this.dataList.slice(0,pageSize)
    });
  },

  methods:{
    //   当切换每页显示总条数的时候触发
      handleSizeChange(val){
          this.pageSize = val
      },

    // 当页面页码改变的时候触发
      handleCurrentChange(val){
          this.pageIndex = val
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
</style>