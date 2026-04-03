const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToke, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photo?.[0]?.value;

        const { rows } = await pool.query(
          `INSERT INTO users (google_id, email, name, avatar)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (google_id) DO UPDATE
             SET email  = EXCLUDED.email,
                 name   = EXCLUDED.name,
                 avatar = EXCLUDED.avatar
           RETURNING *`,
           [profile.id, email, profile.displayName, avatar]
        );


        return done(null, rows[0]);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

module.exports = passport;