import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  categories = [],
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'burgers',
    description: '',
    price: '',
    costPrice: '',
    gst: 5,
    stock: '',
    minStock: 10,
    image: '',
    available: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'burgers',
        description: product.description || '',
        price: product.price || '',
        costPrice: product.costPrice || '',
        gst: product.gst || 5,
        stock: product.stock || '',
        minStock: product.minStock || 10,
        image: product.image || '',
        available: product.available !== false,
      });
    } else {
      setFormData({
        name: '',
        category: categories[0]?.slug || 'burgers',
        description: '',
        price: '',
        costPrice: '',
        gst: 5,
        stock: '',
        minStock: 10,
        image: '',
        available: true,
      });
    }
  }, [product, categories, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || formData.stock === '') {
      alert('Please fill in required fields: Name, Price, and Stock.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      costPrice: Number(formData.costPrice || 0),
      gst: Number(formData.gst || 5),
      stock: Number(formData.stock),
      minStock: Number(formData.minStock || 10),
      image:
        formData.image ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Food Product'}
      subtitle={product ? `Modifying ${product.name}` : 'Create a new menu item for POS'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          {/* Product Name */}
          <div className="col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Double Cheese Smash Burger"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none capitalize"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* GST % */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">GST Rate (%)</label>
            <select
              value={formData.gst}
              onChange={(e) => setFormData({ ...formData, gst: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
            >
              <option value="0">0% (Nil)</option>
              <option value="5">5% (Standard Fast Food/Restaurant)</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
            <input
              type="number"
              required
              min="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 140"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Cost Price */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Cost Price (₹)</label>
            <input
              type="number"
              min="0"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              placeholder="e.g. 55"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Available Stock *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="e.g. 50"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Min Stock */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Low Stock Alert Level</label>
            <input
              type="number"
              min="1"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              placeholder="e.g. 10"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Image URL */}
          <div className="col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
            />
            {formData.image && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={formData.image}
                  alt="preview"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                />
                <span className="text-[10px] text-slate-400">Image Preview</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ingredients and serving details..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Available status */}
          <div className="col-span-2 flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="product-available"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
            />
            <label htmlFor="product-available" className="font-bold text-slate-700">
              Active on POS Menu (Available for Billing)
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm shadow-orange-500/20"
          >
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
