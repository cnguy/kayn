// @flow

export type callback = (?string, ?Object) => void
export type cacheGet = (data: { key: string }, callback) => void
export type cacheSet = (data: { key: string, ttl: number }, any) => void