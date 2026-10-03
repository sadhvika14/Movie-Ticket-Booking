import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import { clerkMiddleware } from '@clerk/express'
import { serve } from 'inngest/express'
import { inngest, functions } from './inngest/index.js'

const app = express()

// Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

// Connect MongoDB
let dbConnected = false

app.use(async (req, res, next) => {
  try {
    if (!dbConnected) {
      await connectDB()
      dbConnected = true
    }
    next()
  } catch (error) {
    console.error('Database connection error:', error)
    next(error)
  }
})

// API Routes
app.get('/', (req, res) => {
  res.send('Server is Live!')
})

// Inngest
app.use('/api/inngest', serve({ client: inngest, functions }))

export default app