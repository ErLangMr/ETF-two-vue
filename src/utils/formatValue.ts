export const formatValue = (value: any, unit?: string) => {
  if (value === null || value === undefined || value === 'NaN' || Number.isNaN(value)) {
    return '--';
  }
   // 如果是数字
   if (typeof value === 'number') {
    // 如果有 unit 且是 million 单位，先做单位转换
    if (unit === 'million') {
      value = value / 1000000;
    }

    // 判断是否是整数
    if (Number.isInteger(value)) {
      return value;
    } else {
      // 非整数，保留两位小数
      return value.toFixed(2);
    }
  }
  return value;
}

/**
 * 获取几个月前的日期字符串
 *
 * 该函数用于计算从今天起向前推算几个月的日期，并以字符串形式返回
 * 主要解决了在处理日期相关逻辑时的需求，例如数据分析、报告生成等场景
 *
 * @param num 表示向前推算的月数，例如1代表一个月前，2代表两个月前
 * @returns 返回格式为'YYYY-MM-DD'的日期字符串
 */
export const getMonthAgoDate = (num: number): string => {
  const today = new Date(); // 获取当前日期
  const oneMonthAgo = new Date(today); // 复制当前日期对象
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - num); // 减去个月

  const year = oneMonthAgo.getFullYear(); // 获取年份
  const month = String(oneMonthAgo.getMonth() + 1).padStart(2, '0'); // 获取月份并补零
  const day = String(oneMonthAgo.getDate()).padStart(2, '0'); // 获取日期并补零

  return `${year}-${month}-${day}`;
}

/**
 * 获取相对于今天指定年数前的日期字符串
 *
 * 该函数用于计算并返回从今天起向前推指定年数的日期它常用于需要显示或计算过去特定年份的日期的场景中
 * 例如，用于显示用户年龄、历史事件发生日期等
 *
 * @param num 向前推的年数这个参数允许调用者指定想要获取的过去年份的日期
 * @returns 返回格式为YYYY-MM-DD的日期字符串表示从今天起向前推指定年数的日期
 */
export const getYearAgoDate = (num: number): string => {
  const today = new Date(); // 获取当前日期
  const oneYearAgo = new Date(today); // 复制当前日期对象
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - num); // 减去一年

  const year = oneYearAgo.getFullYear(); // 获取年份
  const month = String(oneYearAgo.getMonth() + 1).padStart(2, '0'); // 获取月份并补零
  const day = String(oneYearAgo.getDate()).padStart(2, '0'); // 获取日期并补零

  return `${year}-${month}-${day}`;
}
