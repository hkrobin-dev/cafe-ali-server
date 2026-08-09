import { ItemModel } from './item.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { STATUS } from '../../constants/statusCodes.js';

const SORT_MAP = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating_desc: { rating: -1 },
  newest: { createdAt: -1 },
};

export const listItems = async (queryParams) => {
  const {
    search = '',
    category = '',
    minPrice,
    maxPrice,
    rating,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = queryParams;

  const filter = {};
  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (rating) filter.rating = { $gte: Number(rating) };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortOption = SORT_MAP[sort] || SORT_MAP.newest;

  const [items, total] = await Promise.all([
    ItemModel.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
    ItemModel.countDocuments(filter),
  ]);

  return {
    items,
    meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
  };
};

export const getItemById = async (id) => {
  const item = await ItemModel.findById(id);
  if (!item) throw new ApiError(STATUS.NOT_FOUND, 'Item not found.');
  return item;
};

export const getRelatedItems = async (id, limit = 4) => {
  const item = await ItemModel.findById(id);
  if (!item) throw new ApiError(STATUS.NOT_FOUND, 'Item not found.');
  return ItemModel.find({ category: item.category, _id: { $ne: id } }).limit(Number(limit));
};

export const createItem = async (payload, userId) => {
  return ItemModel.create({ ...payload, createdBy: userId });
};

export const updateItem = async (id, updates) => {
  const item = await ItemModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!item) throw new ApiError(STATUS.NOT_FOUND, 'Item not found.');
  return item;
};

export const deleteItem = async (id) => {
  const item = await ItemModel.findByIdAndDelete(id);
  if (!item) throw new ApiError(STATUS.NOT_FOUND, 'Item not found.');
  return item;
};
