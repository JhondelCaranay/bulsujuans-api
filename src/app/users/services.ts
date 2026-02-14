import prisma from "../../lib/prisma";

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

  public async create(body: any) {
    return body;
  }
}

export default UserService;
