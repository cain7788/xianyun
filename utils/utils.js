
/**
 * @desc  计算飞行相隔时间
 * @param {Array} dep_time 出发时间
 * @param {Array} arr_time 到达时间
 * @return 相隔时间的字符串
 */


export function computeTime(dep_time, arr_time) {
    // 如果传入的两个参数有一个为空的话则返回
    if(!dep_time || !arr_time) return
  // 先获取到两个时间
  // 通过split方法以：切割成一个数组
  const dep = dep_time.split(":");
  const arr = arr_time.split(":");

  // 将两个时间都转换成分钟的时间单位进行计算,注意，数组当中的每一项都是字符串，要转换成数值计算，但是乘法会自动转换成数值。
  let depVal = dep[0] * 60 + +dep[1]; // 出发时间
  let arrVal = arr[0] * 60 + +arr[1]; // 到达时间

  // 加入判断条件，如果从今天飞到了明天，则到达的分钟数会小于出发的分钟数
  if (depVal > arrVal) {
    arrVal += 1440;
  }
  const dis = arrVal - depVal; // 计算分钟差
  // dis / 6取得小时数，向下取整得整数，  dis % 6得到剩余的分钟数，return回这个字符串打印在页面上
  const time = `${Math.floor(dis / 60)}时${dis % 6}分`;
  return time;
}
