import { gql } from '@apollo/client';

// Current user query
export const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      name
      address
      bio
      memberSince
      role
      cabins {
        cabinId
        role
        joinedAt
        cabin {
          _id
          name
          image
        }
      }
    }
  }
`;

// Get all cabins
export const GET_CABINS = gql`
  query GetCabins {
    cabins {
      _id
      name
      description
      location
      image
      createdAt
      members {
        userId
        role
      }
    }
  }
`;

// Get a single cabin by ID
export const GET_CABIN = gql`
  query GetCabin($cabinId: ID!) {
    cabin(cabinId: $cabinId) {
      _id
      name
      description
      location
      image
      createdAt
      createdBy {
        _id
        username
        name
      }
      members {
        userId
        role
        joinedAt
        user {
          _id
          username
          name
          bio
        }
      }
      membershipRequests {
        userId
        requestDate
        status
        user {
          _id
          username
          name
        }
      }
    }
  }
`;

// Get cabins the current user is a member of
export const GET_MY_CABINS = gql`
  query GetMyCabins {
    myCabins {
      _id
      name
      description
      location
      image
      createdAt
      members {
        userId
        role
      }
    }
  }
`;

// Get user notifications
export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications {
    myNotifications {
      _id
      type
      message
      relatedTo
      createdAt
      read
      cabin {
        _id
        name
      }
    }
  }
`;

// Get a user by ID
export const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      name
      bio
      memberSince
      cabins {
        cabinId
        role
        cabin {
          _id
          name
        }
      }
    }
  }
`;

// Get all users (admin only)
export const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      username
      email
      name
      role
    }
  }
`;
