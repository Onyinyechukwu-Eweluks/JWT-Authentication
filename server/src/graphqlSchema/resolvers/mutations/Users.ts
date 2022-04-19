import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "../../typeDefinition/UserType";
import { Users } from "../../../entity/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MyContext } from "../../../typescript/MyContext";

export const CREATE_USER = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    userName: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent: any, args: any) {
    let { email, userName, password } = args;
    return await bcrypt
      .hash(password, 10)
      .then((hash) => {
        let user = Users.create({ email, userName, password: hash });
        return user.save();
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  },
};

export const LOGIN_USER = {
  type: new GraphQLObjectType({
    name: "token",
    fields: () => ({
      accessToken: { type: GraphQLString },
    }),
  }),
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent: any, args: any, { req, res }: MyContext) {
    let { email, password } = args;
    const user = await Users.findOne({ email: email });
    // const userPassword = user?.password

    if (!user) {
      throw new Error("User does not exist please register");
    }

    const passwordMatch = await bcrypt.compare(password, user?.password);

    if (!passwordMatch) {
      throw new Error("Email and password does not match");
    }

    // return 'Login successfully'
    const token = jwt.sign(
      {
        email,
        password,
        id: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
      {
        email,
        password,
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("jid", refreshToken, { httpOnly: true });

    return {
      accessToken: token,
    };
  },
};
