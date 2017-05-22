const Deque = require('double-ended-queue')

class RateLimit {
  constructor(allowedRequests, seconds) {
    this.allowedRequests = allowedRequests
    this.seconds = seconds
    this.madeRequests = new Deque()
    this.buffer = this.seconds * 50
  }

  _reload() {
    const t = (new Date()).getTime()

    while (this.madeRequests.length > 0 && t - this.madeRequests.peekFront() >= this.buffer)
      this.madeRequests.shift()
  }

  addRequest() {
    this.madeRequests.push((new Date()).getTime() + this.seconds*1000)
  }

  requestAvailable() {
    this._reload()
    return this.madeRequests.length < this.allowedRequests
  }
}

export default RateLimit