import jwt from "jsonwebtoken";

const signAccess = (user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
      (error, encoded) => {
        if (error) reject(error);
        else resolve(encoded);
      }
    );
  });
};

const signRefresh = (res, user) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: user._id, uname: user.username, email: user.email },
      process.env.JWT_SECRET_REFRESH,
      { expiresIn: "7d" },
      (error, encoded) => {
        if (error) reject(error);

        res.cookie("refreshToken", encoded, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        resolve(encoded);
      }
    );
  });
};

const verifyAccess = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      else resolve(decoded);
    });
  });
};
const verifyRefresh = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_REFRESH, (error, decoded) => {
      if (error) reject(error);
      else resolve(decoded);
    });
  });
};

export { signAccess, signRefresh, verifyAccess, verifyRefresh };
