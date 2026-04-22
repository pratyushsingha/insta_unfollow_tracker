import 'dotenv/config'
import cron from 'node-cron'
import * as Sentry from "@sentry/nextjs"
import { followerQueue } from '../lib/queue'
import { User } from '../models/user'
import { connectDB } from '@/lib/db'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

async function enqueueAllUsers(): Promise<void> {
  console.log('\n[Cron] Starting daily follower check...')

  try {
    await connectDB()
    const users = await User.find({ isActive: true })
    console.log(`[Cron] Found ${users.length} active users to process`)

    for (const user of users) {
      await followerQueue.add(
        'check-followers', // job name — required in BullMQ
        {
          userId: user._id.toString(),
          email: user.email,
          instaUsername: user.instaUsername,
        },
        {
          jobId: `${user._id}-${Date.now()}`,
        }
      )
      console.log(`[Cron] Queued job for @${user.instaUsername}`)
    }

    console.log(`[Cron] All ${users.length} users enqueued`)
  } catch (err) {
    console.error('[Cron] Error during enqueue:', err)
  }
}

// 8:00 AM IST = 2:30 AM UTC
cron.schedule('30 2 * * *', () => {
  console.log('[Cron] Triggered at', new Date().toISOString())
  enqueueAllUsers()
}, {
  timezone: 'UTC',
})

console.log('[Cron] Scheduler running — fires at 8:00 AM IST daily')

if (process.argv.includes('--run-now')) {
  console.log('[Cron] --run-now flag detected, triggering immediately')
  enqueueAllUsers()
}