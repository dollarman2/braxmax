'use strict'

const Activity = require('functions/activity')
const Maps = require('Modules/Map/Models/Map')
const File = require('functions/file')

class MapController { 

    static create(req, res, next) {
        try {
            if (!req.body.continent_id) {
                return res.status(422).json({ 'error': 'Please provide continent for your map' })
            }
            if (!req.body.country_id) {
                return res.status(422).json({ 'error': 'Please provide country' })
            }
            if (!req.body.name) {
                return res.status(422).json({ 'error': 'Please provide name' })
            }

            const map = new Maps()
            map.user_id = req.body.user_id
            map.continent_id = req.body.continent_id
            map.country_id = req.body.country_id
            map.name = req.body.name
            map.description = req.body.description
            map.image = (req.body.image) ? File.Image(req.body.image,"/images/profile/", req.body.name,'.png') : ''
            map.html_file = (req.body.html_file) ? File.generalFile(req.body.html_file,"/files/html/", req.body.name,'.html') : ''
            map.js_file = (req.body.js_file) ? File.generalFile(req.body.js_file, "/files/js/",req.body.name,'.js') : ''
            map.zip_file = (req.body.zip_file) ? File.zipFile(req.body.zip_file,"/files/zip/", req.body.name,'') : ''
            map.save(function (error) {
                if (error) {
                    return res.status(401).json({ error: error, msg: error.message })
                } else { 
                    Activity.activity_log(req, req.body.user_id,' Added map')
                    return res.status(201).json({ msg: 'Map Successfully created.' })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static update(req, res, next) {
        try {
            Maps.findById(req.params.id).populate('user_id').then((map) => {                
                    map.user_id = req.body.user_id
                    map.continent_id = (req.body.continent_id) ? req.body.continent_id : map.continent_id
                    map.country_id = (req.body.country_id) ? req.body.country_id : map.country_id
                    map.name = (req.body.name) ? req.body.name : map.name
                    map.description = req.body.description
                    map.image = (req.body.image) ? File.Image(req.body.image,"/images/profile/", req.body.name,'.png') : map.image
                    map.html_file = (req.body.html_file) ? File.generalFile(req.body.html_file,"/files/html/", req.body.name,'.html') : map.html_file
                    map.js_file = (req.body.js_file) ? File.generalFile(req.body.js_file, "/files/js/",req.body.name,'.js') : map.js_file
                    map.zip_file = (req.body.zip_file) ? File.zipFile(req.body.zip_file,"/files/zip/", req.body.name,'') : map.zip_file
                    map.save(function (error) {
                        if (error) {
                            Activity.activity_log(req, req.user, 'Error Updating Map!')
                            return res.status(501).json({ error: error, msg: error.message })
                        } else {
                            Activity.activity_log(req, req.user, 'Map Updated Successfully')
                            return res.status(201).json({
                                'map': map,
                                'msg':' Map Updated Successfully!'
                            })
                        }
                    })
                }).catch((err) =>{
                    return res.status(401).json({ error: err, msg: err.message })
                })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static getAll(req, res, next) {
        try {
            Maps.find({}, null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((maps) => {
                return res.status(201).json({ maps: maps })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getAllByContinent(req, res, next) {
        try {
            Maps.find({ continent_id : req.params.continent_id}, null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((maps) => {
                return res.status(201).json({ maps: maps })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getAllByCountry(req, res, next) {
        try {
            Maps.find({ country_id: req.params.country_id }, null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((maps) => {
                return res.status(201).json({ maps: maps })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getOne(req, res, next) {
        try {
            Maps.findById(req.params.id , null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((map) => {
                return res.status(201).json({ map: map })
            }).catch((error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static delete(req, res, next) {
        try {
            Maps.findByIdAndDelete( req.params.id, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    return res.json({ user: user, msg: user.first_name + " was deleted successfully" })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }
}

module.exports = MapController