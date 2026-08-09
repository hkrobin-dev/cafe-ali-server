import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// One review per user per item (duplicate-review prevention)
reviewSchema.index({ item: 1, user: 1 }, { unique: true });

export const ReviewModel = mongoose.model('Review', reviewSchema);
export default ReviewModel;
