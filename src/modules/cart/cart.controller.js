import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { STATUS } from '../../constants/statusCodes.js';
import { CartModel } from './cart.model.js';
import { ItemModel } from '../item/item.model.js';

// GET /carts?email=... -> only the authenticated user's own cart (ownership enforced by verifyOwnership)
export const getCarts = asyncHandler(async (req, res) => {
  const carts = await CartModel.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, carts));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { itemId, quantity = 1 } = req.body;
  if (!itemId) throw new ApiError(STATUS.BAD_REQUEST, 'itemId is required.');

  const item = await ItemModel.findById(itemId);
  if (!item) throw new ApiError(STATUS.NOT_FOUND, 'Item not found.');

  const cartEntry = await CartModel.create({
    user: req.user._id,
    email: req.user.email,
    item: item._id,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity,
  });

  res.status(STATUS.CREATED).json(new ApiResponse(STATUS.CREATED, cartEntry, 'Added to cart'));
});

export const deleteCartItem = asyncHandler(async (req, res) => {
  const cartItem = await CartModel.findById(req.params.id);
  if (!cartItem) throw new ApiError(STATUS.NOT_FOUND, 'Cart item not found.');

  if (String(cartItem.user) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(STATUS.FORBIDDEN, 'You can only remove items from your own cart.');
  }

  await cartItem.deleteOne();
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, null, 'Removed from cart'));
});
