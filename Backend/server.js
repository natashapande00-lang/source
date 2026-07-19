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
const corsoption = {
    origin: (origin, callback) => {
        callback(null, true);
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