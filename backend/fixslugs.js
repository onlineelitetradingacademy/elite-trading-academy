require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('✅ Connected');

  // Fix slugs directly in DB without triggering model middleware
  const db = mongoose.connection.db;
  const courses = await db.collection('courses').find({}).toArray();

  for (const c of courses) {
    if (!c.slug || c.slug === null || c.slug === undefined) {
      const slug = c.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now();

      await db.collection('courses').updateOne(
        { _id: c._id },
        { $set: { slug: slug } }
      );
      console.log('Fixed:', c.title, '->', slug);
    } else {
      console.log('Already has slug:', c.title, '->', c.slug);
    }
  }

  console.log('✅ All done!');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});