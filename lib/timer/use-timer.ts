'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'
export type SessionType = 'work' | 'short_break' | 'long_break'

interface TimerState {
  status: TimerStatus
  remaining: number // seconds
  elapsed: number // seconds
  total: number // seconds
  sessionType: SessionType
}

interface UseTimerOptions {
  workMinutes?: number
  shortBreakMinutes?: number
  longBreakMinutes?: number
  sessionsBeforeLongBreak?: number
  onComplete?: (sessionType: SessionType) => void
}

export function useTimer(options: UseTimerOptions = {}) {
  const {
    workMinutes = 25,
    shortBreakMinutes = 5,
    longBreakMinutes = 15,
    sessionsBeforeLongBreak = 4,
    onComplete,
  } = options

  const [state, setState] = useState<TimerState>({
    status: 'idle',
    remaining: workMinutes * 60,
    elapsed: 0,
    total: workMinutes * 60,
    sessionType: 'work',
  })

  const [completedSessions, setCompletedSessions] = useState(0)
  const workerRef = useRef<Worker | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  // Worker初期化
  useEffect(() => {
    workerRef.current = new Worker('/workers/timer-worker.js')

    workerRef.current.onmessage = (e) => {
      const msg = e.data

      switch (msg.type) {
        case 'tick':
          setState((prev) => ({
            ...prev,
            remaining: msg.remaining,
            elapsed: msg.elapsed,
            total: msg.total,
          }))
          break

        case 'complete':
          setState((prev) => {
            const completedType = prev.sessionType
            onCompleteRef.current?.(completedType)
            return { ...prev, status: 'completed', remaining: 0 }
          })
          break

        case 'paused':
          setState((prev) => ({ ...prev, status: 'paused' }))
          break

        case 'resumed':
          setState((prev) => ({ ...prev, status: 'running' }))
          break

        case 'stopped':
          setState((prev) => ({ ...prev, status: 'idle' }))
          break
      }
    }

    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  const start = useCallback(
    (sessionType?: SessionType) => {
      const type = sessionType ?? state.sessionType
      let duration: number

      switch (type) {
        case 'work':
          duration = workMinutes * 60
          break
        case 'short_break':
          duration = shortBreakMinutes * 60
          break
        case 'long_break':
          duration = longBreakMinutes * 60
          break
      }

      setState({
        status: 'running',
        remaining: duration,
        elapsed: 0,
        total: duration,
        sessionType: type,
      })

      workerRef.current?.postMessage({
        type: 'start',
        durationSeconds: duration,
        startedAt: Date.now(),
      })
    },
    [state.sessionType, workMinutes, shortBreakMinutes, longBreakMinutes]
  )

  const pause = useCallback(() => {
    workerRef.current?.postMessage({ type: 'pause' })
  }, [])

  const resume = useCallback(() => {
    workerRef.current?.postMessage({ type: 'resume' })
  }, [])

  const stop = useCallback(() => {
    workerRef.current?.postMessage({ type: 'stop' })
    setState((prev) => ({
      ...prev,
      status: 'idle',
      remaining: prev.total,
      elapsed: 0,
    }))
  }, [])

  // セッション完了時に次のセッションを判定
  const startNext = useCallback(() => {
    if (state.sessionType === 'work') {
      const newCount = completedSessions + 1
      setCompletedSessions(newCount)
      if (newCount % sessionsBeforeLongBreak === 0) {
        start('long_break')
      } else {
        start('short_break')
      }
    } else {
      start('work')
    }
  }, [state.sessionType, completedSessions, sessionsBeforeLongBreak, start])

  return {
    ...state,
    completedSessions,
    start,
    pause,
    resume,
    stop,
    startNext,
  }
}
