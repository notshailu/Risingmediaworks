import { booksData } from "../data/dummyData";

const DELETED_DUMMY_KEY = "rmw_deleted_dummy_books";

/**
 * Get list of dummy book IDs that the admin has deleted
 */
export const getDeletedDummyBookIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_DUMMY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

/**
 * Delete a specific dummy book by ID
 */
export const deleteDummyBook = (id) => {
  try {
    const deleted = getDeletedDummyBookIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(DELETED_DUMMY_KEY, JSON.stringify(deleted));
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("dummy_books_updated"));
    }
    return true;
  } catch (e) {
    console.error("Error deleting dummy book:", e);
    return false;
  }
};

/**
 * Remove all dummy books from catalog
 */
export const deleteAllDummyBooks = () => {
  try {
    const allIds = booksData.map((b) => b.id);
    localStorage.setItem(DELETED_DUMMY_KEY, JSON.stringify(allIds));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("dummy_books_updated"));
    }
    return true;
  } catch (e) {
    console.error("Error deleting all dummy books:", e);
    return false;
  }
};

/**
 * Restore all dummy books (undo deletion)
 */
export const restoreAllDummyBooks = () => {
  try {
    localStorage.removeItem(DELETED_DUMMY_KEY);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("dummy_books_updated"));
    }
    return true;
  } catch (e) {
    console.error("Error restoring dummy books:", e);
    return false;
  }
};

/**
 * Get remaining active dummy books (excluding any deleted by admin)
 */
export const getActiveDummyBooks = () => {
  const deletedIds = getDeletedDummyBookIds();
  return booksData.filter((book) => !deletedIds.includes(book.id));
};
