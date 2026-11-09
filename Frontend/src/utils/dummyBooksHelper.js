/**
 * Dummy books have been permanently removed.
 * All books are now managed directly via the MongoDB backend API (/api/books).
 */

export const getDeletedDummyBookIds = () => [];
export const deleteDummyBook = () => true;
export const deleteAllDummyBooks = () => true;
export const restoreAllDummyBooks = () => true;
export const getActiveDummyBooks = () => [];

