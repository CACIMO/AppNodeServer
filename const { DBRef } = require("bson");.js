const { DBRef } = require("bson");

db.producto.find({}).forEach(prod => {
    let name = prod.fileName.split('.')[0]
    db.producto.updateOne({_id:prod._id},{$set:{fileName:prod._id}})

    
});

db.producto.updateOne({_id:ObjectId('60e8af7e7649685a09fcfa88'),'combinacion._id':ObjectId('60fbdf09449a76314ea805bd')},{$inc:{'combinacion.$.stock':1}})



db.producto.find({_id:ObjectId('60e8af7e7649685a09fcfa88'),'combinacion._id':ObjectId('60fbdf09449a76314ea805bd')}).pretty()


db.formato.update(
    {_id: ObjectId('61362b1224ac372a0730d722'),formato:'FT00034'},
    {
        $pull:{
            Productos:{_id:ObjectId('61362aa124ac372a0730d71f')}
        }
    })


   /*  {
        
        'Productos.color':ObjectId("6079640f951407348cd2a05c"),
        'Productos.talla':ObjectId("60e75e097649685a09fcfa1f"),
        'Productos.id':ObjectId("60e8afea7649685a09fcfa8a")
    } */

