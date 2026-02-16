import { Request, Response } from "express";
import UserService from "./services";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../lib/utils";
import { TStoreUserSchema, TUpdateUserSchema } from "./schema";

class UserController {
  private userService: UserService = new UserService();
  constructor() {}

  list = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const offset = (page - 1) * limit;

      const data = await this.userService.getUsers(search, limit, offset);
      const total = await this.userService.getUsersTotal(search);

      return res.status(StatusCodes.OK).json({
        data: data,
        success: true,
        message: "Get Users",
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.log("🚀 ~ UserController ~ error:", error);
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Server Error. Failed to fetch users");
    }
  };

  show = async (req: Request, res: Response) => {
    try {
      const { id }: { id?: string } = req.params;
      const data = await this.userService.getUserById(id);

      if (!data) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "User id doesn't exist");
      }

      return res.status(StatusCodes.OK).json({
        data,
        success: true,
        message: "Get User Detail",
      });
    } catch (error) {
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Server Error. Failed to fetch user");
    }
  };

  store = async (req: Request, res: Response) => {
    const body = req.body as TStoreUserSchema;
    try {
      const user = await this.userService.getUserByEmail(body.email);

      if (user) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "User already exist");
      }

      const credentialData = await this.userService.createCredential({
        email: body.email,
        student_id: body.student_id,
        access_token: "",
        refresh_token: "",
      });

      const userData = {
        ...body,
        credential_id: credentialData.id,
      };

      const data = await this.userService.createUser(userData);

      if (!data) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "Failed to create user");
      }

      return res.status(StatusCodes.CREATED).json({
        data,
        success: true,
        message: "User Created Successfully",
      });
    } catch (error) {
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Server Error. Failed to create user");
    }
  };

  update = async (req: Request, res: Response) => {
    const { id }: { id?: string } = req.params;
    const body = req.body as TUpdateUserSchema;
    try {
      const user = await this.userService.getUserById(id);

      if (!user) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "User id doesn't exist");
      }

      const data = await this.userService.updateUser(id, body);

      return res.status(StatusCodes.OK).json({
        data,
        success: true,
        message: "User Updated Successfully",
      });
    } catch (error) {
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Server Error. Failed to update user");
    }
  };

  destroy = async (req: Request, res: Response) => {
    try {
      const { id }: { id?: string } = req.params;

      const user = await this.userService.getUserById(id);

      if (!user) {
        throw new CustomError(StatusCodes.BAD_REQUEST, "User id doesn't exist");
      }

      await this.userService.updateUser(id, {
        status: false,
      });

      const data = await this.userService.deleteUser(id);

      return res.status(StatusCodes.OK).json({
        data,
        success: true,
        message: "User Deleted Successfully",
      });
    } catch (error) {
      throw new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Server Error. Failed to delete user");
    }
  };
}

export default UserController;
