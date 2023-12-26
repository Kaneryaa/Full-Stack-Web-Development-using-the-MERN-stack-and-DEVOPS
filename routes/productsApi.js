const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  res.send('Product router');
});
++++++++++++++++++++++++
module.exports = router;
