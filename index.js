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
type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
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
}
`;

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
  },
  Author: {
    bookCount: (root) => {
      const books = Book.find({});
      return books.filter((b) => b.author === root.name).length;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      console.log(args);
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
      console.log(args);
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
      console.log(args);
      const author = await Author.find({ name: args.name });
      console.log(author);
      const updatedAuthor = await Author.findByIdAndUpdate(
        author._id.toString(),
        { born: args.setBornTo }
      );
      console.log(updatedAuthor);
      return updatedAuthor;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
