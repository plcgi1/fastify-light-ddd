const args = {
  arg1: { type: 'number' },
  arg2: { type: 'number' },
}

module.exports = {
  sum: {
    body: {
      type: 'object',
      required: Object.keys(args),
      properties: args,
    },
  },
  mult: {
    body: {
      type: 'object',
      required: Object.keys(args),
      properties: args,
    },
  },
}
