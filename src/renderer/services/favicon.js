import cheerio from 'cheerio'
import got from 'got'
import request from 'xhr-request'
import urlUtil from 'url'

/**
 * Favicon Class
 */
export default class {
  constructor (url) {
    this.url = url
  }

  /**
   * Find Favicon from Html Response
   * @param  String url
   * @param  Object response
   */
  findFaviconHTML (url, response) {
    const dom = cheerio.load(response)
    let link = dom('link[rel="icon"], link[rel="shortcut icon"], link[rel="Shortcut Icon"]').last().attr('href')
    if (link && !link.match(/^http/)) {
      link = urlUtil.resolve(url, link)
    }
    return link
  }

  /**
   * Discover Image Type
   * @param  Buffer buffer
   */
  discoverImageType (buffer) {
    if (buffer.length < 5) {
      return null
    }

    if (buffer.readUInt16LE(0) === 0 && buffer.readUInt16LE(2) === 1) {
      return 'ico'
    }

    if (buffer.slice(1, 4).toString() === 'PNG') {
      return 'png'
    }

    if (buffer.slice(0, 3).toString() === 'GIF') {
      return 'gif'
    }

    return null
  }

  async init () {
    const response = await got(this.url, { retries: 0 })
    const faviconUrl = this.findFaviconHTML(this.url, response.body)
    if (faviconUrl) {
      request(faviconUrl, {
        responseType: 'arraybuffer'
      }, (err, data) => {
        if (err) throw err
        const buf = Buffer.alloc(new Uint8Array(data))
        const imageType = this.discoverImageType(buf)
        if (imageType) {
          return {
            bytes: buf,
            format: imageType
          }
        }
      })
    }
    return null
  }
}
