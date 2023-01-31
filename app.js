//引入express框架
const express = require('express')
const app = express()
//設定埠號
const port = 3000
//引入handlebars
const exphbs = require('express-handlebars')
//引入json檔案
const restaurantList = require('./restaurant.json')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

//設定種類資料
const typeArray = ['中東料理', '日本料理', '義式餐廳', '美式', '酒吧', '咖啡']

//設定路由
app.get('/', (req, res) => {

  res.render('index', { restaurants: restaurantList.results })
})
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(item => item.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})
app.get('/search', (req, res) => {
  if (typeArray.some(item => item.toLowerCase().includes(req.query.keyword.toLowerCase()))) {
    const types = restaurantList.results.filter(item => item.category.toLowerCase().includes(req.query.keyword.toLowerCase()))
    res.render('index', { restaurants: types, keyword: req.query.keyword })
  } else {
    const restaurantArray = restaurantList.results.filter(item => item.name.toLowerCase().includes(req.query.keyword.toLowerCase()))
    res.render('index', { restaurants: restaurantArray, keyword: req.query.keyword })
  }
})
//啟動並監聽伺服器
app.listen(port, () => {
  console.log(`The web is Listen on http://localhost:${port}`)
})