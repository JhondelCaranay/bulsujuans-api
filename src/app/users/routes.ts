import { Router } from "express";
import UserController from "./controllers";
import { hasAllPermission } from "../../middlewares/permission";
import validate from "../../lib/zod-validator";
import { storeUserSchema, updateUserSchema } from "./schema";
import { upload } from "../../lib/config/multer";

const router: Router = Router();

const userController = new UserController();

router.get("/list", hasAllPermission(["users:view_list"]), userController.list);
router.get("/show/:id", hasAllPermission(["users:view_detail"]), userController.show);
router.post("/store", hasAllPermission(["users:create"]), validate(storeUserSchema), userController.store);
router.patch("/update/:id", hasAllPermission(["users:edit"]), validate(updateUserSchema), userController.update);
router.delete("/destroy/:id", hasAllPermission(["users:delete"]), userController.destroy);

router.patch(
  "/photo/update/:id",
  hasAllPermission(["users:edit"]),

  upload.single("documents"),
  validate(updateUserSchema),
  userController.updatePhoto,
);

export default router;
