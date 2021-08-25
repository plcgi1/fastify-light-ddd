module.exports = {
  name: 'calculator',
  path: './calc/calc.controller',
  tags: ['calc'],
  schemas: './calc/calc.schema',
  interfaces: [
    {
      httpMethod: 'post',
      controllerMethod: 'sum',
      path: '/api/calc/sum',
      preHandler: [],
    },
    {
      httpMethod: 'post',
      controllerMethod: 'mult',
      path: '/api/calc/mult',
      preHandler: [],
    },
  ],
}
