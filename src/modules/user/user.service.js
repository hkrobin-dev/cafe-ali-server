import { UserModel } from './user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { STATUS } from '../../constants/statusCodes.js';

export const getMe = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new ApiError(STATUS.NOT_FOUND, 'User not found.');
  return user;
};

export const updateMe = async (userId, updates) => {
  const user = await UserModel.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(STATUS.NOT_FOUND, 'User not found.');
  return user;
};

export const listUsers = async ({ page = 1, limit = 10, search = '', role = '' }) => {
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) query.role = role;

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    UserModel.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    UserModel.countDocuments(query),
  ]);

  return {
    users,
    meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

export const checkIsAdmin = async (email) => {
  const user = await UserModel.findOne({ email });
  return { admin: user?.role === 'admin' };
};

export const updateUserRole = async (id, role) => {
  const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
  if (!user) throw new ApiError(STATUS.NOT_FOUND, 'User not found.');
  return user;
};

export const deleteUser = async (id) => {
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) throw new ApiError(STATUS.NOT_FOUND, 'User not found.');
  return user;
};
