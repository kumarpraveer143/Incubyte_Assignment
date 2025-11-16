import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSweets, purchaseSweet, searchSweets } from "../redux/slice/sweetSlice";
import type { ReduxStoreType, ReduxDispatchType } from "../redux/store";
import { fetchCategory } from "../redux/slice/categorySlice";

export default function UserDashboard() {
  const dispatch = useDispatch<ReduxDispatchType>();
  const { items, loading } = useSelector((state: ReduxStoreType) => state.sweets);
  const token = useSelector((state: ReduxStoreType) => state.userData.userInfo?.token);
  const categorys = useSelector((state: ReduxStoreType) => state.categorys.items || []);

  // Store quantity for each sweet
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // search sweet form
  const [search, setSearch] = useState<{ name: string; categoryId: number; price: number }>({ name: "", categoryId: 0, price: 0 });

  useEffect(() => {
    if (token) {
      dispatch(fetchSweets(token));
      dispatch(fetchCategory(token));
    }
  }, [dispatch, token]);

  const handleQuantityChange = useCallback((id: number, value: string) => {
    const num = Number(value);
    const quantity = Number.isFinite(num) ? Math.max(0, Math.floor(num)) : 0; // integer >= 0
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  }, []);

  const handlePurchase = useCallback((sweetId: number) => {
    const quantity = quantities[sweetId] || 0;
    if (token && quantity > 0) {
      dispatch(purchaseSweet({ id: sweetId, quantity, token }));
      setQuantities((prev) => ({ ...prev, [sweetId]: 0 })); // reset after purchase
    }
  }, [dispatch, quantities, token]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchSweets({ query: search, token }));
  }, [dispatch, search, token]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authorization");
    location.reload();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#27374D] via-[#526D82] to-[#9DB2BF]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#DDE6ED]">Purchase Sweets</h1>
          <button
            onClick={handleLogout}
            className="bg-[#b95b45] hover:bg-[#a24b3f] text-white px-4 py-2 rounded shadow-sm"
          >
            Logout
          </button>
        </div>

        <div className="bg-[#0f1724]/90 border border-[#27374D] rounded-2xl p-6 shadow-lg">
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search Name"
              value={search.name || ""}
              onChange={(e) => setSearch((s) => ({ ...s, name: e.target.value }))}
              className="px-3 py-2 rounded border border-[#526D82] bg-[#0b1220] text-[#DDE6ED] focus:ring-2 focus:ring-[#9DB2BF]"
            />

            <select
              value={search.categoryId || ""}
              onChange={(e) => setSearch((s) => ({ ...s, categoryId: Number(e.target.value) || 0 }))}
              className="px-3 py-2 rounded border border-[#526D82] bg-[#0b1220] text-[#DDE6ED] focus:ring-2 focus:ring-[#9DB2BF]"
            >
              <option value="">All Categories</option>
              {categorys.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Max Price"
              value={search.price === 0 || isNaN(search.price) ? "" : search.price}
              onChange={(e) => setSearch((s) => ({ ...s, price: Number(e.target.value) || 0 }))}
              className="px-3 py-2 rounded border border-[#526D82] bg-[#0b1220] text-[#DDE6ED] focus:ring-2 focus:ring-[#9DB2BF]"
            />

            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#526D82] to-[#9DB2BF] text-[#0f1724] rounded">Search</button>
          </form>

          {loading ? (
            <p className="text-[#DDE6ED]">Loading sweets...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-[#27374D] text-[#DDE6ED]">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Available</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((sweet: any) => {
                    const quantity = quantities[sweet.id] || 0;
                    const canPurchase = quantity > 0 && sweet.quantity >= quantity;

                    return (
                      <tr key={sweet.id} className="odd:bg-[#0b1220] even:bg-[#081021] text-[#DDE6ED]">
                        <td className="p-3">{sweet.name}</td>
                        <td className="p-3">{sweet.category?.name}</td>
                        <td className="p-3">{sweet.price}</td>
                        <td className="p-3">{sweet.quantity}</td>
                        <td className="p-3">
                          <input
                            type="number"
                            min="1"
                            value={quantity === 0 || isNaN(quantity) ? "" : quantity}
                            onChange={(e) => handleQuantityChange(sweet.id, e.target.value)}
                            className="w-24 px-2 py-1 rounded border border-[#526D82] bg-[#0b1220] text-[#DDE6ED]"
                            disabled={sweet.quantity === 0}
                          />
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handlePurchase(sweet.id)}
                            disabled={!canPurchase}
                            className={`px-4 py-2 rounded ${canPurchase
                              ? "bg-[#9DB2BF] hover:brightness-95 text-[#0f1724]"
                              : "bg-gray-600 text-gray-300 cursor-not-allowed"
                              }`}
                          >
                            Purchase
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center p-6 text-[#9DB2BF]">No sweets available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
