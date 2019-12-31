export const filteredItems = `
  SELECT 
    id, title, description, condition, price, currency, category, state, date_created, date_updated
  FROM items
  WHERE ($1::varchar is null OR tokens @@ to_tsquery('spanish', $1::varchar))
  AND ($2::smallint is null OR category = $2::smallint)
  AND state <= $3
  AND state != 3
  AND ($4::smallint is null OR condition = $4::smallint)
  ORDER BY date_created DESC, date_updated DESC
`;

export const filteredItemsWithLocation = `
  SELECT 
    id, title, description, condition, price, currency, category, state, date_created, date_updated,
    ST_Distance_Sphere(
      ST_GeomFromText('POINT(' || $1 || ' ' || $2 || ')'), items.location
    ) / 1000 as km
  FROM items
  WHERE ($3::varchar is null OR tokens @@ to_tsquery('spanish', coalesce($3::varchar)))
  AND ($4::smallint is null OR category = $4::smallint)
  AND state <= $5
  AND state != 3
  AND ($6::smallint is null OR condition = $6::smallint)
  ORDER BY KM ASC, date_created DESC, date_updated DESC
`;

export const createNewItem = `
  INSERT INTO items(title, description, condition, price, currency, category, state, 
    date_created, location, tokens)
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP,
    ST_GeomFromText('POINT(' || $8 || ' ' || $9 || ')', 4326),
    to_tsvector('spanish', $10)
  )
`;
