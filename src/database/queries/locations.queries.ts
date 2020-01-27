export const insertCity = `
  INSERT INTO cities(
    inegi_default_id,
    state_id,
    city_id,
    city_name,
    inegi_id,
    inegi_name, 
    minx,
    miny,
    maxx,
    maxy,
    lat,
    lng,
    location_center
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 
    ST_GeomFromText('POINT(' || $14 || ' ' || $13 || ')', 4326)
  )
`;

export const findNearestCity = `
  SELECT 
    city_name,
    city_id,
    state_id,
    ST_Distance_Sphere(
      ST_GeomFromText('POINT(' || $1 || ' ' || $2 || ')'), location_center
    ) / 1000 as km
  FROM cities
  ORDER BY KM ASC
  LIMIT 1
`;

export const getCitiesByStateId = `
  SELECT
    city_name,
    city_id,
    state_id,
    lat,
    lng
  FROM cities
  WHERE state_id = $1
  ORDER BY city_id
`;