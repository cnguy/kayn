// @flow

const checkAllHelpers = {
  int: (arr: any): boolean => arr.every((i) => Number.isInteger(i)),
  string: (arr: any): boolean => arr.every((i) => typeof i === 'string')
}

const checkAll = {
  int: (arr: any): boolean => arr && Array.isArray(arr) && checkAllHelpers.int(arr) && arr.length > 0,
  string: (arr: any): boolean => arr && Array.isArray(arr) && checkAllHelpers.string(arr) && arr.length > 0
}

export default checkAll