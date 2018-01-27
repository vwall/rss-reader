import jetpack from 'fs-jetpack'
import fs from 'fs'
import DataStore from 'nedb'
import { remote } from 'electron'

export default class {
  constructor () {
    this.db = null
    this.useDataDir = jetpack.cwd(remote.app.getPath('userData'))
  }

  createOrReadDatabase (dbname) {
    const checkArticle = fs.existsSync(this.useDataDir.path(dbname.article))
    const checkFeed = fs.existsSync(this.useDataDir.path(dbname.feed))
    const articleData = fs.readFileSync(this.useDataDir.path(dbname.article))
    const feedData = fs.readFileSync(this.useDataDir.path(dbname.feed))
    const database = {}

    if (!checkArticle && !checkFeed) {
      this.useDataDir.write(dbname.article)
      this.useDataDir.write(dbname.feed)
    }

    if (!articleData && !feedData) {
      return
    }

    database.article = new DataStore({
      filename: this.useDataDir.path(dbname.article),
      autoload: true
    })
    database.feed = new DataStore({
      filename: this.useDataDir.path(dbname.feed),
      autoload: true
    })

    return database
  }

  init () {
    if (this.db) {
      return this.db
    }
    this.db = this.createOrReadDatabase({
      'article': 'articles.db',
      'feed': 'feeds.db'
    })
    return this.db
  }
}
