const { AuthenticationError, UserInputError } = require('apollo-server-express');
const { User, Cabin } = require('../models');
const { signToken } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const resolvers = {
  Query: {
    // Get the currently authenticated user
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const user = await User.findById(context.user._id);
        return user;
      } catch (err) {
        logger.error(`Error fetching current user: ${err.message}`);
        throw new Error('Failed to fetch user data');
      }
    },
    
    // Get all users (admin only)
    users: async (parent, args, context) => {
      if (!context.user || context.user.role !== 'GLOBAL_ADMIN') {
        throw new AuthenticationError('Not authorized');
      }
      
      try {
        return await User.find({});
      } catch (err) {
        logger.error(`Error fetching users: ${err.message}`);
        throw new Error('Failed to fetch users');
      }
    },
    
    // Get a single user by ID
    user: async (parent, { userId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        return await User.findById(userId);
      } catch (err) {
        logger.error(`Error fetching user ${userId}: ${err.message}`);
        throw new Error('Failed to fetch user');
      }
    },
    
    // Get all cabins
    cabins: async () => {
      try {
        return await Cabin.find({});
      } catch (err) {
        logger.error(`Error fetching cabins: ${err.message}`);
        throw new Error('Failed to fetch cabins');
      }
    },
    
    // Get a single cabin by ID
    cabin: async (parent, { cabinId }) => {
      try {
        return await Cabin.findById(cabinId);
      } catch (err) {
        logger.error(`Error fetching cabin ${cabinId}: ${err.message}`);
        throw new Error('Failed to fetch cabin');
      }
    },
    
    // Get cabins the current user is a member of
    myCabins: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const user = await User.findById(context.user._id);
        const cabinIds = user.cabins.map(cabin => cabin.cabinId);
        return await Cabin.find({ _id: { $in: cabinIds } });
      } catch (err) {
        logger.error(`Error fetching user's cabins: ${err.message}`);
        throw new Error('Failed to fetch cabins');
      }
    },
    
    // Get notifications for the current user
    myNotifications: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const user = await User.findById(context.user._id);
        return user.notifications.sort((a, b) => b.createdAt - a.createdAt);
      } catch (err) {
        logger.error(`Error fetching notifications: ${err.message}`);
        throw new Error('Failed to fetch notifications');
      }
    },
  },
  
  Mutation: {
    // Login a user
    login: async (parent, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
        
        const correctPw = await user.isCorrectPassword(password);
        
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
        
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        logger.error(`Login error: ${err.message}`);
        throw err;
      }
    },
    
    // Register a new user
    register: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        logger.error(`Registration error: ${err.message}`);
        
        if (err.code === 11000) {
          throw new UserInputError('Username or email already exists');
        }
        
        throw new Error('Failed to create account');
      }
    },
    
    // Update user profile
    updateUser: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $set: args },
          { new: true, runValidators: true }
        );
        
        return updatedUser;
      } catch (err) {
        logger.error(`Update user error: ${err.message}`);
        throw new Error('Failed to update profile');
      }
    },
    
    // Create a new cabin
    createCabin: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const cabin = await Cabin.create({
          ...args,
          createdBy: context.user._id,
          members: [{ userId: context.user._id, role: 'ADMIN' }],
        });
        
        // Add cabin to user's cabins
        await User.findByIdAndUpdate(
          context.user._id,
          {
            $push: {
              cabins: { cabinId: cabin._id, role: 'ADMIN' },
            },
          }
        );
        
        return cabin;
      } catch (err) {
        logger.error(`Create cabin error: ${err.message}`);
        throw new Error('Failed to create cabin');
      }
    },
    
    // Update a cabin
    updateCabin: async (parent, { cabinId, ...updates }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const cabin = await Cabin.findById(cabinId);
        
        if (!cabin) {
          throw new Error('Cabin not found');
        }
        
        // Check if user is admin of this cabin
        if (!cabin.isAdmin(context.user._id) && context.user.role !== 'GLOBAL_ADMIN') {
          throw new AuthenticationError('Not authorized');
        }
        
        const updatedCabin = await Cabin.findByIdAndUpdate(
          cabinId,
          { $set: updates },
          { new: true, runValidators: true }
        );
        
        return updatedCabin;
      } catch (err) {
        logger.error(`Update cabin error: ${err.message}`);
        throw err;
      }
    },
    
    // Delete a cabin
    deleteCabin: async (parent, { cabinId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const cabin = await Cabin.findById(cabinId);
        
        if (!cabin) {
          throw new Error('Cabin not found');
        }
        
        // Check if user is admin of this cabin
        if (!cabin.isAdmin(context.user._id) && context.user.role !== 'GLOBAL_ADMIN') {
          throw new AuthenticationError('Not authorized');
        }
        
        // Remove cabin from all users' cabins array
        await User.updateMany(
          { 'cabins.cabinId': cabinId },
          { $pull: { cabins: { cabinId } } }
        );
        
        // Delete cabin
        await Cabin.findByIdAndDelete(cabinId);
        
        return true;
      } catch (err) {
        logger.error(`Delete cabin error: ${err.message}`);
        throw err;
      }
    },
    
    // Request to join a cabin
    requestCabinMembership: async (parent, { cabinId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const cabin = await Cabin.findById(cabinId);
        
        if (!cabin) {
          throw new Error('Cabin not found');
        }
        
        // Check if user is already a member
        if (cabin.isMember(context.user._id)) {
          throw new UserInputError('You are already a member of this cabin');
        }
        
        // Check if user already has a pending request
        if (cabin.hasPendingRequest(context.user._id)) {
          throw new UserInputError('You already have a pending request for this cabin');
        }
        
        // Add membership request
        await Cabin.findByIdAndUpdate(
          cabinId,
          {
            $push: {
              membershipRequests: {
                userId: context.user._id,
                status: 'PENDING',
              },
            },
          }
        );
        
        // Notify cabin admins
        const adminMembers = cabin.members.filter(member => member.role === 'ADMIN');
        
        for (const admin of adminMembers) {
          await User.findByIdAndUpdate(
            admin.userId,
            {
              $push: {
                notifications: {
                  type: 'INVITE',
                  message: `${context.user.username} has requested to join ${cabin.name}`,
                  relatedTo: cabinId,
                },
              },
            }
          );
        }
        
        return true;
      } catch (err) {
        logger.error(`Request cabin membership error: ${err.message}`);
        throw err;
      }
    },
    
    // Approve a membership request
    approveMembershipRequest: async (parent, { cabinId, userId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const cabin = await Cabin.findById(cabinId);
        
        if (!cabin) {
          throw new Error('Cabin not found');
        }
        
        // Check if user is admin of this cabin
        if (!cabin.isAdmin(context.user._id) && context.user.role !== 'GLOBAL_ADMIN') {
          throw new AuthenticationError('Not authorized');
        }
        
        // Find the request
        const request = cabin.membershipRequests.find(
          req => req.userId.toString() === userId && req.status === 'PENDING'
        );
        
        if (!request) {
          throw new Error('Membership request not found');
        }
        
        // Update request status
        await Cabin.findByIdAndUpdate(
          cabinId,
          {
            $set: { 'membershipRequests.$[elem].status': 'APPROVED' },
            $push: { members: { userId, role: 'MEMBER' } },
          },
          { arrayFilters: [{ 'elem.userId': userId, 'elem.status': 'PENDING' }] }
        );
        
        // Add cabin to user's cabins
        await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              cabins: { cabinId, role: 'MEMBER' },
              notifications: {
                type: 'APPROVAL',
                message: `Your request to join ${cabin.name} has been approved`,
                relatedTo: cabinId,
              },
            },
          }
        );
        
        return true;
      } catch (err) {
        logger.error(`Approve membership error: ${err.message}`);
        throw err;
      }
    },
    
    // Reject a membership request
    rejectMembershipRequest: async (parent, { cabinId, userId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const cabin = await Cabin.findById(cabinId);
        
        if (!cabin) {
          throw new Error('Cabin not found');
        }
        
        // Check if user is admin of this cabin
        if (!cabin.isAdmin(context.user._id) && context.user.role !== 'GLOBAL_ADMIN') {
          throw new AuthenticationError('Not authorized');
        }
        
        // Find the request
        const request = cabin.membershipRequests.find(
          req => req.userId.toString() === userId && req.status === 'PENDING'
        );
        
        if (!request) {
          throw new Error('Membership request not found');
        }
        
        // Update request status
        await Cabin.findByIdAndUpdate(
          cabinId,
          {
            $set: { 'membershipRequests.$[elem].status': 'REJECTED' },
          },
          { arrayFilters: [{ 'elem.userId': userId, 'elem.status': 'PENDING' }] }
        );
        
        // Notify user
        await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              notifications: {
                type: 'APPROVAL',
                message: `Your request to join ${cabin.name} has been rejected`,
                relatedTo: cabinId,
              },
            },
          }
        );
        
        return true;
      } catch (err) {
        logger.error(`Reject membership error: ${err.message}`);
        throw err;
      }
    },
    
    // Remove a member from a cabin
    removeCabinMember: async (parent, { cabinId, userId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const cabin = await Cabin.findById(cabinId);
        
        if (!cabin) {
          throw new Error('Cabin not found');
        }
        
        // Check if user is admin of this cabin
        if (!cabin.isAdmin(context.user._id) && context.user.role !== 'GLOBAL_ADMIN') {
          throw new AuthenticationError('Not authorized');
        }
        
        // Remove member from cabin
        await Cabin.findByIdAndUpdate(
          cabinId,
          { $pull: { members: { userId } } }
        );
        
        // Remove cabin from user's cabins
        await User.findByIdAndUpdate(
          userId,
          {
            $pull: { cabins: { cabinId } },
            $push: {
              notifications: {
                type: 'SYSTEM',
                message: `You have been removed from ${cabin.name}`,
                relatedTo: cabinId,
              },
            },
          }
        );
        
        return true;
      } catch (err) {
        logger.error(`Remove cabin member error: ${err.message}`);
        throw err;
      }
    },
    
    // Change a member's role in a cabin
    changeMemberRole: async (parent, { cabinId, userId, role }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        const cabin = await Cabin.findById(cabinId);
        
        if (!cabin) {
          throw new Error('Cabin not found');
        }
        
        // Check if user is admin of this cabin
        if (!cabin.isAdmin(context.user._id) && context.user.role !== 'GLOBAL_ADMIN') {
          throw new AuthenticationError('Not authorized');
        }
        
        // Validate role
        if (role !== 'ADMIN' && role !== 'MEMBER') {
          throw new UserInputError('Invalid role');
        }
        
        // Update member role in cabin
        await Cabin.findByIdAndUpdate(
          cabinId,
          { $set: { 'members.$[elem].role': role } },
          { arrayFilters: [{ 'elem.userId': userId }] }
        );
        
        // Update role in user's cabins
        await User.findByIdAndUpdate(
          userId,
          {
            $set: { 'cabins.$[elem].role': role },
            $push: {
              notifications: {
                type: 'SYSTEM',
                message: `Your role in ${cabin.name} has been changed to ${role}`,
                relatedTo: cabinId,
              },
            },
          },
          { arrayFilters: [{ 'elem.cabinId': cabinId }] }
        );
        
        return true;
      } catch (err) {
        logger.error(`Change member role error: ${err.message}`);
        throw err;
      }
    },
    
    // Mark a notification as read
    markNotificationRead: async (parent, { notificationId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        await User.findByIdAndUpdate(
          context.user._id,
          { $set: { 'notifications.$[elem].read': true } },
          { arrayFilters: [{ 'elem._id': notificationId }] }
        );
        
        return true;
      } catch (err) {
        logger.error(`Mark notification read error: ${err.message}`);
        throw err;
      }
    },
    
    // Mark all notifications as read
    markAllNotificationsRead: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }
      
      try {
        await User.findByIdAndUpdate(
          context.user._id,
          { $set: { 'notifications.$[].read': true } }
        );
        
        return true;
      } catch (err) {
        logger.error(`Mark all notifications read error: ${err.message}`);
        throw err;
      }
    },
  },
  
  // Field resolvers
  User: {
    cabins: async (parent) => {
      // For each cabin reference in user.cabins, fetch the actual cabin data
      const cabinPromises = parent.cabins.map(async (cabinRef) => {
        const cabin = await Cabin.findById(cabinRef.cabinId);
        return {
          ...cabinRef.toObject(),
          cabin,
        };
      });
      
      return Promise.all(cabinPromises);
    },
  },
  
  UserCabin: {
    cabin: async (parent) => {
      return await Cabin.findById(parent.cabinId);
    },
  },
  
  Cabin: {
    createdBy: async (parent) => {
      return await User.findById(parent.createdBy);
    },
    
    members: async (parent) => {
      // For each member in cabin.members, fetch the actual user data
      const memberPromises = parent.members.map(async (memberRef) => {
        const user = await User.findById(memberRef.userId);
        return {
          ...memberRef.toObject(),
          user,
        };
      });
      
      return Promise.all(memberPromises);
    },
    
    membershipRequests: async (parent) => {
      // For each request in cabin.membershipRequests, fetch the actual user data
      const requestPromises = parent.membershipRequests.map(async (requestRef) => {
        const user = await User.findById(requestRef.userId);
        return {
          ...requestRef.toObject(),
          user,
        };
      });
      
      return Promise.all(requestPromises);
    },
  },
  
  CabinMember: {
    user: async (parent) => {
      return await User.findById(parent.userId);
    },
  },
  
  MembershipRequest: {
    user: async (parent) => {
      return await User.findById(parent.userId);
    },
  },
  
  Notification: {
    cabin: async (parent) => {
      if (parent.relatedTo) {
        return await Cabin.findById(parent.relatedTo);
      }
      return null;
    },
  },
};

module.exports = resolvers;
