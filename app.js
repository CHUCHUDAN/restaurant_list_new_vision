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

//引入body-parser
const bodyParser = require('body-parser')

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

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

//設定種類資料
const typeArray = ['中東料理', '日本料理', '義式餐廳', '美式', '酒吧', '咖啡']

//設定路由

//首頁render mongodb資料
app.get('/', (req, res) => {
  Rest.find()
    .lean()
    .then(rests => res.render('index', {rests}))
    .catch(error => console.error(error))
})
//新增餐廳頁面
app.get('/rests/new', (req, res) => {
  res.render('new')
})
//新增餐廳功能
app.post('/rests', (req, res) => {
  const body = req.body
  const name = body.name
  const name_en = body.name_en 
  const category = body.category
  const image = body.image
  const location = body.location
  const phone = body.phone
  const google_map = body.google_map
  const rating = body.rating
  const description = body.description
  return Rest.create({name, name_en, category, image, location, phone, google_map, rating, description})
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
//餐廳詳細資料頁面
app.get('/rests/:id', (req, res) => {
  const id = req.params.id
  return Rest.findById(id)
    .lean()
    .then((rest) => res.render('show', { rest }))
    .catch(error => console.log(error))
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