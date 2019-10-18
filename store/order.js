export const state = () => {
    return {
        // 订单详情页面数据
        orderForm:{},
        allPrice:0,
    };
  };
  
  export const mutations = {
    // 存储订单详情的数据
    setOrderForm(state, data) {
      state.orderForm = data;
    },

    // 保存飞行耗时
    saveAllPrice(state, price){
        state.allPrice = price;
    }

  };
  