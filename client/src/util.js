// 工具函数库

import config from './config'
// http 工具函数 获取数据
function request (url, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      method,
      data,
      success: function (res) {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          let msg = res.data.data.msg
          showModal('失败', msg?msg:'未知错误')
          reject(res.data)
        }
      }
    })
  })
}
export function get (url, data) {
  return request(url, 'GET', data)
}
export function post (url, data) {
  return request(url, 'POST', data)
}

// 界面 交互反馈
export function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}
export function showSuccess (text) {
  wx.showToast({
    title: text,
    icon: 'success'
  })
}

// 数据处理
// 获取当前周数
export function currentWeek (termBegin) {
  // 小心这里,termBegin假设是2018-09-03,那么得到的时间戳的时间是2018-09-03 08:00:00
  let timeDif = new Date().getTime() - new Date(termBegin).getTime();
  let weeks = timeDif / 604800000 + 1;
  if (timeDif < 0) {
      return 1;
  } else if (weeks > 20) {
      return 20;
  } else {
      return parseInt(weeks);
  }
}
// 处理周
function weeks(week) {
  ;
}
// 获取当前周课程表
export function getWeekSchedule (schedule, week = null) {
  if(week === null) return []
  if(!week) return []
  // console.log(schedule)
  let res = {};
  for (let i = 1; i <=7; i++) {
    res[i] = []
    for (let j = 1; j<=5; j++) {
      res[i][j] = []
      schedule[i][j].forEach(val => {
        let _week = val['time'].replace('周', '')
        _week = _week.split('-')
        if (_week.length == '1') {
          if (_week[0] == week)
            res[i][j]= val
        } else if (_week.length == '2') {
          if (_week[0] <= week && week <= _week[1]) {
            res[i][j] = val
          }
        } else {
          return []
        }
      });
    }
  }
  return res
}