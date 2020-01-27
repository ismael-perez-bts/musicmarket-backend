// export const filteredItems = `
//   SELECT 
//     id, title, description, condition, price, currency, category, state, date_created, date_updated, image_url,
//   FROM items
//   WHERE ($1::varchar is null OR tokens @@ to_tsquery('spanish', $1::varchar))
//   AND ($2::smallint is null OR category = $2::smallint)
//   AND state <= $3
//   AND state != 3
//   AND ($4::smallint is null OR condition = $4::smallint)
//   ORDER BY date_created DESC, date_updated DESC
// `;

export const itemById = `
  SELECT * FROM items i
  INNER JOIN users u ON i.user_uid = u.uid
  WHERE i.id = $1
`;

export const filteredItems = `
  SELECT 
    i.id,
    i.title,
    i.description, 
    i.condition,
    i.price, i.currency,
    i.category,
    i.state,
    i.date_created,
    i.date_updated,
    i.image_url,
    i.user_uid,
    u.uid,
    u.display_name
  FROM items i
  INNER JOIN users u ON i.user_uid = u.uid
  WHERE ($1::varchar is null OR tokens @@ to_tsquery('spanish', $1::varchar))
  AND ($2::smallint is null OR category = $2::smallint)
  AND state <= $3
  AND state != 3
  AND ($4::smallint is null OR condition = $4::smallint)
  ORDER BY date_created DESC, date_updated DESC
`;

export const filteredItemsWithLocation = `
  SELECT 
    i.id,
    i.title,
    i.description,
    i.condition,
    i.price,
    i.currency,
    i.category, 
    i.state,
    i.date_created,
    i.date_updated,
    i.image_url,
    u.uid,
    u.display_name,
    ST_Distance_Sphere(
      ST_GeomFromText('POINT(' || $1 || ' ' || $2 || ')'), i.location
    ) / 1000 as km
  FROM items i
  INNER JOIN users u ON i.user_uid = u.uid
  WHERE ($3::varchar is null OR tokens @@ to_tsquery('spanish', coalesce($3::varchar)))
  AND ST_Distance_Sphere(
    ST_GeomFromText('POINT(' || $1 || ' ' || $2 || ')'), i.location
  ) <= $7
  AND ($4::smallint is null OR i.category = $4::smallint)
  AND i.state <= $5
  AND i.state != 3
  AND ($6::smallint is null OR condition = $6::smallint)
  AND i.price <= $8
  AND i.price >= $9
  ORDER BY km ASC, date_created DESC, date_updated DESC
`;

export const createNewItem = `
  INSERT INTO items(title, description, condition, price, currency, category, state, 
    date_created, location, tokens, user_uid, image_url)
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP,
    ST_GeomFromText('POINT(' || $9 || ' ' || $8 || ')', 4326),
    to_tsvector('spanish', $10), $11, $12
  )
  RETURNING id, title, description, condition, price, currency, category, state, date_created, location, user_uid, image_url
`;
