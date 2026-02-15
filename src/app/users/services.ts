import prisma from "../../lib/prisma";
import { TUpdateUserSchema } from "../users/schema";
import { TStoreUserSchema } from "./schema";

class UserService {
  constructor() {}

  public async getUsers(search: string, limit: number, offset: number) {
    return await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: search } },
          { first_name: { contains: search } },
          { last_name: { contains: search } },
        ],
        deleted_at: null,
      },
      include: {
        role: true,
      },
      orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
      take: limit,
      skip: offset,
    });
  }

  public async getUsersTotal(search: string) {
    return await prisma.user.count({
      where: {
        OR: [
          { email: { contains: search } },
          { first_name: { contains: search } },
          { last_name: { contains: search } },
        ],
        deleted_at: null,
      },
    });
  }

  public async getUserById(id: string) {
    return await prisma.user.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
      include: {
        role: true,
      },
    });
  }

  public async getUserByEmail(email: string) {
    return await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
        },
        deleted_at: null,
      },
    });
  }

  public async createUser(body: TStoreUserSchema) {
    return await prisma.user.create({
      data: body,
    });
  }

  public async createCredential(body: any) {
    return await prisma.credential.create({
      data: body,
    });
  }

  public async updateUser(id: string, data: TUpdateUserSchema) {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });
  }

  public async deleteUser(id: string) {
    return await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}

export default UserService;
