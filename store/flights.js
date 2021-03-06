export const state = () => {
  return {
    dataList: [],
    searchForm: []
  };
};

export const mutations = {
  // 航班信息渲染数据
  setDataList(state, data) {
    state.dataList = data;
  },

  // 搜索历史记录添加
  setSearchForm(state, data) {
    // 往数组当中添加数据
    state.searchForm.unshift(data);
  },

  delSearchForm(state, data){
    // 直接将数据清空
    state.searchForm = []
  }
};
