const { Router } = require("express");
// const Cart = require("../models/cart");
const Course = require("../models/course");
const auth = require("../middleware/auth");
const router = Router();

function mapCartItems(cart) {
  return cart.items.map(c => {
    return {
      ...c.courseId._doc,
      id: c.courseId.id,
      count: c.count
    };
  });
}

function computePrice(courses) {
  courses.reduce((total, course) => {
    return (total += course.price * course.count);
  }, 0);
}

router.post("/add", auth, async (req, res) => {
  const course = await Course.findById(req.body.id);
  console.log(req.user);
  await req.user.addToCart(course);
  res.redirect("/cart");
});

router.delete("/remove/:id", auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.courseId").execPopulate();

  const courses = mapCartItems(user.cart);

  const cart = {
    courses,
    price: computePrice(courses)
  };
  // const cart = await Cart.remove(req.params.id);
  res.status(200).json(cart);
});

router.get("/", auth, async (req, res) => {
  // const cart = await Cart.fetch();

  const user = await req.user.populate("cart.items.courseId").execPopulate();

  const courses = mapCartItems(user.cart);

  res.render("cart", {
    title: "Корзина",
    isCart: true,
    courses: courses,
    price: computePrice(courses)
  });
});

module.exports = router;
