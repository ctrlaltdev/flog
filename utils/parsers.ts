import type { ParsedValue } from '../typings/logs'

interface IParsedValue {
  orig: string
  value: string
  type: string
}

class StringParsedValue implements IParsedValue {
  orig: string
  value: string
  type: string = 'string'

  constructor (orig: string, value: string = orig) {
    this.orig = orig
    this.value = value
  }
}

export const defaultParser = (e: string) => new StringParsedValue(e, e)

export const tcpFlagsParser = (flag: string): ParsedValue => {
  switch (flag) {
    case '1':
      return new StringParsedValue(flag, 'FIN')
    case '2':
      return new StringParsedValue(flag, 'SYN')
    case '4':
      return new StringParsedValue(flag, 'RST')
    case '8':
      return new StringParsedValue(flag, 'PSH')
    case '16':
      return new StringParsedValue(flag, 'ACK')
    case '18':
      return new StringParsedValue(flag, 'SYN-ACK')
    case '32':
      return new StringParsedValue(flag, 'URG')
    default:
      return new StringParsedValue(flag)
  }
}

export const protocolParser = (proto: string): ParsedValue => {
  switch (proto) {
    case '0':
      return new StringParsedValue(proto, 'HOPOPT')
    case '1':
      return new StringParsedValue(proto, 'ICMP')
    case '6':
      return new StringParsedValue(proto, 'TCP')
    case '17':
      return new StringParsedValue(proto, 'UDP')
    case '33':
      return new StringParsedValue(proto, 'DCCP')
    case '37':
      return new StringParsedValue(proto, 'DDP')
    case '58':
      return new StringParsedValue(proto, 'ICMP6')
    default:
      return new StringParsedValue(proto)
  }
}

class DateTimeParsedValue extends StringParsedValue {
  type: string = 'datetime'
  date: Date

  constructor (orig: string, date: Date) {
    // super(orig, date.toISOString())
    super(orig, (date.getTime() / 1000).toString())
    this.date = date
  }
}

export const ios8601Parser = (date: string): ParsedValue => {
  if (!date) return { type: 'error', value: date, orig: date }
  const d = new Date(date)
  return new DateTimeParsedValue(date, d)
}

export const timestampParser = (timestamp: string): ParsedValue => {
  if (!timestamp) return { type: 'error', value: timestamp, orig: timestamp }
  const d = new Date(parseInt(timestamp) * 1000)
  return new DateTimeParsedValue(timestamp, d)
}

class IPParsedValue extends StringParsedValue {
  type: string = 'ip'
  ip: string[]
  privateIP: boolean
  ipVersion: number

  constructor (orig: string, ip: string[], ipVersion: number, privateIP: boolean = false) {
    super(orig)
    this.ip = ip
    this.ipVersion = ipVersion
    this.privateIP = privateIP
  }
}

export const ipParser = (ip: string): ParsedValue => {
  if (!ip) return { type: 'error', value: ip, orig: ip }
  const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Pattern = /^$/
  const parsedIP = []
  let ipVersion = 0
  let privateIP = false
  if (ip.match(ipv4Pattern)) {
    ipVersion = 4
    for (const part of ip.split('.')) {
      parsedIP.push(part)
    }
    if (parsedIP[0] === '10') privateIP = true
    if (parsedIP[0] === '192' && parsedIP[1] === '168') privateIP = true
    if (parsedIP[0] === '172' && parsedIP[1] >= '16' && parsedIP[1] <= '31') privateIP = true
  } else if (ip.match(ipv6Pattern)) {
    ipVersion = 6
    for (const part of ip.split(':')) {
      parsedIP.push(part)
    }
  }
  return new IPParsedValue(ip, parsedIP, ipVersion, privateIP)
}

class TypedParsedValue extends StringParsedValue {
  type: string

  constructor (orig: string, value: string, type: string) {
    super(orig, value)
    this.type = type
  }
}

export const typedParser = (type: string, value: string) => {
  return new TypedParsedValue(value, value, type)
}
