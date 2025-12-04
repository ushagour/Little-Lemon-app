// Load MENU items from SQLite
export const getAllItems = async (db) => {
  return await db.getAllAsync("SELECT * FROM menu");
};
//load item by id
export const getMenuItemById = async (db, id) => {
  const items = await db.getAllAsync("SELECT * FROM menu WHERE id = ?", [id]);
  return items.length > 0 ? items[0] : null;
};  

// Insert MENU items into SQLite
export const insertMenuIntoSQLite = async (db, menuItems) => {
  const insertPromises = menuItems.map((item) => {
    return db.runAsync(
      `INSERT INTO menu (id, name, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?)`,
      [item.id, item.name, item.description, item.price, item.category, item.image]
    );
  });
  await Promise.all(insertPromises);
}
