const nodemailer = require('nodemailer');
module.exports = {
    conf: {
        mongoUrl: 'mongodb://localhost/app_amdbb',
        port: 3000,
        separador:',',
        key: '4da7dd4d1772bb8cfe523cec2f0aa9df8ffa8ce0387d5e9ba15edf9362c85686101c07338a0d163600c8492296f2a93028875f27a347c7c796f5c0c5fb039d98',
        csvEncabezado: 'Fecha,Referencia,Color,Cantidad,Precio unitario,Costo unitario,Precio total,Costo total,Formato,Num.,Vendedora\n',
        transport: nodemailer.createTransport({
            host: 'mail.amordebb.com',
            port: 465,
            auth: {
                user: 'admin@amordebb.com',
                pass: 'ivR+8WM&3l?G'
            }
        })
    }
}