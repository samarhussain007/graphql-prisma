import JWT from "jsonwebtoken";
import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";

const JWT_SECRET = "superman@123";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}
export interface GetUserTokenPayload {
  email: string;
  password: string;
}
class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");

    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: this.generateHash(salt, password),
        salt,
      },
    });
  }

  public static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await this.getUserByEmail(email);
    if (!user) throw new Error("user not found");
    const salt = user.salt;
    const usersHashedPassword = this.generateHash(salt, password);

    if (usersHashedPassword !== user.password)
      throw new Error("Incorrect Password");

    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }
}

export default UserService;
