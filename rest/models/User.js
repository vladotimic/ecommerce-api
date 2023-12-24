const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Provide name'],
      minlength: 3,
      maxlenght: 100,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Provide email'],
      validate: {
        validator: validator.isEmail,
        message: 'Provide valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Provide password'],
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not valid',
      },
      default: 'user',
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDate: Date,
    passwordToken: String,
    passwordTokenExpirationDate: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = model('User', userSchema);
