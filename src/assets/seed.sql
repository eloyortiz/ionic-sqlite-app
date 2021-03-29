CREATE TABLE IF NOT EXISTS developers(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,skills TEXT,img TEXT);
INSERT or IGNORE INTO developers VALUES (1, 'Eloy', '', 'https://pbs.twimg.com/profile_images/1347849675982974982/HuPP6Luu_400x400.jpg');
INSERT or IGNORE INTO developers VALUES (2, 'Clara', '', 'https://pbs.twimg.com/profile_images/849583476881977344/UatdNe3h_400x400.jpg');
INSERT or IGNORE INTO developers VALUES (3, 'Kevin', '', 'https://pbs.twimg.com/profile_images/3119818015/9836af4748f37296786da5fe21908e2b_400x400.png');
 
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, creatorId INTEGER);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (1, 'SICINET', 1);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (2, 'Softmanual', 1);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (3, 'Ionic Framework', 2);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (4, 'SolInformaticas', 2);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (5, 'Casting & Testing', 3);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (6, 'Ionicons', 3);