class CalcController {
  sum(req) {
    const result = req.services.calc.sum(req.body)

    return result
  }

  mult(req) {
    const result = req.services.calc.mult(req.body)

    return result
  }
}

module.exports = CalcController
