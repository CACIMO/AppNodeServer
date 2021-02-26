let router = require('express').Router()
var controller = require('./controller')
// Set default API response

// Import contact controller
// Contact routes
router.route('/producto/:prod_id')
    .post(controller.newProd)
    .get(controller.getProductList)
router.route('/categoria')
    .post(controller.newCat)
    .get(controller.getCat)
    .put(controller.updCat)
router.route('/color')
    .post(controller.newColor)
    .get(controller.getColor)
    .put(controller.updColor)
router.route('/tag')
    .post(controller.newTag)
    .get(controller.getTag)
    .put(controller.updTag)
router.route('/login')
    .post(controller.logIn)
router.route('/auth')
    .get(controller.auth)
router.route('/usuario')
    .post(controller.nuevoUsuario);
router.route('/getImg/:prod_id')
    .get(controller.getFile)
/* router.route('/contacts/:contact_id')
    .get(contactController.view)
    .patch(contactController.update)
    .put(contactController.update)
    .delete(contactController.delete);

 */
// Export API routes
module.exports = router;