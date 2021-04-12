const { ObjectId, ObjectID } = require('bson');
let mongoose = require('mongoose');
mongoose.pluralize(null);
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
    stock: {
        type: Number,
        required: true
    },

    valor: {
        type: Number,
        required: true
    },
    costo: {
        type: Number,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    img: {
        type: Buffer,
        required: true
    },
    pesoImg: {
        type: Number,
        required: true

    },
    tag: {
        type: Array
    },
    color: {
        type: Array
    },
    categoria: {
        type: Array
    },
    talla: {
        type: Array
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
    }
});
let ConfigSchema = mongoose.Schema({
    titulo: {
        type: String,
        require: true

    },
    csc: {
        type: String
    }
});
let FormatoSchema = mongoose.Schema({
    fecha: {
        type: Date,
        default: new Date(new Date() - 3600000 * 50)
    },
    formato: {
        type: String,
        require: true

    },
    documento: {
        type: Number,
        require: true

    },
    nombre: {
        type: String,
        require: true

    },
    barrio: {
        type: String,
        require: true

    },
    ciudad: {
        type: String,
        require: true

    },
    vendedor: {
        type: ObjectId,
        require: true

    },
    total: {
        type: Number,
        require: true

    },
    direccion: {
        type: String,
        require: true

    },
    telefono: {
        type: Number,
        require: true

    },
    pago: {
        type: String,
        require: true

    },
    etapa: {
        type: ObjectId,
        default: ObjectId("604b87f49ed8c060cc0e11db")
    },
    Productos: {
        type: Array
    },
    fac: {
        type: Buffer,
        default:null
    },
    envio: {
        type: Number,
        default:0,
        require: true
    },
})
let ErrorLogSchema = mongoose.Schema({
    deviceId:{
        type:String,
        require:true
    },
    error: {
        type: Object
    }, 
    fecha: {
        type: Date,
        default: new Date(new Date() - 3600000 * 5),
        //required: true
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
}
