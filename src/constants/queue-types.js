// @flow

/* https://developer.riotgames.com/game-constants.html */

const queueTypes: {
  CUSTOM: number,
  NORMAL_3x3: number,
  NORMAL_5x5_BLIND: number,
  NORMAL_5x5_DRAFT: number,
  RANKED_SOLO_5x5: number,
  RANKED_PREMADE_5x5: number, // deprecated
  RANKED_PREMADE_3x3: number, // deprecated
  RANKED_FLEX_TT: number,
  RANKED_TEAM_3x3: number, // deprecated
  RANKED_TEAM_5x5: number,
  ODIN_5x5_BLIND: number,
  ODIN_5x5_DRAFT: number,
  BOT_5x5: number, // deprecated
  BOT_ODIN_5x5: number,
  BOT_5x5_INTRO: number,
  BOT_5x5_BEGINNER: number,
  BOT_5x5_INTERMEDIATE: number,
  BOT_TT_3x3: number,
  GROUP_FINDER_5x5: number,
  ARAM_5x5: number,
  ONEFORALL_5x5: number,
  FIRSTBLOOD_1x1: number,
  FIRSTBLOOD_2x2: number,
  SR_6x6: number,
  URF_5x5: number,
  ONEFORALL_MIRRORMODE_5x5: number,
  BOT_URF_5x5: number,
  NIGHTMARE_BOT_5x5_RANK1: number,
  NIGHTMARE_BOT_5x5_RANK2: number,
  NIGHTMARE_BOT_5x5_RANK5: number,
  ASCENSION_5x5: number,
  HEXAKILL: number,
  BILGEWATER_ARAM_5x5: number,
  KING_PORO_5x5: number,
  COUNTER_PICK: number,
  BILGEWATER_5x5: number,
  SIEGE: number,
  DEFINITELY_NOT_DOMINION_5x5: number,
  ARURF_5X5: number,
  ARSR_5x5: number,
  TEAM_BUILDER_DRAFT_UNRANKED_5x5: number,
  TEAM_BUILDER_DRAFT_RANKED_5x5: number, // deprecated
  TEAM_BUILDER_RANKED_SOLO: number,
  RANKED_FLEX_SR: number,
  ASSASSINATE_5x5: number,
  DARKSTAR_3x3: number
} = {
  CUSTOM: 0,
  NORMAL_3x3: 8,
  NORMAL_5x5_BLIND: 2,
  NORMAL_5x5_DRAFT: 14,
  RANKED_SOLO_5x5: 4,
  RANKED_PREMADE_5x5: 6, // deprecated
  RANKED_PREMADE_3x3: 9, // deprecated
  RANKED_FLEX_TT: 9,
  RANKED_TEAM_3x3: 41, // deprecated
  RANKED_TEAM_5x5: 42,
  ODIN_5x5_BLIND: 16,
  ODIN_5x5_DRAFT: 17,
  BOT_5x5: 7, // deprecated
  BOT_ODIN_5x5: 25,
  BOT_5x5_INTRO: 31,
  BOT_5x5_BEGINNER: 32,
  BOT_5x5_INTERMEDIATE: 33,
  BOT_TT_3x3: 52,
  GROUP_FINDER_5x5: 61,
  ARAM_5x5: 65,
  ONEFORALL_5x5: 70,
  FIRSTBLOOD_1x1: 72,
  FIRSTBLOOD_2x2: 73,
  SR_6x6: 75,
  URF_5x5: 76,
  ONEFORALL_MIRRORMODE_5x5: 78,
  BOT_URF_5x5: 83,
  NIGHTMARE_BOT_5x5_RANK1: 91,
  NIGHTMARE_BOT_5x5_RANK2: 92,
  NIGHTMARE_BOT_5x5_RANK5: 93,
  ASCENSION_5x5: 96,
  HEXAKILL: 98,
  BILGEWATER_ARAM_5x5: 100,
  KING_PORO_5x5: 300,
  COUNTER_PICK: 310,
  BILGEWATER_5x5: 313,
  SIEGE: 315,
  DEFINITELY_NOT_DOMINION_5x5: 317,
  ARURF_5X5: 318,
  ARSR_5x5: 325,
  TEAM_BUILDER_DRAFT_UNRANKED_5x5: 400,
  TEAM_BUILDER_DRAFT_RANKED_5x5: 410, // deprecated
  TEAM_BUILDER_RANKED_SOLO: 420,
  RANKED_FLEX_SR: 440,
  ASSASSINATE_5x5: 600,
  DARKSTAR_3x3: 610
}

export default queueTypes