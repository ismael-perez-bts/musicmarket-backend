CREATE TABLE items (
  id SERIAL,
  title VARCHAR(70),
  description TEXT,
  condition SMALLINT,
  show_condition BOOLEAN,
  price FLOAT,
  show_price BOOLEAN,
  currency VARCHAR(3),
  custom_fields BOOLEAN DEFAULT FALSE
);

CREATE TABLE config (
  id SERIAL,
  custom_fields BOOLEAN DEFAULT FALSE,
  show_price BOOLEAN DEFAULT FALSE,
  custom_theme BOOLEAN DEFAULT FALSE
);

INSERT INTO items(title, description, condition, price, currency, location)
VALUES (
  'VOX AC4TV', 'Amplificador de bulbos', '3', 2700, 'MXN', 'POINT(0 0)'
);