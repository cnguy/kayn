// @flow
// $FlowFixMe
const Deque = require('double-ended-queue')

class RateLimit {
  allowedRequests: number
  seconds: number
  madeRequests: Deque<number>
  buffer: number

  constructor(allowedRequests: number, seconds: number) {
    this.allowedRequests = allowedRequests
    this.seconds = seconds
    this.madeRequests = new Deque()
    this.buffer = this.seconds * 50
  }

  _reload(): void {
    const t = (new Date()).getTime()

    while (this.madeRequests.length > 0 && t - this.madeRequests.peekFront() >= this.buffer)
      this.madeRequests.shift()
  }

  addRequest(): void {
    this.madeRequests.push((new Date()).getTime() + this.seconds*1000)
  }

  requestAvailable(): boolean {
    this._reload()
    return this.madeRequests.length < this.allowedRequests
  }
}

export default RateLimit