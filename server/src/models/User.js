const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match an email address!'],
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    memberSince: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['USER', 'GLOBAL_ADMIN'],
      default: 'USER',
    },
    cabins: [
      {
        cabinId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Cabin',
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
    notifications: [
      {
        type: {
          type: String,
          enum: ['INVITE', 'APPROVAL', 'SYSTEM'],
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        relatedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Cabin',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Set up pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Method to compare password for login
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Method to check if user is admin of a specific cabin
userSchema.methods.isAdminOfCabin = function (cabinId) {
  return this.cabins.some(
    (cabin) => cabin.cabinId.toString() === cabinId.toString() && cabin.role === 'ADMIN'
  );
};

// Method to check if user is member of a specific cabin
userSchema.methods.isMemberOfCabin = function (cabinId) {
  return this.cabins.some(
    (cabin) => cabin.cabinId.toString() === cabinId.toString()
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
