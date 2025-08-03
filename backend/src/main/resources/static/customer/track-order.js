document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('foodnow_token');
  if (!token) window.location.href = '../index.html';

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  if (!orderId) window.location.href = 'orders.html';

  document.getElementById('order-title').textContent = `Tracking Order #${orderId}`;
  const orderDetailsContainer = document.getElementById('order-details');

  const apiFetch = async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('API request failed.');
    return response.json();
  };

  const fetchOrderDetails = async () => {
    try {
      const order = await apiFetch(`/orders/my-orders/${orderId}`);
      renderOrderDetails(order);
      initializeMap(order);
    } catch (error) {
      showToast('Could not load order details.', 'error');
    }
  };

  const renderOrderDetails = (order) => {
    orderDetailsContainer.innerHTML = `
      <h3 class="text-2xl font-bold">${order.restaurantName}</h3>
      <p class="text-lg font-semibold text-primary mt-2">Status: ${order.status.replace('_', ' ')}</p>
      <div class="mt-4 pt-4 border-t border-border">
        <p class="font-semibold">Delivery Address:</p>
        <p class="text-text-muted">${order.deliveryAddress}</p>
      </div>
    `;
  };

  const updateOrderStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/manage/orders/${orderId}/status`, {
        method: 'PATCH', // ✅ Must match backend
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'DELIVERED' }) // ✅ CORRECTED key
      });

      if (!res.ok) throw new Error('Failed to update order status');
      console.log('Order marked as DELIVERED');
      fetchOrderDetails();
    } catch (err) {
      console.error(err);
      showToast('Failed to update order status.', 'error');
    }
  };

  const initializeMap = (order) => {
    if (!order.restaurantLocationPin) {
      document.getElementById('map').innerHTML = '<p class="p-4 text-text-muted">Location tracking not available for this restaurant.</p>';
      return;
    }

    if (order.status === 'DELIVERED') return;

    const restaurantCoords = order.restaurantLocationPin.split(',').map(Number);
    const customerCoords = [restaurantCoords[0] + 0.05, restaurantCoords[1] + 0.05];

    const map = L.map('map').setView(restaurantCoords, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker(restaurantCoords).addTo(map).bindPopup('<b>Restaurant</b>').openPopup();
    L.marker(customerCoords).addTo(map).bindPopup('<b>Your Location</b>');

    if (order.status === 'OUT_FOR_DELIVERY') {
      const scooterIcon = L.divIcon({ className: 'scooter-icon', html: '🛵' });
      const scooterMarker = L.marker(restaurantCoords, { icon: scooterIcon }).addTo(map);

      setTimeout(() => scooterMarker.setLatLng([
        restaurantCoords[0] + (customerCoords[0] - restaurantCoords[0]) * 0.25,
        restaurantCoords[1] + (customerCoords[1] - restaurantCoords[1]) * 0.25
      ]), 2000);

      setTimeout(() => scooterMarker.setLatLng([
        restaurantCoords[0] + (customerCoords[0] - restaurantCoords[0]) * 0.50,
        restaurantCoords[1] + (customerCoords[1] - restaurantCoords[1]) * 0.50
      ]), 4000);

      setTimeout(() => scooterMarker.setLatLng([
        restaurantCoords[0] + (customerCoords[0] - restaurantCoords[0]) * 0.75,
        restaurantCoords[1] + (customerCoords[1] - restaurantCoords[1]) * 0.75
      ]), 6000);

      setTimeout(async () => {
        scooterMarker.setLatLng(customerCoords);
        showToast('Your order has arrived!', 'success');
        await updateOrderStatus(); // ✅ Mark as DELIVERED
      }, 8000);
    }
  };

  fetchOrderDetails();
});
