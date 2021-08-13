const { DBRef } = require("bson");

db.producto.find({}).forEach(prod => {
    let name = prod.fileName.split('.')[0]
    db.producto.updateOne({_id:prod._id},{$set:{fileName:prod._id}})

    
});

db.producto.updateOne({_id:ObjectId('60e8af7e7649685a09fcfa88'),'combinacion._id':ObjectId('60fbdf09449a76314ea805bd')},{$inc:{'combinacion.$.stock':1}})



db.producto.find({_id:ObjectId('60e8af7e7649685a09fcfa88'),'combinacion._id':ObjectId('60fbdf09449a76314ea805bd')}).pretty()