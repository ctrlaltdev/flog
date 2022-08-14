import type { ParsedValue } from '../typings/logs'

interface IParsedValue {
  value: string
  type: string
}

class StringParsedValue implements IParsedValue {
  value: string
  type: string = 'string'

  constructor (value: string) {
    this.value = value
  }
}

export const tcpFlagsParser = (flag: string): ParsedValue => {
  switch (flag) {
    case '1':
      return new StringParsedValue('FIN')
    case '2':
      return new StringParsedValue('SYN')
    case '4':
      return new StringParsedValue('RST')
    case '8':
      return new StringParsedValue('PSH')
    case '16':
      return new StringParsedValue('ACK')
    case '18':
      return new StringParsedValue('SYN-ACK')
    case '32':
      return new StringParsedValue('URG')
    default:
      return new StringParsedValue(flag)
  }
}

export const protocolParser = (proto: string): ParsedValue => {
  switch (proto) {
    case '0':
      return new StringParsedValue('HOPOPT')
    case '1':
      return new StringParsedValue('ICMP')
    case '6':
      return new StringParsedValue('TCP')
    case '17':
      return new StringParsedValue('UDP')
    case '33':
      return new StringParsedValue('DCCP')
    case '37':
      return new StringParsedValue('DDP')
    case '58':
      return new StringParsedValue('ICMP6')
    default:
      return new StringParsedValue(proto)
  }
}

class DateTimeParsedValue extends StringParsedValue {
  type: string = 'datetime'
  date: Date

  constructor (date: Date) {
    super(date.toISOString())
    this.date = date
  }
}

export const ios8601Parser = (date: string): ParsedValue => {
  if (!date) return { type: 'error', value: date }
  const d = new Date(date)
  return new DateTimeParsedValue(d)
}

export const timestampParser = (timestamp: string): ParsedValue => {
  if (!timestamp) return { type: 'error', value: timestamp }
  const d = new Date(parseInt(timestamp) * 1000)
  return new DateTimeParsedValue(d)
}

export const defaultParser = (e: string) => new StringParsedValue(e)
