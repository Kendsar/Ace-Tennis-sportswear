import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { productsAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Trash2, Edit, Plus, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'women' | 'men';
  colors: string[];
  sizes: string[];
  description?: string;
  in_stock: boolean;
}

export function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'women' as 'women' | 'men',
    colors: '',
    sizes: '',
    description: '',
    in_stock: true,
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
    }
  }, [isAdmin]);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      colors: product.colors.join(', '),
      sizes: product.sizes.join(', '),
      description: product.description || '',
      in_stock: product.in_stock,
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productsAPI.delete(id);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
      colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
      description: formData.description,
      in_stock: formData.in_stock,
    };

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(productData);
        toast.success('Product created successfully');
      }

      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  }

  function resetForm() {
    setFormData({
      name: '',
      price: '',
      image: '',
      category: 'women',
      colors: '',
      sizes: '',
      description: '',
      in_stock: true,
    });
    setEditingProduct(null);
  }

  function handleCancel() {
    setShowForm(false);
    resetForm();
  }

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 uppercase tracking-wide">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 uppercase tracking-wide">
              Manage Products
            </p>
          </div>

          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="uppercase">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>

        {showForm && (
          <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-tight">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs uppercase">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-xs uppercase">Image URL *</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs uppercase">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'women' | 'men' })}
                    className="w-full h-10 px-3 border border-gray-200 rounded-md"
                    required
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colors" className="text-xs uppercase">Colors (comma separated) *</Label>
                  <Input
                    id="colors"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="#1a1a1a, #ffffff, #4a5568"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sizes" className="text-xs uppercase">Sizes (comma separated) *</Label>
                  <Input
                    id="sizes"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="XS, S, M, L, XL"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs uppercase">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-md"
                  placeholder="Product description..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="in_stock"
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="in_stock" className="text-xs uppercase">In Stock</Label>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" className="uppercase">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="uppercase">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 uppercase tracking-wide">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover" />
                  <div>
                    <h3 className="font-bold uppercase tracking-tight">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.price.toFixed(3)} DT</p>
                    <p className="text-xs text-gray-500 uppercase">{product.category}</p>
                    <p className="text-xs text-gray-500">
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
