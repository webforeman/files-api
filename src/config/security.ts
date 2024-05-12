import express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { slowDown } from 'express-slow-down'

import app from './app'

app.use(helmet)
// Ограничение тела запроса: Ограничьте размер тела запроса для предотвращения атак типа DoS.
app.use(express.json({ limit: '10kb' }))
// Ограничение количества запросов от одного IP-адреса за определенный период времени.
const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 100, // Ограничьте каждый IP-адрес 100 запросами за "окно" (здесь - за 10 минут).
  message: 'There are too many requests, please try again later.',
})

const speedLimiter = slowDown({
  windowMs: 10 * 60 * 1000, // 10 минут
  delayAfter: 100, // Разрешать 100 запросов в течение 10 минут.
  delayMs: (hits) => hits * 300, // Добавляйте 300 мс задержки к каждому запросу после 100-го.

  /**
   * Таким образом:
   *
   * - запросы 1-100 не задерживаются.
   * - запрос 101 задерживается на 300 мс
   * - запрос 102 задерживается на 600 мс
   * - запрос 103 задерживается на 900 мс
   *
   * и так далее. Через 10 минут задержка будет сброшена до 0.
   */
})

app.use(rateLimiter, speedLimiter)
