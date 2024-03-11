const { GraphQLError } = require("graphql");

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const typeDefs = `
type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: String!
    }
type Author {
    name: String!
    born: Int
    bookCount: Int!
    }
type User {
    username: String!
    favoriteGenre: String!
    id: ID!
    }
type Token {
    value: String!
    }
type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks: [Book!]!
    allAuthors: [Author!]!
    me: User
    }
type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ): Book
    addAuthor(
        name: String!
        born: Int
    ): Author
    editAuthor(
        name: String!
        setBornTo: Int!
    ): Author
    createUser(
        username: String!
        favoriteGenre: String!
      ): User
    login(
        username: String!
        password: String!
    ): Token
}
`;

const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      return Book.find({});
      //   const booksByAuthor = books.filter((b) => b.author === args.author);
      //   const booksByGenre = books.filter((b) => b.genres.includes(args.genre));

      //   if (args.author && args.genre) {
      //     return booksByAuthor.filter((b) => b.genres.includes(args.genre));
      //   }
      //   if (args.author || args.genre) {
      //     return args.author ? booksByAuthor : booksByGenre;
      //   }
      //   return books;
    },
    allAuthors: async () => {
      return Author.find({});
    },
    me: async (root, args, context) => {
      console.log("here", context);
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root._id });
      return books.length;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.username) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }
      const book = new Book({ ...args });
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Adding book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return book;
    },
    addAuthor: async (root, args) => {
      if (!context.username) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }
      const author = new Author({ ...args });
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Adding new author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return author;
    },
    editAuthor: async (root, args) => {
      if (!context.username) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }
      const author = await Author.findOne({ name: args.name });
      const jsonAuthor = author.toJSON();
      const updatedAuthor = await Author.findByIdAndUpdate(jsonAuthor.id, {
        born: args.setBornTo,
      });
      try {
        await updatedAuthor.save();
      } catch (error) {
        throw new GraphQLError("Updating author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return updatedAuthor;
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });
      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError("Creating user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      }
      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "GrassHopper") {
        throw new GraphQLError("Invalid credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: (args.username, args.password),
          },
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
