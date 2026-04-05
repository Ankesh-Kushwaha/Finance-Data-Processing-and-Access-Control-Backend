import Record from "../models/record.js";
import mongoose from 'mongoose';


//give the full aggregated result for the dashboard
export const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    const matchStage = {};

    //role based access control
    if (req.user.role === "user") {
      //normal user -> can see on their data summary
      matchStage.createdBy = new mongoose.Types.ObjectId(req.user.id);
    } else {
      //analyst or admin can shows all summary or a specific user summary
      if (userId) {
        matchStage.createdBy = new mongoose.Types.ObjectId(userId);
      }
    }

    //date filter
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    //aggregation
    const [summary] = await Record.aggregate([
      { $match: matchStage },

      {
        $facet: {
          //totals
          totals: [
            {
              $group: {
                _id: null,
                totalIncome: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
                  },
                },
                totalExpense: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
                  },
                },
              },
            },
          ],

          //category wise breakdown
          categoryBreakdown: [
            {
              $group: {
                _id: {
                  category: "$category",
                  type: "$type",
                },
                total: { $sum: "$amount" },
              },
            },
            {
              $project: {
                _id: 0,
                category: "$_id.category",
                type: "$_id.type",
                total: 1,
              },
            },
          ],

          //recent transactions
          recentTransactions: [
            { $sort: { date: -1 } },
            { $limit: 5 },
          ],

          // monthly trends
          monthlyTrends: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                  type: "$type",
                },
                total: { $sum: "$amount" },
              },
            },
            {
              $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                type: "$_id.type",
                total: 1,
              },
            },
            { $sort: { year: 1, month: 1 } },
          ],
        },
      },
    ]);

    //safe fallback
    const totals = summary?.totals?.[0] || {
      totalIncome: 0,
      totalExpense: 0,
    };

    const totalIncome = totals.totalIncome || 0;
    const totalExpense = totals.totalExpense || 0;

   
    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        categoryBreakdown: summary?.categoryBreakdown || [],
        recentTransactions: summary?.recentTransactions || [],
        monthlyTrends: summary?.monthlyTrends || [],
      },
    });

  } catch (error) {
    console.error("SUMMARY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error generating dashboard summary",
      error: error.message,
    });
  }
};