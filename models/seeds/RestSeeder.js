//引入mongoose
const mongoose = require('mongoose')

//引入rest model
const Rest = require('../rest')

//引入json檔案
const restaurantList = require('../../restaurant.json')

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
  restaurantList.results.forEach(element => {
    Rest.create({
      id: `${element.id}`,
      name: `${element.name}`,
      name_en: `${element.name_en}`,
      category: `${element.category}`,
      image: `${element.image}`,
      location: `${element.location}`,
      phone: `${element.phone}`,
      google_map: `${element.google_map}`,
      rating: `${element.rating}`,
      description: `${element.description}`
    })
  })
})