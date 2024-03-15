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
    books: [Book]
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
    allBooks(genre: String): [Book!]!
    allGenres: [String!]!
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
type Subscription {
    bookAdded: Book!
  }    
`;

module.exports = typeDefs;
