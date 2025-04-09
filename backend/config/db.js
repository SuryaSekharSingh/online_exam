import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const pool = mysql2.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    connectionLimit:10,
    waitForConnections: true,
    multipleStatements: true
})

export const checkConnection = async() => {
    try{
        const connection = await pool.getConnection();
        console.log("connection succcessful!")
        connection.release();
    } catch(error){
        console.log("Error connecting to database! ", error);
        throw error;
    }
}

export const initializeDatabase = async () => {
    let adminConn;
    try {
        // First create database if not exists
        adminConn = await mysql2.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        
        await adminConn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await adminConn.end();

        // Now create tables and trigger
        const sql = fs.readFileSync(
            path.resolve('database', 'init.sql'), 
            'utf-8'
        );
        
        await pool.query(sql);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    } finally{
        if(adminConn) await adminConn.end();
    }
};

export default {pool};