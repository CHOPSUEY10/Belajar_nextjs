import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL not defined in environment");
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers(sql:postgres.Sql) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = [] ;

  for (const user of users) {
    try {
      const hashedPassword = await bcrypt.hash(user.password,10);
      const result = await sql`
        INSERT INTO users (id, name, email, password)
        VALUES(${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (email) DO NOTHING;
      `;

      insertedUsers.push(result);

    } catch (err) {
      console.error('Error inserting user', user.email, err);
    }

  }

  return insertedUsers;
}

async function seedInvoices(sql:postgres.Sql) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = [] ;

  for (const invoice of invoices ){
    try {

      const result = await sql `
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES(${invoice.customer_id},${invoice.amount},${invoice.status},${invoice.date})    
        ON CONFLICT (id) DO NOTHING
      `
      insertedInvoices.push(result);
    }catch (err){

      console.error('Error inserting invoices', err);
    }
  }
  return insertedInvoices;
}

async function seedCustomers(sql:postgres.Sql) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = [];

  for(const customer of customers){
    try{
      const result = await sql `

        INSERT INTO customers (id,name,email,image_url)
        VALUES(${customer.id},${customer.name},${customer.email},${customer.image_url})
        ON CONFLICT (id) DO NOTHING    
      `
      insertedCustomers.push(result)
    }catch(err){

       console.error('Error inserting customers', err);
    }
  }
  return insertedCustomers;
}

async function seedRevenue(sql:postgres.Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = [];

  for(const rev of revenue){
    try{

      
      const result = await sql` 
      
        INSERT INTO revenue (month,revenue)
        VALUES (${rev.month}, ${rev.revenue} )
        ON CONFLICT (month) DO NOTHING
      
      
      `
      insertedRevenue.push(result);


    }catch(err){

      console.error('Error inserting revenue', err);

    }
  }
  return insertedRevenue;
}

export async function GET() {
  try {
    await sql.begin(async (tx) => {
      await seedUsers(tx);
      await seedCustomers(tx);
      await seedInvoices(tx);
      await seedRevenue(tx);
    });

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

