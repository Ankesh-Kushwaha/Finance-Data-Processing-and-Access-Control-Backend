import User from '../models/user.js'
import mongoose from 'mongoose';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      err: err.message,
    });
  }
}

export const getAsingleUser = async(req, res) => {
  try{
    const {userId} = req.body;
    const objectId = new mongoose.Types.ObjectId(userId);
    console.log(objectId);
    if (!objectId) return res.status(400).json("userId required");
    const user = await User.findById(objectId);
    if (!user) return res.status(400).json("user does not exist");
    delete user.password;

    res.status(200).json({
      success: true,
      user
    })
  }
  catch(err) {
    console.log("error while getting a user", err.message);
    res.status(500).json({
      success: true,
      message: "internal server error",
      error:err.message,
    })
  }
}

export const updateRole = async (userId, role) => {
  const validRoles = ["viewer", "analyst", "admin"];

  if (!validRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


export const updateStatus = async (userId, isActive) => {
  if (typeof isActive !== "boolean") {
    throw new Error("isActive must be true or false");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


export const changeRole = async (req, res) => {
  try {
    const {role,userId } = req.body;
    const objectId = new mongoose.Types.ObjectId(userId);

    if (req.user.id === objectId) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    const user = await updateRole(objectId, role);
    delete user.password;

    res.status(200).json({
      message: "Role updated successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { isActive ,userId } = req.body;
    const objectId= new mongoose.Types.ObjectId(userId);
    
    if (req.user.id === objectId && isActive === false) {
      return res.status(400).json({
        message: "You cannot deactivate your own account",
      });
    }

    const user = await updateStatus(objectId, isActive);
    delete user.password;

    res.status(200).json({
      message: "User status updated successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

