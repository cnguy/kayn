const checkAllHelpers = {
  int: arr => arr.every((i) => Number.isInteger(i)),
  string: arr => arr.every((i) => typeof i === 'string')
}

const checkAll = {
  int: arr => arr && Array.isArray(arr) && checkAllHelpers.int(arr) && arr.length > 0,
  string: arr => arr && Array.isArray(arr) && checkAllHelpers.string(arr) && arr.length > 0
}

export default checkAll