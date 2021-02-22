let router = require('express').Router()
var controller = require('./controller')
// Set default API response

// Import contact controller
// Contact routes
router.route('./auth')
    .get(controller.makeToken)
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