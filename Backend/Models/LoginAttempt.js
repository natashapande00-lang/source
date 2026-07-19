import mongoose from 'mongoose';

const loginAttemptSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const LoginAttemptModel = mongoose.model("LoginAttempt", loginAttemptSchema);
export default LoginAttemptModel;
