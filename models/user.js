const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const {convertUserToToken} = require("../services/auth")


const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profileImageUrl: {
      type: String,
      default: "/images/default.png",
    },
    roll: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return;

  let salt = randomBytes(16).toString();

  let hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  return next();
});

userSchema.static("matchUserPassword", async function (email, password) {
  let user = await this.findOne({ email });

  if (!user) throw new Error("user not found!");

  let providedHashedPassword = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (providedHashedPassword !== user.password)
    throw new Error("Incorrect password");

  return user;
});

userSchema.static("createToken", function(user){
  
  const payload = {
    _id:user._id,
    fullName:user.fullName,
    email:user.email,
    profileImageUrl:user.profileImageUrl,
    roll:user.roll
  }

  return convertUserToToken(payload)
})

const User = model("user", userSchema);

module.exports = User;
