const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    name: String
    address: String
    bio: String
    memberSince: String
    role: String
    cabins: [UserCabin]
    notifications: [Notification]
    createdAt: String
    updatedAt: String
  }

  type UserCabin {
    cabinId: ID
    role: String
    joinedAt: String
    cabin: Cabin
  }

  type Cabin {
    _id: ID
    name: String
    description: String
    location: String
    image: String
    createdBy: User
    members: [CabinMember]
    membershipRequests: [MembershipRequest]
    createdAt: String
    updatedAt: String
  }

  type CabinMember {
    userId: ID
    role: String
    joinedAt: String
    user: User
  }

  type MembershipRequest {
    userId: ID
    requestDate: String
    status: String
    user: User
  }

  type Notification {
    _id: ID
    type: String
    message: String
    relatedTo: ID
    createdAt: String
    read: Boolean
    cabin: Cabin
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    # User queries
    me: User
    users: [User]
    user(userId: ID!): User
    
    # Cabin queries
    cabins: [Cabin]
    cabin(cabinId: ID!): Cabin
    myCabins: [Cabin]
    
    # Notification queries
    myNotifications: [Notification]
  }

  type Mutation {
    # Auth mutations
    login(username: String!, password: String!): Auth
    register(
      username: String!
      email: String!
      password: String!
      name: String!
      address: String!
      bio: String
    ): Auth
    
    # User mutations
    updateUser(
      name: String
      email: String
      address: String
      bio: String
      password: String
    ): User
    
    # Cabin mutations
    createCabin(
      name: String!
      description: String!
      location: String!
      image: String
    ): Cabin
    updateCabin(
      cabinId: ID!
      name: String
      description: String
      location: String
      image: String
    ): Cabin
    deleteCabin(cabinId: ID!): Boolean
    
    # Membership mutations
    requestCabinMembership(cabinId: ID!): Boolean
    approveMembershipRequest(cabinId: ID!, userId: ID!): Boolean
    rejectMembershipRequest(cabinId: ID!, userId: ID!): Boolean
    removeCabinMember(cabinId: ID!, userId: ID!): Boolean
    changeMemberRole(cabinId: ID!, userId: ID!, role: String!): Boolean
    
    # Notification mutations
    markNotificationRead(notificationId: ID!): Boolean
    markAllNotificationsRead: Boolean
  }
`;

module.exports = typeDefs;
