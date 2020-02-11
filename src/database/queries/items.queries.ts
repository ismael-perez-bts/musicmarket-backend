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
  SELECT 
    i.id,
    i.title,
    i.description,
    i.condition,
    i.price,
    i.state,
    i.date_created,
    i.date_updated,
    i.state_id,
    i.city_id,
    i.image_url,
    u.name as user_name,
    u.photo_url as user_profile_image,
    u.id as user_id,
    u.uid as user_uid,
    s.name as state_name,
    c.city_name,
    cat.label as category_label,
    cat.id as category_id
  FROM items i
  INNER JOIN users u ON i.user_uid = u.uid
  INNER JOIN states s ON i.state_id = s.id
  INNER JOIN cities c ON ( i.city_id = c.city_id AND i.state_id = c.state_id )
  INNER JOIN categories cat ON i.category = cat.id
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

export const filteredItemsByPriceMax = `
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
  ORDER BY i.price DESC, date_created DESC, date_updated DESC
`;

export const filteredItemsByPriceMin = `
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
  ORDER BY i.price ASC, date_created DESC, date_updated DESC
`;

export const filteredItemsWithLocationSortByDistance = `
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

export const filteredItemsWithLocationSortByRecent = `
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
  ORDER BY date_created DESC, date_updated DESC, km ASC
`;

export const filteredItemsWithLocationSortByPriceMax = `
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
  ORDER BY i.price DESC, date_created DESC, date_updated DESC, km ASC
`;

export const filteredItemsWithLocationSortByPriceMin = `
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
  ORDER BY i.price ASC, date_created DESC, date_updated DESC, km ASC
`;

export const createNewItem = `
  INSERT INTO items(title, description, condition, price, currency, category, state, 
    date_created, location, tokens, user_uid, image_url, city_id, state_id)
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP,
    ST_GeomFromText('POINT(' || $9 || ' ' || $8 || ')', 4326),
    to_tsvector('spanish', $10), $11, $12, $13, $14
  )
  RETURNING id, title, description, condition, price, currency, category, state, date_created, location, user_uid, image_url
`;

export const itemsByUserUid = `
  SELECT 
    i.id,
    i.title,
    i.description,
    i.condition,
    i.price,
    i.state,
    i.date_created,
    i.date_updated,
    i.state_id,
    i.city_id,
    i.image_url,
    s.name as state_name,
    c.city_name,
    cat.label as category_label,
    cat.id as category_id
  FROM items i
  INNER JOIN states s ON i.state_id = s.id
  INNER JOIN cities c ON ( i.city_id = c.city_id AND i.state_id = c.state_id )
  INNER JOIN categories cat ON i.category = cat.id
  WHERE i.user_uid = $1
`;