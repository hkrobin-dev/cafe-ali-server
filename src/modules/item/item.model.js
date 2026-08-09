import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    recipe: { type: String, default: '' }, // long-form details / specifications
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 }, // stock
    sold: { type: Number, default: 0 },
    location: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

itemSchema.index({ name: 'text', description: 'text' });

export const ItemModel = mongoose.model('Item', itemSchema);
export default ItemModel;
