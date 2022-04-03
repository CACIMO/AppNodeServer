const { ObjectId, ObjectID } = require('bson');

let mongoose = require('mongoose');

mongoose.pluralize(null);
let connection = mongoose.connection
connection.on('error', () => console.error.bind(console, 'connection error'));
connection.once('open', () => console.info('Connection to Database is successful'));

module.exports = conn;

let usuarioSchema = mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    cedula: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    Permiso: {
        type: ObjectId,
        default: ObjectId('6050ae3e96f425bd7bf19d3b')
    }
});
let ProductoSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: new Date(new Date() - 3600000 * 5),
        //required: true
    },
    refVendedora: {
        type: String,
        required: true
    },
    refInterna: {
        type: String,
        required: true
    },

    fileName: {
        type: String,
        required: true
    },
    costo: {
        type: Number,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    combinacion:{
        type:Array,
        required:true
    }

});
let TagSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },

    active: {
        type: Boolean,
        required: true
    }
});
let TallaSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },

    active: {
        type: Boolean,
        required: true
    }
});
let ColorSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    primario: {
        type: String,
        required: true
    },
    segundario: {
        type: String,
    },
    active: {
        type: Boolean,
        required: true
    }
});
let CategoriaSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
});
let CarritoSchema = mongoose.Schema({
    formato: {
        type: String,
        required: true

    },
    producto: {
        type: Array,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
});
let CarritoItemSchema = mongoose.Schema({
    id: {
        type: ObjectId,
        required: true
    },
    valor: {
        type: Number,
        required: true

    },
    color: {
        type: ObjectId,
        required: true
    },
    talla: {
        type: ObjectId,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    restante: {
        type: Number,
        required: true
    }, 
    combinacion: {
        type: String,
        required: true
    }
});
let ConfigSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true

    },
    csc: {
        type: String
    }
});
let FormatoSchema = mongoose.Schema({
    fecha: {
        type: Date,
        default: new Date(new Date() - 3600000 * 5)
    },
    formato: {
        type: String,
        required: true

    },
    documento: {
        type: Number,
        required: true

    },
    nombre: {
        type: String,
        required: true

    },
    barrio: {
        type: String,
        required: true

    },
    ciudad: {
        type: String,
        required: true

    },
    vendedor: {
        type: ObjectId,
        required: true

    },
    total: {
        type: Number,
        required: true

    },
    direccion: {
        type: String,
        required: true

    },
    telefono: {
        type: Number,
        required: true

    },
    pago: {
        type: String,
        required: true

    },
    etapa: {
        type: ObjectId,
        default: ObjectId("604b87f49ed8c060cc0e11db")
    },
    Productos: {
        type: Array
    },
    fac: {
        type: String,
        default:null
    },
    envio: {
        type: Number,
        default:0,
        required: true
    },
    observacion: {
        type: String,
        required: true
    },
})
let ErrorLogSchema = mongoose.Schema({
    deviceId:{
        type:String,
        required:true
    },
    error: {
        type: Object
    }, 
    fecha: {
        type: Date,
        default: new Date(new Date() - 3600000 * 5),
    },
    headers: {
        type: Object
    },
    params: {
        type: Object
    },
    body: {
        type: Object
    }
})
let CombinacionSchema = mongoose.Schema({
    talla:{
        type:ObjectId,
        required:true,
    },
    color:{
        type:ObjectId,
        required:true,
    },
    stock:{
        type: Number,
        required:true
    },
    img:{
        type:String,
        required:true
    }

})

// Export Contact model
module.exports = {
    Usuario: mongoose.model('usuario', usuarioSchema),
    Producto: mongoose.model('producto', ProductoSchema),
    Tag: mongoose.model('tag', TagSchema),
    Color: mongoose.model('color', ColorSchema),
    Talla: mongoose.model('talla', TallaSchema),
    Carrito: mongoose.model('carrito', CarritoSchema),
    CarritoItem: mongoose.model('carritoItem', CarritoItemSchema),
    Categoria: mongoose.model('categoria', CategoriaSchema),
    Config: mongoose.model('config', ConfigSchema),
    ErrorLog: mongoose.model('log', ErrorLogSchema),
    Formato: mongoose.model('formato', FormatoSchema),
    Combinacion : mongoose.model('combinacion',CombinacionSchema),
    conn: connection
}
