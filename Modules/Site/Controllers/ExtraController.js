'use strict'

const Support = require('Modules/Support/Models/Support')
const EmailAlert = require('Modules/Site/Models/Email')
const User = require('Modules/User/Models/User')
const Activity = require('functions/activity')
const result = {}

class ExtraController {

    static countUserDoc(req, res, next) {
        Support.find({ user_id: req.params.user_id }).countDocuments().then(count => {
            result.support_count = count
        }).catch(error => {
            return res.status(422).json(error)
        })
    }

    static countAllDoc(req, res, next) {
        Support.find({}).countDocuments().then(count => {
            result.support_count = count
        }).catch(error => {
            return res.status(422).json(error)

        })
    }

    static deactivateAlertEmail(req, res, next) {
        EmailAlert.findOne({ email: req.params.email }).then(function (email) {
            email.status = 0
            email.save()
            return res.status(201).json({ msg: 'you have unsubscribed from latest deals alert.' })
        }, function (error) {
            return res.status(501).json({ "success": false, "message": error })
        })
    }

    static emailAlert(req,res,next){
        EmailAlert.findOne({ email: req.body.email }).then(function (email) {
            if(email != null && email.email === req.body.email)
                return res.status(201).json({ msg: 'you are a subscribed member, thanks you!' })
            else
                Activity.alertEmail(req)
                Activity.Email(req.body, 'Brax Alert', Activity.html('<p style="color: #000">Hello ' + req.body.email + '<br>, Thank you for creating a price alert at Brax Map.we will update you with our latest and cheapest deals.<br><br><br><br><br>click <a href="https://braxmap.com/unsubscribe/"' + req.body.email + '>here</a> to unsubscribe</p>'))
                return res.status(201).json({ msg: 'Email Alert Successfully Activated.' })
        }, function (error) {
            return res.status(501).json({ "success": false, "message": error })
        })
        
    }
}
module.exports = ExtraController