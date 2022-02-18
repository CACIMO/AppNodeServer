let router = require('express').Router()
var controller = require('./testController')

router.route('/producto')
    .put(controller.newProd)
    .post(controller.getProductList)
    .delete(controller.deleteProd)
router.route('/updateproducto/img')
    .put(controller.changeImage)
router.route('/updateproducto/combi')
    .post(controller.removeCombi)
    .put(controller.addNewCombi)
router.route('/updateproducto')
    .put(controller.updProducto)
    .post(controller.updateStock)
router.route('/categoria/:actv')
    .post(controller.newCat)
    .get(controller.getCat)
    .put(controller.updCat)
router.route('/color/:actv')
    .post(controller.newColor)
    .get(controller.getColor)
    .put(controller.updColor)
router.route('/tag/:actv')
    .post(controller.newTag)
    .get(controller.getTag)
    .put(controller.updTag)
router.route('/talla/:actv')
    .post(controller.newTalla)
    .get(controller.getTalla)
    .put(controller.updTalla)
router.route('/login')
    .post(controller.logIn)
router.route('/auth')
    .get(controller.auth)
router.route('/usuario')
    .get(controller.getUser)
    .put(controller.updateUser)
    .post(controller.nuevoUsuario)
router.route('/getImg/preview/:prod_id')
    .get(controller.getPreView)
router.route('/carrito/:cc')
    .post(controller.addCarrito)
    .get(controller.getListCarrito)
    .put(controller.removeCarrtito)
router.route('/csc')
    .get(controller.getCsc)
router.route('/formato')
    .get(controller.getFormatoAll)
    .put(controller.getFormatoDet)
    .post(controller.saveFormato)
router.route('/formato/img/:name')
    .put(controller.saveFactura)
    .get(controller.getFac)
    .post(controller.procesarPed)
router.route('/getForm/:idFormat')
    .get(controller.formatoId)
    .put(controller.procesarPed)
    .post(controller.getFormato)
router.route('/menuTk')
    .get(controller.getUSerTk)
    .post(controller.getUserId)
router.route('/etapa/:formato')
    .post(controller.cambiarEtapa)
router.route('/fact/:formato')
    .post(controller.subirFactura)
    .get(controller.getFac)
router.route('/qrscann')
    .post(controller.generateQr)
router.route('/email')
    .post(controller.sendEmail)

// Export API routes
module.exports = router;