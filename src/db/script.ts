import { db } from './client.js'

async function setup() {
    console.log('Setting up database...')

    await db.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS chat_history (
      id SERIAL PRIMARY KEY,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)

    // Sample data
    await db.query(`
    INSERT INTO tasks (title, done) VALUES
      ('إعداد المشروع', true),
      ('كتابة التوثيق', false),
      ('اختبار الـ API', false)
    ON CONFLICT DO NOTHING;

    INSERT INTO notes (content) VALUES
      ('هذا مشروع تجريبي للـ AI مع PostgreSQL')
    ON CONFLICT DO NOTHING;
  `)

    console.log('✅ Database ready!')
    await db.end()
}

setup().catch(console.error)
