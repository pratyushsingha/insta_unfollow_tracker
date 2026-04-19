import 'dotenv/config'
import { connectDB } from '../lib/db'
import { followerQueue } from '../lib/queue'
import { User } from '../models/User'

async function main() {
    await connectDB()
    console.log('✅ MongoDB connected')

    // Create a test user
    const user = await User.create({
        email: 'pratyushsingha83@gmail.com',
        instaUsername: 'darknight999z',
        isActive: true,
    })
    console.log('✅ Test user created:', user._id.toString())

    // Add job to queue
    await followerQueue.add('check-followers', {
        userId: user._id.toString(),
        email: user.email,
        instaUsername: user.instaUsername,
    })
    console.log('✅ Job added to queue')
    console.log('👉 Now run the worker in another terminal:')
    console.log('   npx ts-node --project tsconfig.server.json workers/followerWorker.ts')
    console.log('')
    console.log('After the job completes, check your email inbox!')

    process.exit(0)
}

main().catch(console.error)