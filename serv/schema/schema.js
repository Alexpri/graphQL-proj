const graphql = require('graphql')

const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLSchema} = graphql

const Movies = require(`../models/movie`)
const Directors = require(`../models/director`)

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: new GraphQLNonNull(GraphQLString)},
    genre: {type: new GraphQLNonNull(GraphQLString)},
    watched: {type: new GraphQLNonNull(GraphQLBoolean)},
    rate: {type: GraphQLInt},
    director: {
      type: DirectorType,
      resolve (parent) {
        return Directors.findById(parent.directorId)
      }
    }
  })
})

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: new GraphQLNonNull(GraphQLString)},
    age: {type: new GraphQLNonNull(GraphQLInt)},
    movies: {
      type: new GraphQLList(MovieType),
      resolve ({id}) {
        return Movies.find({directorId: id})
      }
    }
  })
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
      },
      resolve (parent, {name, age}) {
        const director = new Directors({
          name,
          age
        })

        return director.save()
      }
    },
    addMovie: {
      type: MovieType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        rate: {type: GraphQLInt},
        watched: {type: new GraphQLNonNull(GraphQLBoolean)},
        directorId: {type: GraphQLID},
      },
      resolve (parent, {name, genre, rate, watched, directorId}) {
        const movie = new Movies({
          name,
          genre,
          rate,
          watched,
          directorId
        })

        return movie.save()
      }
    },
    deleteDirector: {
      type: DirectorType,
      args: {id: {type: GraphQLID}},
      resolve (parent, {id}) {
        return Directors.findByIdAndRemove(id)
      }
    },
    deleteMovie: {
      type: MovieType,
      args: {id: {type: GraphQLID}},
      resolve (parent, {id}) {
        return Movies.findByIdAndRemove(id)
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
      },
      resolve (parent, {id, name, age}) {
        return new Directors.findByIdAndUpdate(
          id,
          {
            $set: {
              name,
              age
            }
          },
          {
            new: true
          }
        )
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        rate: {type: GraphQLInt},
        watched: {type: new GraphQLNonNull(GraphQLBoolean)},
        directorId: {type: GraphQLID},
      },
      resolve (parent, {id, name, genre, rate, watched, directorId}) {
        return new Movies.findByIdAndUpdate(
          id,
          {
            $set: {
              name,
              genre,
              rate,
              watched,
              directorId
            }
          },
          {
            new: true
          }
        )
      }
    }
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: {id: {type: GraphQLID}},
      resolve (parent, {id}) {
        return Movies.findById(id)
      }
    },
    director: {
      type: DirectorType,
      args: {id: {type: GraphQLID}},
      resolve (parent, {id}) {
        return Directors.findById(id)
      }
    },
    movies: {
      type: GraphQLList(MovieType),
      resolve () {
        return Movies.find({})
      }
    },
    directors: {
      type: GraphQLList(DirectorType),
      resolve () {
        return Directors.find({})
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})