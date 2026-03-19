import type { UserType } from '@/types'

const USER_TYPE_RANK: Record<UserType, number> = {
  REG: 1,
  ADM: 2,
}

export function normalizeUserType(value: unknown): UserType | null {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.toUpperCase()

  if (normalized === 'REG' || normalized === 'ADM') {
    return normalized
  }

  return null
}

export function hasUserTypeAccess(
  currentUserType: unknown,
  allowedUserTypes?: UserType[],
): boolean {
  if (!allowedUserTypes || allowedUserTypes.length === 0) {
    return true
  }

  const normalizedCurrentUserType = normalizeUserType(currentUserType)

  if (!normalizedCurrentUserType) {
    return false
  }

  const currentRank = USER_TYPE_RANK[normalizedCurrentUserType]

  return allowedUserTypes.some((allowedUserType) => currentRank >= USER_TYPE_RANK[allowedUserType])
}
