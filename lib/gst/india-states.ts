import { CountryState, INDIA_GST_STATES as INDIA_GST_STATES_RAW, getIndiaStateNameByCode as getIndiaStateNameByCodeRaw } from "./country-states"

export type IndiaState = CountryState

export const INDIA_GST_STATES = INDIA_GST_STATES_RAW

export const getIndiaStateNameByCode = getIndiaStateNameByCodeRaw
