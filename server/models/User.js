const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  const { password } = user;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  const { password } = user;

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
