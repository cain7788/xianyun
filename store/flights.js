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
    if (state.searchForm === []) {
        state.searchForm = data
    }
    state.searchForm.push(data);
  }
};
