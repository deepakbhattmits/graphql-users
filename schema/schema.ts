const graphql = require('graphql');
// const _ = require('lodash');
const axios= require('axios')
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

// const users = [{ id: '23', firstName: 'Deepak Bhatt', age: 30 }, {id:'24', firstName:'Puja Upadhyay', age:25}]
// we are going to use this GraphQLObjectType to instruct the graphQL presence of user in our application (data)
// remember the entire purpose of schema file is to instruct graphQL about the data type in our application
const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
    }
});
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            // the purpose of resolve function is to actually go  reach out and  grab that real data
            resolve(parentValue:any, args:any) {
            //    return  _.find(users, {id:args?.id})
                const data = axios.get(`http://localhost:3000/users/${args?.id}`).then((resp: { data: any; }) => resp?.data);
                // const filteredUser = users?.find(({ id }) => id===args?.id)
                // return filteredUser
                return data; 
            }
        }
    }
})
module.exports=new GraphQLSchema({
    query:RootQuery
})