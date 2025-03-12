const mongoose = require('mongoose');

const cabinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '/images/default-cabin.jpg',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['ADMIN', 'MEMBER'],
          default: 'MEMBER',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    membershipRequests: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        requestDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['PENDING', 'APPROVED', 'REJECTED'],
          default: 'PENDING',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to check if a user is an admin of this cabin
cabinSchema.methods.isAdmin = function (userId) {
  return this.members.some(
    (member) => member.userId.toString() === userId.toString() && member.role === 'ADMIN'
  );
};

// Method to check if a user is a member of this cabin
cabinSchema.methods.isMember = function (userId) {
  return this.members.some(
    (member) => member.userId.toString() === userId.toString()
  );
};

// Method to check if a user has a pending membership request
cabinSchema.methods.hasPendingRequest = function (userId) {
  return this.membershipRequests.some(
    (request) => 
      request.userId.toString() === userId.toString() && 
      request.status === 'PENDING'
  );
};

const Cabin = mongoose.model('Cabin', cabinSchema);

module.exports = Cabin;
