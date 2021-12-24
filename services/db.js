import mysql from 'mysql2/promise'



export async function executeQuery({ query, params }) {
	const connString = process.env.JAWSDB_URL + '?connectionLimit=1&debug=false'
	//console.log('connecting to: ', connString)
  try {
	const db = await mysql.createConnection(connString)
	//console.log('connected')
    const results = await db.query(query, params)
    await db.end();
    return results;
  } catch (error) {
  	console.error(error)
  	console.log('query', query, params)
    throw error
  }
}