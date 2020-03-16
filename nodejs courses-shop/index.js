const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const addRoutes = require("./routes/add");
const homeRoutes = require("./routes/home");
const coursesRoutes = require("./routes/courses");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
// const User = require("./models/user");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const errorHandler = require("./middleware/error");
const fileMiddleware = require("./middleware/file");

const keys = require("./keys");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  allowProtoMethodsByDefault: true,
  allowedProtoMethods: true,
  helpers: require("./utils/hbs-helpers")
});

const store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById("5e459de85784e60458e8409a");
//     req.user = user;
//     next();
//   } catch (e) {
//     console.log(e);
//   }
// });

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
  })
);
app.use(fileMiddleware.single("avatar"));
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.use(errorHandler);

// app.get("/", (req, res) => {
//   res.render("index", {
//     title: "Главная страница",
//     isHome: true
//   });
// });

// app.get("/add", (req, res) => {
//   res.render("add", {
//     title: "Добавить курс",
//     isAdd: true
//   });
// });

// app.get("/courses", (req, res) => {
//   res.render("courses", {
//     title: "Курсы",
//     isCourses: true
//   });
// });

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // const url = `mongodb+srv://Dmitry:limar$17485@cluster0-xoi2r.mongodb.net/shop`;
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: "dmitry@mail.ru",
    //     name: "dmitry",
    //     cart: { items: [] }
    //   });
    //   await user.save();
    // }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
