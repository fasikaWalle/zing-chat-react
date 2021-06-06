const mongoose = require("mongoose");

const { Schema } = mongoose;
const {chatSchema} = require('./Chat')
const bcrypt = require("bcrypt");
const dateFormat = require("../utils/dateFormat");

const DM = new Schema({
	sender: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	receiver: {
		type: String,
		required: true
	}
})

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		match: [/^\S*$/, "No spaces allowed in a username!"],
		unique: true,
		trim: true,
		lowercase: true,
		minlength: 4
	},
	displayName: {
		type: String,
		default: "WorkInProgress",
		trim: true,
		minlength: 3
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 5,
	},
	avatar: {
		type: String,
		required: true,
	},
	rooms: [
		{
			type: Schema.Types.ObjectId,
			ref: "Room",
		},
	],
	privateMessages: [DM],
	notifications: [String],
	friends: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	friendRequests: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
		get: (timestamp) => dateFormat(timestamp),
	},
});

userSchema.pre("save", async function (next) {
	if (this.isNew || this.isModified("password")) {
		const saltRounds = 10;
		this.password = await bcrypt.hash(this.password, saltRounds);
	}

	next();
});

userSchema.methods.isCorrectPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
