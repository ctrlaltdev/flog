import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import Head from 'next/head'
import type { NextPage } from 'next'

import { LogHeaders, LogRows, DEFAULT_FORMAT, parseFormat, parseLogs } from '../components/LogTable'
import type { ParsedValue } from '../typings/logs'
import styles from '../styles/Flog.module.scss'

const Flog: NextPage = () => {
  const [pattern, setPattern] = useState(DEFAULT_FORMAT)
  const [format, setFormat] = useState(parseFormat(pattern))
  const [actionIndex, setActionIndex] = useState(format.findIndex(e => e.field === 'action'))
  const [logs, setLogs] = useState('')
  const [parsedLogs, setParsedLogs] = useState<ParsedValue[][]>([[]])

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
          <LogHeaders format={format} />
          <LogRows logs={parsedLogs} actionIndex={actionIndex} />
        </table>
      </main>
    </>
  )
}

export default Flog
