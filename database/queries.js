// Load MENU items from SQLite
export const getAllItems = async (db) => {
  return await db.getAllAsync("SELECT * FROM menu");
};

//load item by id
export const getMenuItemById = async (db, id) => {
  const items = await db.getAllAsync("SELECT * FROM menu WHERE id = ?", [id]);
  return items.length > 0 ? items[0] : null;
};  

// Insert MENU items into SQLite (sequential to avoid statement finalization issues)
export const insertMenuIntoSQLite = async (db, menuItems = []) => {
  if (!db) throw new Error('db is required');
  const items = Array.isArray(menuItems) ? menuItems : [menuItems];
  await ensureMenuTable(db);

  for (const item of items) {
    const vals = [
      item.id || null,
      item.name || '',
      item.description || '',
      typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
      item.category || '',
      item.image || '',
    ];
    // eslint-disable-next-line no-await-in-loop
    await db.runAsync(
      `INSERT OR REPLACE INTO menu (id, name, description, price, category, image) VALUES (?, ?, ?, ?, ?, ?)`
      , vals
    );
  }
};



export const ensureMenuTable = async (db) => {
  await db.runAsync(
    `CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      category TEXT,
      image TEXT
    )`
  );
};



//empty the menu table
export const clearMenuTable = async (db) => {
  await db.runAsync(`DELETE FROM menu`);
};