const uuid = require('uuid')
const path = require('path');
const {Device, DeviceInfo, Rating} = require('../models/models')
const ApiError = require('../error/ApiError');

class DeviceController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({name, price, brandId, typeId, img: fileName});

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices

        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where:{brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId}, limit, offset})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId, brandId}, limit, offset})
        }
        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            }
        )

        return res.json(device)
    }

    async update(req, res){
        
        // const device = await Device.update({$set: req.body}, {where:{ id: req.params.id}})

        return res.json(device)  
    }

    async updateRating(req, res){

        const {userId , rating} = req.body
        const deviceId = req.params.id

        if (rating !== 0) {

            await Rating
                .findOne({ where: { userId , deviceId } })
                .then((obj) => {
                    if(obj)
                        return obj.update({rate: rating}).save()
                    return Rating.create({ userId , deviceId, rate: rating})
            })
        }
            
        return res.json({message: 'Рейтинг установлен'})  
    }

    async delete(req, res) {

        const id = req.params.id

        await Device.findOne({ where: { id  } })                                
            .then((device) => device.destroy())

        await DeviceInfo.findOne({where: {deviceId: id}})
            .then((deviceInfo) => deviceInfo.destroy())    

        return res.json({ message: 'Данные удалены'})
    }

}

module.exports = new DeviceController()
