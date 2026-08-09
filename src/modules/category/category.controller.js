import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { STATUS } from '../../constants/statusCodes.js';
import { CategoryModel } from './category.model.js';

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await CategoryModel.find().sort({ name: 1 });
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, categories));
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await CategoryModel.create(req.body);
  res.status(STATUS.CREATED).json(new ApiResponse(STATUS.CREATED, category, 'Category created'));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new ApiError(STATUS.NOT_FOUND, 'Category not found.');
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, category, 'Category updated'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await CategoryModel.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(STATUS.NOT_FOUND, 'Category not found.');
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, null, 'Category deleted'));
});
