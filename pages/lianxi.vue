<template>
  <div style="padding:20px;">
      <div class="tap">
          <span 
          v-for="(item,index) in ['新闻','体育','娱乐',]" 
          :key="index"
          @click="handleClick(index)"
          :class="{active:current === index}"
          >{{item}}</span>
      </div>
      <div v-if="current === 0">
          <p>2019年诺贝尔和平奖揭晓 埃塞俄比亚总理获奖</p>
          <p>2019年诺贝尔和平奖揭晓 埃塞俄比亚总理获奖</p>
          <p>2019年诺贝尔和平奖揭晓 埃塞俄比亚总理获奖</p>
          <p>2019年诺贝尔和平奖揭晓 埃塞俄比亚总理获奖</p>
      </div>
      <div v-if="current === 1">
          <p>世预赛-杨旭4球武磊传射艾克森破门 国足7-0关岛</p>
          <p>世预赛-杨旭4球武磊传射艾克森破门 国足7-0关岛</p>
          <p>世预赛-杨旭4球武磊传射艾克森破门 国足7-0关岛</p>
          <p>世预赛-杨旭4球武磊传射艾克森破门 国足7-0关岛</p>
          
      </div>
      <div v-if="current === 2">
          <p>说声恭喜？曝黄渤喜得爱子 育有两个女儿生活幸福</p>
          <p>说声恭喜？曝黄渤喜得爱子 育有两个女儿生活幸福</p>
          <p>说声恭喜？曝黄渤喜得爱子 育有两个女儿生活幸福</p>
          <p>说声恭喜？曝黄渤喜得爱子 育有两个女儿生活幸福</p>
          
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            options:[],
            current:0,
        }
    },

    methods:{
        handleClick(index){
            this.current = index
        }
    }
}
</script>

<style lang="less" scoped>
    .tap {
        padding: 20px;

       span{
           padding: 5px;
           border: 1px #ddd solid;
           margin-right: 15px;
           cursor:pointer;
       }

       .active {
           border: 1px solid red;
           color: red;
       }
    }
</style>