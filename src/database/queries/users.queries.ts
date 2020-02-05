
export const insertUser = `
  INSERT INTO users (uid, display_name, email, photo_url, name)
    Values ($1, $2, $3, $4, $5)
  ON CONFLICT DO NOTHING
  RETURNING *
`;

// export const inserUserWhereNotExists = `
//   SELECT * FROM users WHERE uid = $1

// `;

export const inserUserKeys = ['uid', 'display_name', 'email', 'picture', 'name'];

export const getUserById = `
  SELECT * FROM users
  WHERE id = $1
  LIMIT 1
`;

export const getUserByUid = `
  SELECT * FROM users
  WHERE uid = $1
  LIMIT 1
`;


export const updateProfileWithImage = `
  UPDATE users
  SET name = $1, photo_url = $2
  WHERE uid = $3
  RETURNING *
`;

export const updateProfileName = `
  UPDATE users
  SET name = $1
  WHERE uid = $2
  RETURNING *
`;