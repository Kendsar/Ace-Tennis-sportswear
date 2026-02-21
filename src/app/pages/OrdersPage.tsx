import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { ordersAPI } from '../services/api';
import { toast } from 'sonner';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

interface Order {
  id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items?: any[];
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' },
};

export function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to view your orders');
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  async function loadOrders() {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  async function loadOrderDetails(orderId: string) {
    try {
      const response = await ordersAPI.getById(orderId);
      setSelectedOrder(response.order);
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Failed to load order details');
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 uppercase tracking-wide">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
            My Orders
          </h1>
          <p className="text-sm text-gray-600 uppercase tracking-wide">
            View your order history
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 uppercase tracking-wide">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 uppercase tracking-wide mb-4">No orders yet</p>
            <Button
              variant="secondary"
              className="bg-black text-white hover:bg-gray-800 uppercase tracking-wide relative overflow-hidden group"
              onClick={() => navigate('/women')}
            >
              Start Shopping
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={order.id}
                  className="border border-gray-200 p-6 hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => loadOrderDetails(order.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
                      <StatusIcon className={`w-4 h-4 ${config.color}`} />
                      <span className={`text-xs uppercase tracking-wide ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">
                      {parseFloat(order.total_amount.toString()).toFixed(2)} DT
                    </p>
                    <Button variant="outline" className="text-sm uppercase tracking-wide hover:underline p-0 h-auto border-0">
                      View Details →
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">
                  Order Details
                </h2>
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  #{selectedOrder.id.slice(0, 8)}
                </p>
              </div>

              <div className="space-y-6">
                {/* Order Status */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const config = statusConfig[selectedOrder.status];
                      const StatusIcon = config.icon;
                      return (
                        <>
                          <StatusIcon className={`w-5 h-5 ${config.color}`} />
                          <span className={`uppercase tracking-wide ${config.color}`}>
                            {config.label}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Order Date */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Order Date
                  </p>
                  <p>{formatDate(selectedOrder.created_at)}</p>
                </div>

                {/* Order Items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-4">
                      Items ({selectedOrder.items.length})
                    </p>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div key={index} className="flex gap-4 border-b border-gray-100 pb-4">
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-20 h-20 object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold uppercase tracking-tight mb-1">
                              {item.product_name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              Color: <span
                                className="inline-block w-4 h-4 border border-gray-300 align-middle"
                                style={{ backgroundColor: item.selected_color }}
                              />
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              Size: {item.selected_size}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {parseFloat(item.price).toFixed(2)} DT
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg uppercase tracking-wide">Total</span>
                    <span className="text-2xl font-bold">
                      {parseFloat(selectedOrder.total_amount.toString()).toFixed(2)} DT
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <Button
                  variant="secondary"
                  className="w-full bg-black text-white hover:bg-gray-800 uppercase tracking-wide"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
