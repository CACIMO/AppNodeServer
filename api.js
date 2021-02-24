let router = require('express').Router()
var controller = require('./controller')
// Set default API response

// Import contact controller
// Contact routes
router.route('/producto')
    .post(controller.newProd)
router.route('/categoria')
    .post(controller.newCat)
router.route('/tag')
    .post(controller.newTag)
router.route('/login')
    .post(controller.logIn)
router.route('/auth')
    .get(controller.auth)
router.route('/usuario')
    .post(controller.nuevoUsuario);
/* router.route('/contacts/:contact_id')
    .get(contactController.view)
    .patch(contactController.update)
    .put(contactController.update)
    .delete(contactController.delete);

 */
// Export API routes
module.exports = router;