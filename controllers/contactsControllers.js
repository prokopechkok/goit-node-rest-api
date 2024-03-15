import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactById,
  updateFavoriteStatus,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlwrapper from "../helpers/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const result = await listContacts();
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await getContactById(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const result = await addContact(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await updateContactById(id, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};
const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await updateFavoriteStatus(id, req.body);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};
const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export default {
  getAllContacts: ctrlwrapper(getAllContacts),
  getOneContact: ctrlwrapper(getOneContact),
  deleteContact: ctrlwrapper(deleteContact),
  createContact: ctrlwrapper(createContact),
  updateContact: ctrlwrapper(updateContact),
  updateStatusContact: ctrlwrapper(updateStatusContact),
};
