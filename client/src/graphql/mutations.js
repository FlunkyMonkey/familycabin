import { gql } from '@apollo/client';

// Authentication mutations
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
        email
        name
        role
        cabins {
          cabinId
          role
        }
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $name: String!
    $address: String!
    $bio: String
  ) {
    register(
      username: $username
      email: $email
      password: $password
      name: $name
      address: $address
      bio: $bio
    ) {
      token
      user {
        _id
        username
        email
        name
        role
      }
    }
  }
`;

// User mutations
export const UPDATE_USER = gql`
  mutation UpdateUser(
    $name: String
    $email: String
    $address: String
    $bio: String
    $password: String
  ) {
    updateUser(
      name: $name
      email: $email
      address: $address
      bio: $bio
      password: $password
    ) {
      _id
      username
      email
      name
      address
      bio
    }
  }
`;

// Cabin mutations
export const CREATE_CABIN = gql`
  mutation CreateCabin(
    $name: String!
    $description: String!
    $location: String!
    $image: String
  ) {
    createCabin(
      name: $name
      description: $description
      location: $location
      image: $image
    ) {
      _id
      name
      description
      location
      image
      createdAt
    }
  }
`;

export const UPDATE_CABIN = gql`
  mutation UpdateCabin(
    $cabinId: ID!
    $name: String
    $description: String
    $location: String
    $image: String
  ) {
    updateCabin(
      cabinId: $cabinId
      name: $name
      description: $description
      location: $location
      image: $image
    ) {
      _id
      name
      description
      location
      image
    }
  }
`;

export const DELETE_CABIN = gql`
  mutation DeleteCabin($cabinId: ID!) {
    deleteCabin(cabinId: $cabinId)
  }
`;

// Membership mutations
export const REQUEST_CABIN_MEMBERSHIP = gql`
  mutation RequestCabinMembership($cabinId: ID!) {
    requestCabinMembership(cabinId: $cabinId)
  }
`;

export const APPROVE_MEMBERSHIP_REQUEST = gql`
  mutation ApproveMembershipRequest($cabinId: ID!, $userId: ID!) {
    approveMembershipRequest(cabinId: $cabinId, userId: $userId)
  }
`;

export const REJECT_MEMBERSHIP_REQUEST = gql`
  mutation RejectMembershipRequest($cabinId: ID!, $userId: ID!) {
    rejectMembershipRequest(cabinId: $cabinId, userId: $userId)
  }
`;

export const REMOVE_CABIN_MEMBER = gql`
  mutation RemoveCabinMember($cabinId: ID!, $userId: ID!) {
    removeCabinMember(cabinId: $cabinId, userId: $userId)
  }
`;

export const CHANGE_MEMBER_ROLE = gql`
  mutation ChangeMemberRole($cabinId: ID!, $userId: ID!, $role: String!) {
    changeMemberRole(cabinId: $cabinId, userId: $userId, role: $role)
  }
`;

// Notification mutations
export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($notificationId: ID!) {
    markNotificationRead(notificationId: $notificationId)
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;
