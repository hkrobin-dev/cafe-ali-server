import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { STATUS } from '../../constants/statusCodes.js';
import * as itemService from './item.service.js';

export const listItems = asyncHandler(async (req, res) => {
  const result = await itemService.listItems(req.query);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, result));
});

export const getItemById = asyncHandler(async (req, res) => {
  const item = await itemService.getItemById(req.params.id);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, item));
});

export const getRelatedItems = asyncHandler(async (req, res) => {
  const items = await itemService.getRelatedItems(req.params.id, req.query.limit);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, items));
});

export const createItem = asyncHandler(async (req, res) => {
  const item = await itemService.createItem(req.body, req.user._id);
  res.status(STATUS.CREATED).json(new ApiResponse(STATUS.CREATED, item, 'Item created'));
});

export const updateItem = asyncHandler(async (req, res) => {
  const item = await itemService.updateItem(req.params.id, req.body);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, item, 'Item updated'));
});

export const deleteItem = asyncHandler(async (req, res) => {
  await itemService.deleteItem(req.params.id);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, null, 'Item deleted'));
});
