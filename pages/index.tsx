import type { NextPage } from 'next'
import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import Head from 'next/head'
import classNames from 'classnames'

import { tcpFlagsParser, protocolParser } from '../utils/parsers'
import styles from '../styles/Flog.module.scss'

const DEFAULT_FORMAT = 'version account-id interface-id srcaddr dstaddr srcport dstport protocol packets bytes start end action log-status'

type Formats = {
  [key: string]: { parser?: (e: string) => string }
}

const FORMAT_FIELDS: Formats = {
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
  end: {},
  packets: {},
  protocol: { parser: protocolParser },
  region: {},
  srcaddr: {},
  srcport: {},
  start: {},
  type: {},
  version: {}
}

type Format = {
  field: string
  valid: boolean
  parser: (e: string) => string
}

const fieldParser = (field: string): Format => {
  const valid = Object.keys(FORMAT_FIELDS).indexOf(field) > -1
  const parser = valid ? FORMAT_FIELDS[field]?.parser : defaultParser

  return {
    field,
    valid,
    parser: parser || defaultParser
  }
}

const defaultParser = (e: string) => e

const parseFormat = (format: string): Format[] => {
  const fields = format.split(' ')

  return fields.map(fieldParser)
}

const parseLogs = (format: Format[], rawLogs: string) => {
  const logs = rawLogs.split('\n').map(e => e.split(' '))

  return logs.map(r => {
    return r.map((f, i) => format[i].parser(f))
  })
}

const Headers = ({ format }: { format: Format[] }) => {
  return (
    <thead>
      <tr>
        {format.map((row: Format) => (<th key={row.field}>{ row.field }</th>))}
      </tr>
    </thead>
  )
}

const Rows = ({ logs, actionIndex }: { logs: string[][], actionIndex: number }) => {
  return (
    <tbody>
      {logs.map((row: string[], i: number) => (
        <tr key={`row-${i}`} className={classNames(actionIndex > -1 && row[actionIndex] === 'ACCEPT' ? styles.logAccepted : null, actionIndex > -1 && row[actionIndex] === 'REJECT' ? styles.logRejected : null)}>
          {row.map((field: string, j: number) => (
            <td key={`row-${i}-field-${j}`}>{ field }</td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

const Flog: NextPage = () => {
  const [pattern, setPattern] = useState(DEFAULT_FORMAT)
  const [format, setFormat] = useState(parseFormat(pattern))
  const [actionIndex, setActionIndex] = useState(format.findIndex(e => e.field === 'action'))
  const [logs, setLogs] = useState('')
  const [parsedLogs, setParsedLogs] = useState([['']])

  useEffect(() => {
    const format = parseFormat(pattern)
    setFormat(format)
    setActionIndex(format.findIndex(e => e.field === 'action'))
  }, [pattern])

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setParsedLogs(parseLogs(format, logs))
  }

  const changePattern = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.value) {
      setPattern(e.target.value)
    } else {
      setPattern(DEFAULT_FORMAT)
    }
  }

  const changeLogs = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setLogs(e?.target?.value)
  }

  return (
    <>
      <Head>
        <title>AWS Flow Logs Parser</title>
      </Head>

      <main className={styles.container}>
        <form onSubmit={submitForm}>
          <input className={styles.format} name='format' placeholder={DEFAULT_FORMAT} value={pattern} onChange={changePattern} />
          <fieldset className={styles.logsGroup}>
            <textarea className={styles.logs} name='logs' onChange={changeLogs} value={logs} />
            <input className={styles.submit} type='submit' value='Parse' />
          </fieldset>
        </form>

        <table className={styles.parsedLogs}>
          <Headers format={format} />
          <Rows logs={parsedLogs} actionIndex={actionIndex} />
        </table>
      </main>
    </>
  )
}

export default Flog
