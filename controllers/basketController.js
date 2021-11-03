const {BasketDevice} = require('../models/models')

class BasketController {
    
    async get(req, res) {
        const basket = await BasketDevice.findAndCountAll({ where: { basketId: req.params.id } })
        return res.json(basket)
    }

}

module.exports = new BasketController()
