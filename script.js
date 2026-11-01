// QR ngân hàng 
const BANK_ID = "MB";
const BANK_ACCOUNT = "0707877173";
// Danh sách sản phẩm mẫu
const products = [
    { id: 1, name: "Áo thun Basic", category: "Áo", price: 159000,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Áo sơ mi Minimal", category: "Áo", price: 249000,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Quần jeans Classic", category: "Quần", price: 399000,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "Áo khoác Streetwear", category: "Áo khoác", price: 499000,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80" },
    { id: 5, name: "Áo hoodie Oversize", category: "Áo", price: 359000,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80" },
    { id: 6, name: "Quần kaki Modern", category: "Quần", price: 329000,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80" },
    { id: 7, name: "Túi thời trang", category: "Phụ kiện", price: 199000,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80" },
    { id: 8, name: "Áo khoác Denim", category: "Áo khoác", price: 459000,
      image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=600&q=80" }
];

let cart = [];
let currentOrder = null;

const $ = id => document.getElementById(id);

function money(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency", currency: "VND"
    }).format(value);
}

function safeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[char]);
}

function renderProducts() {
    const keyword = $("searchInput").value.trim().toLowerCase();
    const category = $("categoryFilter").value;
    const sort = $("sortFilter").value;

    let list = products.filter(product =>
        product.name.toLowerCase().includes(keyword) &&
        (category === "all" || product.category === category)
    );

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    $("productGrid").innerHTML = list.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img src="${safeText(product.image)}"
                     alt="${safeText(product.name)}"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='https://placehold.co/500x600/e5e5e3/333?text=31-OFF'">
                <span class="product-tag">31-OFF</span>
            </div>
            <div class="product-info">
                <p class="category">${safeText(product.category)}</p>
                <h3>${safeText(product.name)}</h3>
                <p class="price">${money(product.price)}</p>
                <button class="add-cart" onclick="addToCart(${product.id})">
                    + THÊM VÀO GIỎ
                </button>
            </div>
        </article>
    `).join("");

    $("emptyMessage").classList.toggle("hidden", list.length !== 0);
}

function showAddForm() {
    $("addForm").classList.toggle("hidden");
}

$("addForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("newName").value.trim();
    const price = Number($("newPrice").value);
    const category = $("newCategory").value;
    const image = $("newImage").value.trim();

    if (!name || !Number.isFinite(price) || price <= 0 || !image) {
        alert("Vui lòng nhập đầy đủ thông tin hợp lệ.");
        return;
    }

    products.unshift({
        id: Date.now(), name, price, category, image
    });

    $("addForm").reset();
    $("addForm").classList.add("hidden");
    $("searchInput").value = "";
    $("categoryFilter").value = "all";
    renderProducts();
    alert("Đã thêm sản phẩm!");
});

function addToCart(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });

    renderCart();
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += amount;
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
    $("cartCount").textContent =
        cart.reduce((sum, item) => sum + item.quantity, 0);
    $("cartTotal").textContent = money(cartTotal());

    $("cartItems").innerHTML = cart.length ? cart.map(item => `
        <div class="cart-item">
            <img src="${safeText(item.image)}" alt="${safeText(item.name)}">
            <div>
                <h4>${safeText(item.name)}</h4>
                <p>${money(item.price * item.quantity)}</p>
                <div class="quantity">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Xóa</button>
        </div>
    `).join("") : "<p style='padding:25px 0;color:#777'>Giỏ hàng đang trống.</p>";
}

function toggleCart() {
    $("cartPanel").classList.toggle("open");
    $("overlay").classList.toggle("hidden");
}

function checkout() {
    if (!cart.length) {
        alert("Bạn chưa có sản phẩm trong giỏ hàng.");
        return;
    }

    $("checkoutTotal").textContent = money(cartTotal());
    $("checkoutForm").classList.remove("hidden");
    $("qrSection").classList.add("hidden");
    $("checkoutModal").classList.remove("hidden");
    $("cartPanel").classList.remove("open");
    $("overlay").classList.add("hidden");
    $("paymentMethod").value = "cod";
    $("submitOrder").textContent = "ĐẶT HÀNG COD";
}

function closeCheckout() {
    $("checkoutModal").classList.add("hidden");
}

function changePaymentMethod() {
    const method = $("paymentMethod").value;
    $("submitOrder").textContent =
        method === "cod" ? "ĐẶT HÀNG COD" : "TẠO MÃ QR MB BANK";
}

$("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();

    if (!cart.length) {
        alert("Giỏ hàng đang trống.");
        closeCheckout();
        return;
    }

    const orderCode = "OFF" + Date.now().toString().slice(-8);
    const method = $("paymentMethod").value;

    currentOrder = {
        code: orderCode,
        total: cartTotal(),
        customer: $("customerName").value.trim(),
        phone: $("customerPhone").value.trim(),
        address: $("customerAddress").value.trim(),
        paymentMethod: method === "cod" ? "Tiền mặt khi nhận hàng" : "QR MB Bank",
        items: cart.map(item => ({
            id: item.id, name: item.name,
            price: item.price, quantity: item.quantity
        })),
        status: method === "cod" ? "Chờ giao hàng - COD" : "Chờ xác minh thanh toán",
        createdAt: new Date().toISOString()
    };

    if (method === "cod") {
        saveOrder();
        return;
    }

    const qrUrl = new URL(
        `https://img.vietqr.io/image/${BANK_ID}-${BANK_ACCOUNT}-compact2.png`
    );
    qrUrl.searchParams.set("amount", String(currentOrder.total));
    qrUrl.searchParams.set("addInfo", orderCode);

    $("qrImage").src = qrUrl.toString();
    $("orderCode").textContent = orderCode;
    $("checkoutForm").classList.add("hidden");
    $("qrSection").classList.remove("hidden");
});

function saveOrder() {
    if (!currentOrder) return;

    try {
        const orders = JSON.parse(localStorage.getItem("31off_orders") || "[]");
        orders.push(currentOrder);
        localStorage.setItem("31off_orders", JSON.stringify(orders));
    } catch (error) {
        alert("Không thể lưu đơn hàng trong trình duyệt.");
        return;
    }

    alert(
        "Đặt hàng thành công!\n" +
        "Mã đơn: " + currentOrder.code + "\n" +
        "Thanh toán: " + currentOrder.paymentMethod + "\n" +
        "Tổng tiền: " + money(currentOrder.total)
    );

    cart = [];
    currentOrder = null;
    renderCart();
    closeCheckout();
}

function confirmOrder() {
    if (!currentOrder || currentOrder.paymentMethod !== "QR MB Bank") {
        alert("Không tìm thấy đơn hàng QR.");
        return;
    }

    // demo và không kiểm tra GD
    saveOrder();
}

renderProducts();
renderCart();
