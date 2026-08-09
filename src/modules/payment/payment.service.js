import Stripe from 'stripe';
import { PaymentModel } from './payment.model.js';
import { CartModel } from '../cart/cart.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { STATUS } from '../../constants/statusCodes.js';
import { env } from '../../config/env.js';

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;

// Recomputes the payable total strictly from DB cart records - never trusts a client-sent price
const computeCartTotal = async (cartIds, userId) => {
  const carts = await CartModel.find({ _id: { $in: cartIds }, user: userId });

  if (carts.length !== cartIds.length) {
    throw new ApiError(STATUS.BAD_REQUEST, 'One or more cart items are invalid or do not belong to you.');
  }

  const amount = carts.reduce((sum, c) => sum + c.price * c.quantity, 0);
  return { carts, amount };
};

export const createPaymentIntent = async (cartIds, userId) => {
  if (!stripe) {
    throw new ApiError(STATUS.INTERNAL, 'Payments are not configured on the server.');
  }

  const { amount } = await computeCartTotal(cartIds, userId);
  if (amount <= 0) throw new ApiError(STATUS.BAD_REQUEST, 'Cart total must be greater than 0.');

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // cents
    currency: 'usd',
    payment_method_types: ['card'],
  });

  return { clientSecret: paymentIntent.client_secret, amount };
};

export const createPayment = async ({ transactionId, cartIds }, user) => {
  const { carts, amount } = await computeCartTotal(cartIds, user._id);

  const payment = await PaymentModel.create({
    user: user._id,
    email: user.email,
    transactionId,
    amount,
    items: carts.map((c) => ({ item: c.item, name: c.name, price: c.price, quantity: c.quantity })),
    cartIds,
    status: 'paid',
  });

  // Clear purchased items from the cart
  await CartModel.deleteMany({ _id: { $in: cartIds } });

  return payment;
};

export const getPaymentsByEmail = async (email) => {
  return PaymentModel.find({ email }).sort({ createdAt: -1 });
};
