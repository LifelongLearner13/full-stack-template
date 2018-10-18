/* eslint-env node */
const db = require('../utils/dbSetup'); // Postgres database connection
const bcrypt = require('bcrypt');
const { BCRYPT_SALT_ROUNDS } = process.env;

// Use bcrypt to compare entered password and the encoded password stored in the database
const isValidPassword = async (userPswd, enteredPswd) => {
  const compare = await bcrypt.compare(enteredPswd, userPswd);
  return compare;
};

// Save user details in the database
const save = async (email, password) => {
  const hashedPswd = await bcrypt.hash(password, parseInt(BCRYPT_SALT_ROUNDS));

  try {
    const { rows } = await db.query(
      'INSERT INTO "user"(email, password) VALUES($1, $2) RETURNING email, preferences',
      [email, hashedPswd]
    );

    return {
      success: true,
      message: `User ${email} successfully created.`,
      user: rows[0],
    };
  } catch (err) {
    // Postgres error code
    if (err.code === '23505') {
      return {
        success: false,
        message: `User ${email} already exists.`,
      };
    }
    throw err;
  }
};

// Look up User by email in the database
const find = async email => {
  const { rows } = await db.query('SELECT * FROM "user" WHERE email = $1', [
    email,
  ]);

  const user = rows[0];

  if (!user) {
    return {
      success: false,
      message: `Email ${email} is not recognized.`,
    };
  }

  return {
    success: true,
    message: '',
    user: user,
  };
};

// Delete user from database
const del = async email => {
  const { rows } = await db.query('DELETE FROM "user" WHERE email = $1', [
    email,
  ]);

  const user = rows[0];

  if (!user) {
    return {
      success: false,
      message: `Email ${email} was not deleted.`,
    };
  }

  return {
    success: true,
    message: `User ${email} was successfully deleted.`,
  };
};

// Attempt to update user's password
const updatePswd = async (email, newPswd) => {
  return (async () => {
    const client = await db.pool.connect();

    try {
      // Start transaction
      await client.query('BEGIN');
      const { rows } = await client.query(
        'SELECT * FROM "user" WHERE email = $1',
        [email]
      );

      const oldPswd = rows[0].password;

      const isSamePswd = await bcrypt.compare(newPswd, oldPswd);

      if (isSamePswd) {
        return {
          success: false,
          message: `Password for ${email} not changed. Entered value was the same as current password.`,
        };
      }

      newPswd = await bcrypt.hash(newPswd, parseInt(BCRYPT_SALT_ROUNDS));

      await client.query('UPDATE "user" SET password = $2 WHERE email = $1', [
        email,
        newPswd,
      ]);
      await client.query('COMMIT'); // Close transaction

      return {
        success: true,
        message: `Password for ${email} successfully changed.`,
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  })().catch(err => {
    console.error(err.stack);
    return {
      success: false,
      message: 'Something went wrong, please try again.',
    };
  });
};

// Return a user's preferences stored in the database
const findPref = async email => {
  const { rows } = await db.query(
    'SELECT preferences FROM "user" WHERE email = $1',
    [email]
  );

  return {
    success: true,
    message: `Preferences for ${email} successfully found`,
    preferences: rows[0].preferences ? rows[0].preferences : {},
  };
};

// Update user's preferences stored in the database
const updatePref = async (email, newPref) => {
  return (async () => {
    const client = await db.pool.connect();

    try {
      // Start transaction
      await client.query('BEGIN');
      const { rows } = await client.query(
        'SELECT preferences FROM "user" WHERE email = $1',
        [email]
      );

      // Merge old preferences with new, this means if what is sent from the client
      // is only part of the entire preferences object information is not overwritten.
      const oldPref = rows[0].preferences ? rows[0].preferences : {};
      const mergedPref = { ...oldPref, ...newPref };

      const result = await client.query(
        'UPDATE "user" SET preferences = $2 WHERE email = $1 RETURNING preferences',
        [email, mergedPref]
      );
      await client.query('COMMIT'); // Close transaction
      return {
        success: true,
        message: `Preferences for ${email} successfully changed.`,
        preferences: result.rows[0].preferences
          ? result.rows[0].preferences
          : {},
      };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })().catch(e => console.error(e.stack));
};

module.exports = {
  save,
  find,
  updatePswd,
  del,
  isValidPassword,
  findPref,
  updatePref,
};
