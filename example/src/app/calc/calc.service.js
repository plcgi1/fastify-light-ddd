class CalcService {
  sum(body) {
    return body.arg1 + body.arg2
  }

  mult(body) {
    return body.arg1 * body.arg2
  }
}

module.exports = CalcService
