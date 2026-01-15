import type { Request } from "express"

export const MissingFieldRequired = (fields: string[], req: Request) => {
  const missingFields: string[] = []
  for (const f of fields) {
    if (!req?.body[f]) missingFields.push(f)
  }
  return missingFields
}