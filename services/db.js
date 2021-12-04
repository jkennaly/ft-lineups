import mysql from 'mysql2/promise'


const db = mysql.createConnection(process.env.JAWSDB_URL + '?connectionLimit=2&debug=false')

export async function excuteQuery({ query, values }) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}