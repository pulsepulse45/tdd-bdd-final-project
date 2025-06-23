const express = require('express');
const { Product, Category, sequelize } = require('../models/product');
const { Op } = require('sequelize');
const { validateProduct, checkContentType } = require('../middleware/validation');

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 200, message: 'OK' });
});

/**
 * READ A PRODUCT
 */
router.get('/:id', async (req, res) => {
  try {
    console.log('Request to Retrieve a product with id [%s]', req.params.id);
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.status(200).json(product.serialize());
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * CREATE A NEW PRODUCT
 */
router.post('/', checkContentType('application/json'), validateProduct, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const location = `/api/products/${product.id}`;
    res.status(201)
       .location(location)
       .json(product.serialize());
  } catch (error) {
    res.status(400).json({ 
      error: 'Bad Request', 
      message: error.message 
    });
  }
});

/**
 * UPDATE AN EXISTING PRODUCT
 */
router.put('/:id', checkContentType('application/json'), validateProduct, async (req, res) => {
  try {
    console.log('Request to Update a product with id [%s]', req.params.id);
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(req.body);
      res.status(200).json(product.serialize());
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Bad Request', message: error.message });
  }
});

/**
 * DELETE A PRODUCT
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Not Found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * LIST ALL PRODUCTS
 */
router.get('/', async (req, res) => {
  try {
    const { category, availability, name } = req.query;
    const where = {};
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }
    if (availability) {
      where.available = availability === 'true';
    }
    if (category) {
      if (Object.values(Category).includes(category)) {
        where.category = category;
      } else {
        return res.status(200).json([]);
      }
    }
    const products = await Product.findAll({ where });
    res.status(200).json(products.map(p => p.serialize()));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;