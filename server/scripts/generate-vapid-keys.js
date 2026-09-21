import webpush from 'web-push'

const keys = webpush.generateVAPIDKeys()
console.log('VAPID keys generated. Add these to your .env file:\n')
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`)
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`)
console.log('\nAlso set the frontend env var app/.env with:')
console.log(`VITE_VAPID_PUBLIC_KEY=${keys.publicKey}`)
