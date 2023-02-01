//引入express框架
const express = require('express')
const app = express()

//設定埠號
const port = 3000

//引入handlebars
const exphbs = require('express-handlebars')

//引入rest
const Rest = require('./models/rest.js')

//引入mongoose
const mongoose = require('mongoose')

//引入json檔案
const restaurantList = require('./restaurant.json')

//如果是非正式環境，引入dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//運用mongoose跟mongodb連線
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//取得資料連線狀態
const db = mongoose.connection
//連線異常
db.on('error', () => {
  console.log('Mongodb error!')
})
//連線成功
db.once('open', () => {
  console.log('Mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main' , extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(express.static('public'))

//設定種類資料
const typeArray = ['中東料理', '日本料理', '義式餐廳', '美式', '酒吧', '咖啡']

//設定路由
app.get('/', (req, res) => {
  Rest.find()
    .lean()
    .then(rests => res.render('index', {rests}))
    .catch(error => console.error(error))
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