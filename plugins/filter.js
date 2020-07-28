import Vue from 'vue'
const moment = require('moment-timezone')
// filter date
Vue.filter('formatUnix', function (value) {
  if (value) {
    return moment
      .tz(value * 1000, 'Asia/Ho_Chi_Minh')
      .format('DD/MM/YYYY hh:mm:ss')
  }
})
