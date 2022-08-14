export type ParsedValue = {
  value: string
  type: string
  [key: string]: any
}

export type Format = {
  field: string
  valid: boolean
  parser: (e: string) => ParsedValue
}

export type Formats = {
  [key: string]: { parser?: (e: string) => ParsedValue }
}
