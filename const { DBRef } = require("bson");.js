const { DBRef } = require("bson");

db.producto.find({}).forEach(prod => {
    let name = prod.fileName.split('.')[0]
    db.producto.updateOne({_id:prod._id},{$set:{fileName:prod._id}})

    
});

db.producto.updateOne({_id:ObjectId('60e8af7e7649685a09fcfa88'),'combinacion._id':ObjectId('60fbdf09449a76314ea805bd')},{$inc:{'combinacion.$.stock':1}})



db.producto.find({_id:ObjectId('60e8af7e7649685a09fcfa88'),'combinacion._id':ObjectId('60fbdf09449a76314ea805bd')}).pretty()


db.formato.updateOne(

    {
        _id: ObjectId('612450e3480a5732d2fe3f24'),
        formato:'FT00027',
        Productos: {
            $elemMatch: {
                _id:ObjectId('6124501b480a5732d2fe3f21'),
                talla: ObjectId("60e75e337649685a09fcfa24"),
                color: ObjectId("60e879e77649685a09fcfa52")
            }
        }
    },
    {
        $inc: { "Productos.$.restante": -1 },
        $set: { etapa: ObjectId("604b88049ed8c060cc0e11dc") }
    })


   /*  {
        
        'Productos.color':ObjectId("6079640f951407348cd2a05c"),
        'Productos.talla':ObjectId("60e75e097649685a09fcfa1f"),
        'Productos.id':ObjectId("60e8afea7649685a09fcfa8a")
    } */

