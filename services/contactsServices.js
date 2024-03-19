import Contact from "../models/Contact.js";

export const listContacts = (filter = {}, query = {}) =>
  Contact.find(filter, "-createdAt -updatedAt", query);

export const addContact = (data) => Contact.create(data);

export const getContactById = (contactId) => Contact.findById(contactId);

export const updateContactById = (contactId, data) =>
  Contact.findByIdAndUpdate(contactId, data);

export const removeContact = (contactId) =>
  Contact.findByIdAndDelete(contactId);

export const updateFavoriteStatus = (contactId, data) =>
  Contact.findByIdAndUpdate(contactId, data);
