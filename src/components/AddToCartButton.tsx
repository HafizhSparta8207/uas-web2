"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/app/actions/cart";
import { useSession } from "next-auth/react";

export function AddToCartButton({ bookId, stock }: { bookId: number, stock: number }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleAdd = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    
    setLoading(true);
    const res = await addToCart(bookId, quantity);
    setLoading(false);
    
    if (res.success) {
      // Show success toast or update cart count in navbar
      router.refresh();
      // Optional: push to cart
      // router.push("/cart");
    } else {
      alert(res.error || "Gagal menambahkan ke keranjang");
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex border border-gray-300 rounded-lg overflow-hidden w-28 shrink-0 bg-white">
        <button 
          className="px-3 text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >-</button>
        <input 
          type="number" 
          className="w-full text-center border-x border-gray-200 outline-none font-mono text-navy font-medium"
          value={quantity}
          onChange={(e) => setQuantity(Math.min(stock, Math.max(1, parseInt(e.target.value) || 1)))}
          max={stock}
          min={1}
        />
        <button 
          className="px-3 text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
        >+</button>
      </div>
      <button 
        onClick={handleAdd}
        disabled={loading}
        className="flex-grow flex items-center justify-center gap-2 bg-brand/10 hover:bg-brand/20 text-brand font-medium py-2.5 rounded-lg transition-colors border border-brand/20 disabled:opacity-50"
      >
        <ShoppingCart className="w-5 h-5" />
        {loading ? "..." : "Keranjang"}
      </button>
    </div>
  );
}
