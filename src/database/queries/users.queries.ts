
export const insertUser = `
  INSERT INTO users (uid, display_name, email, photo_url, name)
    Values ($1, $2, $3, $4, $5)
  ON CONFLICT DO NOTHING
`;

// export const inserUserWhereNotExists = `
//   SELECT * FROM users WHERE uid = $1

// `;

export const inserUserKeys = ['uid', 'display_name', 'email', 'picture', 'name'];
