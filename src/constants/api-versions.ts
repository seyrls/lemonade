/**
 * API Version constants for different modules
 * This allows each module (admin, customer) to have independent versioning
 */

export const API_VERSIONS = {
  ADMIN: 'v1',
  CUSTOMER: 'v1',
} as const;

export const API_PATHS = {
  ADMIN: `admin/${API_VERSIONS.ADMIN}`,
  CUSTOMER: `customer/${API_VERSIONS.CUSTOMER}`,
} as const;

export type ApiVersion = (typeof API_VERSIONS)[keyof typeof API_VERSIONS];
export type ApiPath = (typeof API_PATHS)[keyof typeof API_PATHS];
