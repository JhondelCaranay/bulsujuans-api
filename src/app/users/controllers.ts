import { Request, Response } from "express";
import UserService from "./services";
import { io } from "../../server";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../lib/utils";
import { parseEnumParam } from "../../lib/prisma";

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

  // create = async (req: Request, res: Response) => {
  //   try {
  //     const response = await this.userService.create("hello world");
  //     io.emit("hey", 1);
  //     return res.status(201).json(response);
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(400).json({ message: "something went wrong..." });
  //   }
  // };
}

export default UserController;
