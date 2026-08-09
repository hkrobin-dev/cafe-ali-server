import mongoose from 'mongoose';
import { ROLE_LIST, ROLES } from '../../constants/roles.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, select: false }, // absent for Google-only accounts
    photoURL: { type: String, default: '' },
    role: { type: String, enum: ROLE_LIST, default: ROLES.USER },
    provider: { type: String, enum: ['password', 'google'], default: 'password' },
    googleId: { type: String, default: null },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Never leak password hashes even if a query forgets to .select('-password')
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const UserModel = mongoose.model('User', userSchema);
export default UserModel;
