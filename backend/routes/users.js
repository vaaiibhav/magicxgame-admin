const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserbyUserName,
  getUserbyId,
  deleteUserbyId,
  createUser,
  updateUser,
  loginUser,
  userPinUpdate,
  getAvailableUser,
} = require("../controllers/userController");

const {
  simpleConsole,
  warnConsole,
  dangerConsole,
  successConsole,
  darkConsole,
} = require("../utils/colorConsoler");
const { passwordHashing, validateToken } = require("../middlewares/userAuth");
const tryCatcher = require("../utils/tryCatcher");

router.post(
  "/pinupdate",
  tryCatcher(async (req, res) => {
    const result = await userPinUpdate(req.body);
    res.json(req.body).status(200);
  })
);

router.post(
  "/login",
  tryCatcher(async (req, res) => {
    const { userLoginID, userPass } = req.body;
    if (!userLoginID || !userPass) {
      return res.status(401).json({ error: "Empty Credentials" });
    }
    const user = await loginUser(userLoginID, userPass);
    if (!user) {
      return res.status(409).json({ error: "Password Invalid" });
    }
    res.status(200).json({ token: user });
  })
);

router.get(
  "/logout",
  tryCatcher(async (req, res) => {
    res.status(200).clearCookie("token").json({ message: "success" });
  })
);

router.get(
  "/auth",
  validateToken,
  tryCatcher(async (req, res) => {
    res.json({ message: "token", token: req.token });
  })
);
router.delete(
  "/id/:id",
  tryCatcher(async (req, res) => {
    const { id } = req.params;
    const user = await deleteUserbyId(id);
    res.json({ user }).status(200);
  })
);
router.get(
  "/id/:id",
  tryCatcher(async (req, res) => {
    const { id } = req.params;
    const user = await getUserbyId(id);
    res.json({ user }).status(200);
  })
);
router.post(
  "/",
  tryCatcher(async (req, res) => {
    const { userName, userCity, userType, userPhoneNumber, userPercentage } =
      req.body;
    if (
      !userName ||
      !userCity ||
      !userType ||
      !userPhoneNumber ||
      !userPercentage
    ) {
      return res.json({ error: "Missing Data" }).status(500);
    }
    const user = await createUser(
      userName,
      userCity,
      userType,
      userPhoneNumber,
      userPercentage
    );
    res.json({ user }).status(200);
  })
);

router.put(
  "/",
  tryCatcher(async (req, res) => {
    const { userID, userName, userCity, userPhoneNumber, userPercentage } =
      req.body;
    const user = await updateUser(
      userName,
      userCity,
      userPhoneNumber,
      userPercentage,
      userID
    );
    res.json({ user }).status(200);
  })
);

router.get(
  "/avail/:userType/:userID",
  tryCatcher(async (req, res) => {
    const { userType, userID } = req.params;
    const userCount = await getAvailableUser(userType, userID);
    res.json({ userCount }).status(200);
  })
);
router.get(
  "/user/:userName",
  tryCatcher(async (req, res) => {
    const { userName } = req.params;
    const user = await getUserbyUserName(userName);
    res.json({ user }).status(200);
  })
);
router.get(
  "/:userType/:userID",
  tryCatcher(async (req, res) => {
    const { limit, offset } = req.query;
    const { userType, userID } = req.params;
    const users = await getAllUsers(limit, offset, userType, userID);
    res.json(users).status(200);
  })
);
module.exports = router;
