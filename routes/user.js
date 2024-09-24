const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signup", (req, res) => {
  res.render("signup", {
    logo: "/images/the-blog-logo.png",
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    logo: "/images/the-blog-logo.png",
  });
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  let user = await User.create({
    fullName,
    email,
    password,
  });

  let token = User.createToken(user);
  res.cookie("token", token).redirect("/");

});

router.post("/login", async (req, res) => {
  // #0081C6
  const { email, password } = req.body;

  try {
    let user = await User.matchUserPassword(email, password);
    let token = User.createToken(user);
    res.cookie("token", token).redirect("/");
  } catch (err) {
    res.render("login", {
      error: "Invalid email or password",
      logo: "/images/the-blog-logo.png",
    });
  }
});

router.get("/logout", async (req, res) => {
  return res.clearCookie("token").redirect("/");
});

module.exports = router;
