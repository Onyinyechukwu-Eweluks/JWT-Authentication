import { GraphQLObjectType, GraphQLID, GraphQLString } from "graphql";

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    userName: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});
