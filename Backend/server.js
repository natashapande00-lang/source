import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dbconnect from './utils/db.js'
import urlRoutes from './Routes/urlRoutes.js'
import authRoutes from './Routes/authRoutes.js'

dotenv.config({})
const Port = 8000
const app = express()
const allowedOrigins = ['http://localhost:5173', 'https://instagram-hpnf.onrender.com'];
const corsoption = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}
app.use(cors(corsoption))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())

app.use("/auth", authRoutes)
app.use("/",urlRoutes)

app.listen(Port,()=>{dbconnect();console.log(`Server is Running on Port ${Port}`)})