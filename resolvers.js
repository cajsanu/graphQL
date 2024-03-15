const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const jwt = require("jsonwebtoken");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate("author");
      if (args.genre) {
        return books.filter((b) => b.genres.includes(args.genre));
      }
      return books;
    },
    allGenres: async () => {
      const books = await Book.find({});
      const uniqueArray = [
        ...new Set([].concat(...books.map((b) => b.genres), "All genres")),
      ];
      // The new Set makes an array where there is no duplicates. [].concat adds all the genres in an empty
      return uniqueArray;
    },
    allAuthors: async () => {
      console.log("author");
      const authors = await Author.find({}).populate("books", { title: 1,  });
      console.log(authors);
      return authors;
    },
    me: async (root, args, context) => {
      return context?.currentUser;
    },
  },
  // Author: {
  //   bookCount: async (root) => {
  //     console.log("count")
  //     const books = await Book.find({ author: root._id });
  //     return books.length;
  //   },
  // },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "NOT_AUTHENTICATED",
          },
        });
      }

      const author = await Author.findOne({ name: args.author });

      if (!author) {
        const newAuthor = new Author({ name: args.author });
        await newAuthor.save();
      }

      const authorFromDB =
        author ?? (await Author.findOne({ name: args.author }));
      const book = new Book({ ...args, author: authorFromDB._id });

      try {
        await book.save();
      } catch (error) {
        console.log(error);
        throw new GraphQLError("Adding book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      const updatedAuthor = await Author.findByIdAndUpdate(
        authorFromDB._id,
        { $push: { books: book._id } },
        { new: true }
      );
      const authorWithBook = await updatedAuthor.populate("books")
      const bookWithAuthor = await book.populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: bookWithAuthor });
      return bookWithAuthor;
    },
    addAuthor: async (root, args, context) => {
      if (!context.currentUser) {
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
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
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

module.exports = resolvers;
