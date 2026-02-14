import { Router } from "express";
import UserController from "./controllers";
// import validate from "../../lib/zod-validator";
import { hasAllPermission } from "../../middlewares/permission";

const router: Router = Router();

const userController = new UserController();

router.get("/list", hasAllPermission(["users:view_list"]), userController.list);
router.get("/show/:id", hasAllPermission(["users:view_detail"]), userController.show);

export default router;
