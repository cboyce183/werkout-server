const { ApolloServer, gql } = require('apollo-server');
const exercises = require('./utils/exercises.js');

const mongoose = require('mongoose');
const UserSet = require('./mongoose/sets.js');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type Set {
    id: String
    date(date: String): String
    exId: Int
    exercise: Exercise
    reps: Int
    weight: Int
  }

  type Exercise {
    id: Int
    name: String
    type: String
    targets: String
  }

  type Query {
    sets: [Set]
    exercise(id: Int!): Exercise
    exercises: [Exercise]
  }

  type Mutation {
    addSet(date: String!, exId: Int!, reps: Int!, weight: Int!): Set
    deleteSet(id: Int!): Set
  }
`;

// Resolvers define the technique for fetching the types in the schema.
const resolvers = {
  Query: {
    sets: async () => {
      const res = await UserSet.find({}, (err, data) => {
        if (err) console.error(err);
        return data;
      });

      return res.map(set => {
        set.exercise = exercises.find(e => e.id === set.exId);
        delete set.exId;
        return set;
      });
    },
    exercises: () => exercises,
    exercise: (parent, args) => exercises.find(el => el.id === args.id)
  },


  Mutation: {
    addSet: async (parent, args) => {
      let {date, exId, reps, weight} = args;
      const set = new UserSet({
        date,
        exId,
        reps,
        weight
      });

      await set.save((err) => {
        if (err) console.error(err);
      });
      return {date, reps, weight, exercise: exercises.find(el => el.id === args.exId)};
    },
    deleteSet: (parent, args) => {
      //toDo
    },
    
  }
};

mongoose.connect('mongodb://localhost:27017/local');
const db = mongoose.connection;
db.on('error', ()=> {console.log('---FAILED to connect to mongoose')});
db.once('open', () => {
  console.log( '+++Connected to mongoose');
});

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
