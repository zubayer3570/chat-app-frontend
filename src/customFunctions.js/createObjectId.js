const { ObjectId } = require("bson")

const getNewObjectId = () => {
    const id = new ObjectId()
    return id
}

module.exports = {
    getNewObjectId
}