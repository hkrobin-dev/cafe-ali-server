import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { STATUS } from '../../constants/statusCodes.js';
import { UserModel } from '../user/user.model.js';
import { ItemModel } from '../item/item.model.js';
import { PaymentModel } from '../payment/payment.model.js';

// GET /admin-stats - real, dynamic database data (not mocked)
export const getAdminStats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalItems, revenueAgg, totalOrders] = await Promise.all([
    UserModel.countDocuments(),
    ItemModel.countDocuments(),
    PaymentModel.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]),
    PaymentModel.countDocuments(),
  ]);

  const userGrowth = await UserModel.aggregate([
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.status(STATUS.OK).json(
    new ApiResponse(STATUS.OK, {
      totalUsers,
      totalItems,
      totalOrders,
      totalRevenue: revenueAgg[0]?.totalRevenue || 0,
      userGrowth,
    })
  );
});
