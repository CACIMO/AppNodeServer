const { DBRef } = require("bson");

db.producto.find({}).forEach(prod => {
    let name = prod.fileName.split('.')[0]
    db.producto.updateOne({_id:prod._id},{$set:{fileName:prod._id}})

    
});

