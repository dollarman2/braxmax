'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new Schema({
    user_type: { type: String, lowercase: true, default: 'user' },
    title: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, default: null },
    city: { type: String, default: null },
    country: { type: String, default: null },
    postal_code: { type: String, default: null },
    phone: { type: String, default: null },
    profile_image: { type: String, default: ''},
    address: { type: String, default: null },
    email: {
        type: String,
        lowercase: true,
        required: true,
        validate: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        index: { unique: true, dropDups: true }

    },
    password: { type: String, required: true },
    is_active: { type: Boolean, required: true, default: false },
    temporarytoken: { type: String, default: null },
    deleted_at: { type: Date, default: null }
}, { timestamps: true })

UserSchema.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password, 10)
}

UserSchema.methods.isValid = function (hashedPassword) {
    return bcrypt.compareSync(hashedPassword, this.password)
}

UserSchema.methods.supports = function(){
    return Service.hasMany('Support','user_id',this._id)
}

UserSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', UserSchema)