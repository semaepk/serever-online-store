const { Type } = require('../models/models')

class TypeController {

    async create(req, res) {
        const { name } = req.body
        const type = await Type.create({ name })
        return res.json(type)
    }

    async getAll(req, res) {
        const types = await Type.findAll()
        return res.json(types)
    }

    async delete(req, res) {

        const type = Type.findOne({ where: { id: req.params.id } })
            .then((type) => {
                type.destroy()
            })
        return res.json({ message: 'Данные удалены'})
    }
}

module.exports = new TypeController()
