import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { STATUS } from '../constants/statusCodes.js';

// Validates :id (or another named param) is a valid Mongo ObjectId before hitting the DB
export const validateObjectId =
  (paramName = 'id') =>
  (req, _res, next) => {
    const value = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new ApiError(STATUS.BAD_REQUEST, `Invalid ${paramName}: ${value}`);
    }
    next();
  };

export default validateObjectId;
