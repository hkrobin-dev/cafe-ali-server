import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { STATUS } from '../../constants/statusCodes.js';
import { PaymentModel } from '../payment/payment.model.js';

// GET /order-stats - real MongoDB aggregation, category distribution + monthly sales
export const getOrderStats = asyncHandler(async (_req, res) => {
  const categoryDistribution = await PaymentModel.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        quantity: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  const monthlySales = await PaymentModel.aggregate([
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        totalRevenue: { $sum: '$amount' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const statusDistribution = await PaymentModel.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.status(STATUS.OK).json(
    new ApiResponse(STATUS.OK, { categoryDistribution, monthlySales, statusDistribution })
  );
});
