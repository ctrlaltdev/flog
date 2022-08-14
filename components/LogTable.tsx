import classNames from 'classnames'

import { tcpFlagsParser, protocolParser, ios8601Parser, timestampParser, defaultParser } from '../utils/parsers'
import { Format, Formats, ParsedValue } from '../typings/logs'
import styles from '../styles/Flog.module.scss'

export const DEFAULT_FORMAT = 'version account-id interface-id srcaddr dstaddr srcport dstport protocol packets bytes start end action log-status'

export const FIELDS: Formats = {
  'account-id': {},
  'az-id': {},
  'flow-direction': {},
  'interface-id': {},
  'log-status': {},
  'pkt-dst-aws-service': {},
  'pkt-dstaddr': {},
  'pkt-src-aws-service': {},
  'pkt-srcaddr': {},
  'sublocation-id': {},
  'sublocation-type': {},
  'subnet-id': {},
  'tcp-flags': { parser: tcpFlagsParser },
  'traffic-path': {},
  'vpc-id': {},
  action: {},
  bytes: {},
  dstaddr: {},
  dstport: {},
  end: { parser: timestampParser },
  packets: {},
  protocol: { parser: protocolParser },
  region: {},
  srcaddr: {},
  srcport: {},
  start: { parser: timestampParser },
  timestamp: { parser: ios8601Parser },
  type: {},
  version: {}
}

const fieldParser = (field: string): Format => {
  const valid = Object.keys(FIELDS).indexOf(field) > -1
  const parser = valid ? FIELDS[field]?.parser : defaultParser

  return {
    field,
    valid,
    parser: parser || defaultParser
  }
}

export const parseFormat = (format: string): Format[] => {
  const fields = format.split(' ')

  return fields.map(fieldParser)
}

export const parseLogs = (format: Format[], rawLogs: string) => {
  const logs = rawLogs.split('\n').map(e => e.split(' '))

  return logs.map(r => {
    return r.map((f, i) => format[i].parser(f))
  })
}

export const LogHeaders = ({ format }: { format: Format[] }) => {
  return (
    <thead>
      <tr>
        {format.map((row: Format) => (<th key={row.field}>{ row.field }</th>))}
      </tr>
    </thead>
  )
}

export const LogRows = ({ logs, actionIndex }: { logs: ParsedValue[][], actionIndex: number }) => {
  return (
    <tbody>
      {logs.map((row: ParsedValue[], i: number) => (
        <tr key={`row-${i}`} className={classNames(actionIndex > -1 && row[actionIndex]?.value === 'ACCEPT' ? styles.logAccepted : null, actionIndex > -1 && row[actionIndex]?.value === 'REJECT' ? styles.logRejected : null)}>
          {row.map((field: ParsedValue, j: number) => (
            <td key={`row-${i}-field-${j}`}>{ field.value }</td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
