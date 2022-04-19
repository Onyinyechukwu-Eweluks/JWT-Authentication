import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { GET_ALL_USERS } from "./queries/Users";
import { CREATE_USER, LOGIN_USER } from "../resolvers/mutations/Users";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllUsers: GET_ALL_USERS,
  },
});

const Mutations = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    createUsers: CREATE_USER,
    loginUser: LOGIN_USER,
    //   deleteUser: DELETE_USER,
    //   updateUser: UPDATE_USER,
    //   updatePassword: UPDATE_PASSWORD,
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
