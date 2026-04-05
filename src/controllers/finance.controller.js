import Record from "../models/record.js";
import { financeInputValidator } from "../utils/inputvalidation.js";
import mongoose from 'mongoose';

export const createRecord = async (req, res) => {
  try {
    const verify = financeInputValidator.safeParse(req.body);
    if (!verify.success) return res.status(400).json("input validation failed");
    const { amount, type, category, date, note } = verify.data;

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      note,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating record",
      error: error.message,
    });
  }
};



export const getRecords = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      category, 
      startDate, 
      endDate 
    } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    let filter = {
      createdBy: req.user.id,
    };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const totalRecords = await Record.countDocuments(filter);

    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      pagination: {
        totalRecords,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalRecords / pageSize),
        pageSize,
      },
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching records",
      error: error.message,
    });
  }
};


export const getSingleRecord = async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching record",
      error: error.message,
    });
  }
};


export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating record",
      error: error.message,
    });
  }
};


export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting record",
      error: error.message,
    });
  }
};


export const searchRecords = async (req, res) => {
  try {
    const {
      query,
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      userId,
    } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const filter = {};
    if (req.user.role === "user") {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.id);
    } else {
      if (userId) {
        filter.createdBy = new mongoose.Types.ObjectId(userId);
      }
    }

   
    if (query) {
      filter.$or = [
        { note: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    if (type && ["income", "expense"].includes(type)) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const total = await Record.countDocuments(filter);

    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    
    res.status(200).json({
      success: true,
      pagination: {
        total,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / pageSize),
        pageSize,
      },
      data: records,
    });

  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error searching records",
      error: error.message,
    });
  }
};