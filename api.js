let router = require('express').Router()
var controller = require('./controller')
// Set default API response

// Import contact controller
// Contact routes
router.route('/producto/:prod_id')
    .post(controller.newProd)
    .put(controller.getProductList)
router.route('/categoria/:active')
    .post(controller.newCat)
    .get(controller.getCat)
    .put(controller.updCat)
router.route('/color/:active')
    .post(controller.newColor)
    .get(controller.getColor)
    .put(controller.updColor)
router.route('/tag/:active')
    .post(controller.newTag)
    .get(controller.getTag)
    .put(controller.updTag)
router.route('/talla/:active')
    .post(controller.newTalla)
    .get(controller.getTalla)
    .put(controller.updTalla)
router.route('/login')
    .post(controller.logIn)
router.route('/auth')
    .get(controller.auth)
router.route('/usuario')
    .post(controller.nuevoUsuario)
router.route('/getImg/:prod_id')
    .get(controller.getFile)
router.route('/carrito')
    .post(controller.addCarrito)
    .get(controller.getListCarrito)
router.route('/csc')
    .get(controller.getCsc)
router.route('/formato')
    .post(controller.saveFormato)



/* router.route('/contacts/:contact_id')
    .get(contactController.view)
    .patch(contactController.update)
    .put(contactController.update)
    .delete(contactController.delete);

 */
// Export API routes
module.exports = router;