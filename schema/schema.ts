import { GraphQLFloat } from "graphql";

const graphql = require('graphql');
const axios= require('axios')
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema,GraphQLList,GraphQLNonNull } = graphql;


const CompanyType:any = new GraphQLObjectType({
    name: "Company",
    fields:()=> ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            // GraphQLList -> when we are going to fetch user who is associated with the company , we gonna have multiple users associated with that company GrpahQLList provides list of users  
            type: new GraphQLList(UserType), resolve(parentValue: any, args: any)
            {
                return axios.get(`http://localhost:3000/companies/${ parentValue?.id }/users`)?.then((resp: { data: any; }) => resp?.data);
            }  
        }
    })
})
// const users = [{ id: '23', firstName: 'Deepak Bhatt', age: 30 }, {id:'24', firstName:'Puja Upadhyay', age:25}]
// we are going to use this GraphQLObjectType to instruct the graphQL presence of user in our application (data)
// remember the entire purpose of schema file is to instruct graphQL about the data type in our application
const UserType:any = new GraphQLObjectType({
    name: "User",
    fields:()=>( {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType, resolve(parentValue: any, args: any)
            {
                return axios.get(`http://localhost:3000/companies/${ parentValue?.companyId }`)?.then((resp: { data: any; }) => resp?.data);
            }
        }
    })
});
const query = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            // the purpose of resolve function is to actually go  reach out and  grab that real data
            resolve(parentValue:any, args:any) {
            //    return  _.find(users, {id:args?.id})
                const data = axios.get(`http://localhost:3000/users/${args?.id}`)?.then((resp: { data: any; }) => resp?.data);
                
                return data; 
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue: any, args: any){
                const data = axios.get(`http://localhost:3000/companies/${ args?.id }`)?.then((resp: { data: any; }) => resp?.data);
                return data;
            }
        }
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: { 
            type:UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyID:{type:GraphQLString}
            },
            resolve(parentValue:any, {firstName, age}:{firstName:string, age:number}){
                return axios.post('http://localhost:3000/users',{firstName, age})?.then((res:{data:any})=>res?.data)
            }
        },
        deleteUser: {
            type: UserType,
               args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentValue:any, {id}:{id:string}){
                return axios.delete(`http://localhost:3000/users/${id}`)?.then((res:{data:any})=>res?.data)
            }
        },
        editUser: {
            type: UserType,
            args: {
               id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString},
                age: { type: GraphQLInt},
                companyID:{type:GraphQLString}
            },
            resolve(arentValue:any, {id,firstName,age}:{id:string,firstName:string, age:number}){
                return axios.patch(`http://localhost:3000/users/${id}`, {firstName,age})?.then((res:{data:any})=>res?.data)
              
          }
        }
    }
})
module.exports=new GraphQLSchema({
    query,
    mutation
})