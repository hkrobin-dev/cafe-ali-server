import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { STATUS } from '../../constants/statusCodes.js';
import { ContactModel } from './contact.model.js';

export const createContact = asyncHandler(async (req, res) => {
  const contact = await ContactModel.create(req.body);
  res.status(STATUS.CREATED).json(new ApiResponse(STATUS.CREATED, contact, 'Message sent successfully'));
});

export const listContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [contacts, total] = await Promise.all([
    ContactModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ContactModel.countDocuments(filter),
  ]);

  res.status(STATUS.OK).json(
    new ApiResponse(STATUS.OK, { contacts, meta: { total, page: Number(page), limit: Number(limit) } })
  );
});

export const updateContact = asyncHandler(async (req, res) => {
  const contact = await ContactModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!contact) throw new ApiError(STATUS.NOT_FOUND, 'Contact message not found.');
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, contact, 'Status updated'));
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await ContactModel.findByIdAndDelete(req.params.id);
  if (!contact) throw new ApiError(STATUS.NOT_FOUND, 'Contact message not found.');
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, null, 'Message deleted'));
});
