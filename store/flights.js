export const state = () => {
    return {
        dataList: []
    }
}

export const mutations  = {

    setDataList(state,data){
        state.dataList = data;
    }
}