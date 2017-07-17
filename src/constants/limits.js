// @flow

const limits: {
  DEV: Array<Array<number>>,
  OLD_EEV: Array<Array<number>>,
  PROD: Array<Array<number>>
} = {
  DEV: [[20, 1], [100, 120]],
  // https://discussion.developer.riotgames.com/articles/1221/overhauling-development-api-keys.html
  OLD_DEV: [[10, 10], [500, 600]],
  PROD: [[500, 10], [30000, 600]]
}

export default limits