const {BasketDevice} = require('../models/models')

class basketDeviceController {
    
    async create(req, res) {
        const {basketId, deviceId} = req.body
        const basketDevice = await BasketDevice.create({basketId, deviceId})
        return res.json(basketDevice)
    }

    async getAll(req, res) {
        const basketDevices = await BasketDevice.findAll()
        return res.json(basketDevices)
    }

    async delete(req, res) {

        await BasketDevice.findOne({ where: { id: req.params.id } })
            .then((basketDevice) => {
                basketDevice.destroy()
            })
        return res.json({ message: 'Данные удалены'})
    }

}

module.exports = new basketDeviceController()
