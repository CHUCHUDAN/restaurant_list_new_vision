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

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

//設定路由

//首頁render mongodb資料
app.get('/', (req, res) => {
  Rest.find()
    .lean()
    .then(rests => res.render('index', { rests }))
    .catch(error => console.error(error))
})
//新增餐廳頁面
app.get('/rests/new', (req, res) => {
  res.render('new')
})
//新增餐廳資料功能
app.post('/rests', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Rest.create({ name, name_en, category, image, location, phone, google_map, rating, description })
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

//編輯餐廳資料頁面
app.get('/rests/:id/edit', (req, res) => {
  const id = req.params.id
  return Rest.findById(id)
    .lean()
    .then((rest) => res.render('edit', { rest }))
    .catch(error => console.log(error))
})
//編輯餐廳資料功能
app.post('/rests/:id/edit', (req, res) => {
  const id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Rest.findById(id)
    .then((rest) => {
      [rest.name, rest.name_en, rest.category, rest.image, rest.location, rest.phone, rest.google_map, rest.rating, rest.description] = [name, name_en, category, image, location, phone, google_map, rating, description]
      return rest.save()
    })
    .then(() => res.redirect(`/rests/${id}`))
    .catch(error => console.log(error))
})
//刪除功能
app.post('/rests/:id/delete', (req, res) => {
  const id = req.params.id
  return Rest.findById(id)
    .then((rest) => rest.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//搜尋功能
app.get('/search', (req, res) => {
  Rest.find()
    .lean()
    .then((rests) => {
      if (!req.query.keyword) {
        return res.redirect('/')
      }
      const keywords = req.query.keyword
      const keyword = req.query.keyword.trim().toLowerCase()
      const searchResultArray = rests.filter(data => data.name.toLowerCase().includes(keyword) || data.category.toLowerCase().includes(keyword) || data.name_en.toLowerCase().includes(keyword))

      if (searchResultArray.length === 0) {
        return res.render('noresult', {keywords})
      }else {
        return res.render('index', {rests: searchResultArray, keywords})
      }
    })
})
//啟動並監聽伺服器
app.listen(port, () => {
  console.log(`The web is Listen on http://localhost:${port}`)
})