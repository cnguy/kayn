// @flow

// Maps abbreviated regions -> names
// for `platform-ids.js`.
// I prefer grabbing the values through
// nicer, longer key names (better for the editor).
const regions: {
  br: string,
  eune: string,
  euw: string,
  kr: string,
  lan: string,
  las: string,
  na: string,
  oce: string,
  ru: string,
  tr: string,
  jp: string,
} = {
  br: 'BRAZIL',
  eune: 'EUROPE',
  euw: 'EUROPE_WEST',
  kr: 'KOREA',
  lan: 'LATIN_AMERICA_NORTH',
  las: 'LATIN_AMERICA_SOUTH',
  na: 'NORTH_AMERICA',
  oce: 'OCEANIA',
  ru: 'RUSSIA',
  tr: 'TURKEY',
  jp: 'JAPAN'
}

export default regions