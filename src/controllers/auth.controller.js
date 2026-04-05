import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import { userInputValidateSignUp,userInputValidateLogin } from '../utils/inputvalidation.js';

export const userRegister = async (req, res) => {
   try { 
     const verify = userInputValidateSignUp.safeParse(req.body);
     if (!verify.success) return res.status(400).json("input validation failed");
    const { name, email, password } = verify.data;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });
     
    

     res.status(201).json({
       name: user.name,
       email: user.email,
       message:"user registration successfull"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const userLogin = async (req, res) => {
  try {
    const verify =userInputValidateLogin.safeParse(req.body);
    if (!verify.success) return res.status(400).json("input validation failed");
    const { email, password } = verify.data;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User is inactive" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ 
      message:"user login successfull",
      name: user.name,
      email: user.email,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}