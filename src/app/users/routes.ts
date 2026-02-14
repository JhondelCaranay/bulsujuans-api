import { Router } from "express";
import UserController from "./controllers";
// import validate from "../../lib/zod-validator";
import { hasAllPermission } from "../../middlewares/permission";

const router: Router = Router();

const userController = new UserController();

router.get("/list", hasAllPermission(["users:view_list"]), userController.list);

export default router;
