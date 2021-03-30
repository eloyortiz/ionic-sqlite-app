CREATE TABLE IF NOT EXISTS developers(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,skills TEXT,img TEXT);
INSERT or IGNORE INTO developers VALUES (1, 'Eloy', '["Joker"]', 'https://pbs.twimg.com/profile_images/1347849675982974982/HuPP6Luu_400x400.jpg');
INSERT or IGNORE INTO developers VALUES (2, 'Capt. America', '["Honor","Loyalty"]', 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/3c659e38650505.5a66355da634e.png');
INSERT or IGNORE INTO developers VALUES (3, 'Spidy', '["Aranic sense","extra power"]', 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/cdfb9038650505.598fa289163de.png');
INSERT or IGNORE INTO developers VALUES (4, 'Ironman', '["Attack","fly"]', 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/e13eb438650505.598fa118c8eab.jpg');
INSERT or IGNORE INTO developers VALUES (5, 'Hulk', '["Force","destruction"]', 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/7dae7438650505.598fa119bd7b4.jpg');
 
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, creatorId INTEGER);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (1, 'SICINET', 1);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (2, 'Jarvis', 4);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (3, 'Travel Suit', 5);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (4, 'Shield', 2);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (5, 'Games Inc', 3);
INSERT or IGNORE INTO products (id, name, creatorId) VALUES (6, 'IronSpider', 4);