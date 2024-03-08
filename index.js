const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");

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

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

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
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => {
      const booksByAuthor = books.filter((b) => b.author === args.author);
      const booksByGenre = books.filter((b) => b.genres.includes(args.genre));

      if (args.author && args.genre) {
        return booksByAuthor.filter((b) => b.genres.includes(args.genre));
      }
      if (args.author || args.genre) {
        return args.author ? booksByAuthor : booksByGenre;
      }
      return books;
    },
    allAuthors: async () => {
      return Author.find({});
    },
  },
  Author: {
    bookCount: (root) => {
      return books.filter((b) => b.author === root.name).length;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      console.log(args);
      const book = new Book({ ...args });
      return book.save();
    },
    addAuthor: async (root, args) => {
      console.log(args);
      const author = new Author({ ...args });
      return author.save();
    },
    editAuthor: async (root, args) => {
      console.log(args);
      const author = await Author.find({ name: args.name });
      console.log(author);
      const updatedAuthor = await Author.findByIdAndUpdate(
        author.id,
        { born: args.setBornTo }
      );
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
