const axios = require('axios')


const request = axios.create({
  baseURL: 'https://backend.xiaoqing.xyz/api',
})

request.interceptors.response.use((res) => {
    const {data, msg, code} = res.data
    if (code === 200) {
      return data
    }
    // console.log(data)
  },
  error => {

  }
)

module.exports = request
