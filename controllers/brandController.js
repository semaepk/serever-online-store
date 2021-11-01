const {Brand} = require('../models/models')

class BrandController {
    async create(req, res) {
        const {name} = req.body
        const brand = await Brand.create({name})
        return res.json(brand)
    }

    async getAll(req, res) {
        const brands = await Brand.findAll()
        return res.json(brands)
    }

    async delete(req, res) {

        Brand.findOne({ where: { id: req.params.id } })
            .then((brand) => {
                brand.destroy()
            })
        return res.json({ message: 'Данные удалены'})
    }

}

module.exports = new BrandController()
