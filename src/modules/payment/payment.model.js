import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email: { type: String, required: true, index: true },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    cartIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }],
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model('Payment', paymentSchema);
export default PaymentModel;
