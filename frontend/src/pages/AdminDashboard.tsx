import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSweet, fetchSweets, searchSweets, updateSweet, deleteSweet, restockSweet } from "../redux/slice/sweetSlice";
import type { ReduxStoreType, ReduxDispatchType } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { addCategory, deleteCategory, fetchCategory } from "../redux/slice/categorySlice";

export default function AdminDashboard() {
  const dispatch = useDispatch<ReduxDispatchType>();
  const { items, loading } = useSelector((state: ReduxStoreType) => state.sweets);

  const [form, setForm] = useState({ name: "", categoryId: 0, price: 0 });
  const [editId, setEditId] = useState<any>(null);
  const [search, setSearch] = useState({ name: "", categoryId: 0, price: 0 });
  const [restockSweetData, setRestockSweetData] = useState<any>(null);
  const [restockSweetQuantity, setRestockSweetQuantity] = useState<number>(0);

  const categorys = useSelector((state: ReduxStoreType) => state.categorys.items);
  const [categoryName, setCategoryName] = useState("");

  const navigate = useNavigate();
  const userInfo = useSelector((state: ReduxStoreType) => state.userData.userInfo);
  const token = userInfo?.token;
  const error = useSelector((state: ReduxStoreType) => state.sweets.error);
  const categoryError = useSelector((state: ReduxStoreType) => state.categorys.error);

  useEffect(() => {
    if (!token) return;
    if (userInfo?.user?.role === "CUSTOMER") navigate("/user-dashboard");
    else if (userInfo?.user?.role === "ADMIN") navigate("/admin-dashboard");
  }, [userInfo, token, navigate]);

  useEffect(() => {
    if (token) {
      dispatch(fetchSweets(token));
      dispatch(fetchCategory(token));
    }
  }, [dispatch, token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateSweet({ id: editId, data: form, token }));
      setEditId(null);
    } else {
      dispatch(addSweet({ sweet: form, token }));
    }
    setForm({ name: "", categoryId: 0, price: 0 });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchSweets({ query: search, token }));
  };

  const addCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.length < 4) {
      alert("Category must have at least 4 characters");
      return;
    }
    dispatch(addCategory({ name: categoryName, token }));
    setCategoryName("");
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sweet Shop Admin Dashboard</h1>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
          onClick={() => { localStorage.removeItem('authorization'); location.reload(); }}
        >
          Logout
        </button>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* Add Category */}
          <div className="bg-gray-700 p-4 rounded-lg shadow-md">
            <form onSubmit={addCategorySubmit} className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="p-2 rounded border border-gray-600 bg-gray-800 focus:ring-[#b95b45] focus:border-[#b95b45] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#b95b45] hover:bg-[#a34b38] text-white px-4 py-2 rounded transition-colors duration-200"
              >
                Add Category
              </button>
            </form>
            {categoryError && (
              <p className="text-red-500 mt-2">{categoryError}</p>
            )}
            <div className="overflow-auto max-h-64 mt-4 bg-gray-900 rounded shadow p-2">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-600">
                    <th className="p-2">Name</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categorys.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-800">
                      <td className="p-2">{category.name}</td>
                      <td className="p-2">
                        <button
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                          onClick={() => category.id && dispatch(deleteCategory({ id: category.id, token }))}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add / Edit Sweet */}
          <div className="bg-gray-700 p-4 rounded-lg shadow-md flex flex-col items-center space-y-2">
            <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-2 rounded border border-gray-600 bg-gray-800 focus:ring-[#b95b45] focus:border-[#b95b45] focus:outline-none"
              />
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                className="p-2 rounded border border-gray-600 bg-gray-800 focus:ring-[#b95b45] focus:border-[#b95b45] focus:outline-none"
              >
                <option value="">Select Category</option>
                {categorys.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
              <input
                type="text"
                placeholder="Price"
                value={form.price === 0 || isNaN(form.price) ? "" : form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="p-2 rounded border border-gray-600 bg-gray-800 focus:ring-[#b95b45] focus:border-[#b95b45] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {editId ? "Update Sweet" : "Add Sweet"}
              </button>
              {editId && (
                <span
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer text-center"
                  onClick={() => { setEditId(null); setForm({ name: "", categoryId: 0, price: 0 }) }}
                >
                  Stop Edit
                </span>
              )}
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Restock Sweet */}
            {restockSweetData && (
              <div className="mt-4 w-full bg-gray-900 p-3 rounded-lg shadow-md flex items-center space-x-2">
                <p className="flex-1">{restockSweetData.name} ({restockSweetData.quantity})</p>
                <input
                  type="number"
                  value={restockSweetQuantity === 0 || isNaN(restockSweetQuantity) ? "" : restockSweetQuantity}
                  onChange={(e) => setRestockSweetQuantity(Number(e.target.value))}
                  className="w-20 p-1 rounded border border-gray-600 bg-gray-800 focus:outline-none"
                />
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                  onClick={() => {
                    restockSweetData?.id && dispatch(restockSweet({ id: restockSweetData.id, quantity: restockSweetQuantity, token }));
                    setRestockSweetData(null);
                    setRestockSweetQuantity(0);
                  }}
                >
                  Restock
                </button>
              </div>
            )}
          </div>

          {/* Search & Sweets Table */}
          <div className="bg-gray-700 p-4 rounded-lg shadow-md col-span-1 md:col-span-2 xl:col-span-3">
            <form onSubmit={handleSearch} className="flex flex-wrap space-x-2 mb-4">
              <input
                type="text"
                placeholder="Search Name"
                value={search.name || ""}
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
                className="p-2 rounded border border-gray-600 bg-gray-800 focus:ring-[#b95b45] focus:border-[#b95b45] focus:outline-none"
              />
              <select
                value={search.categoryId || ""}
                onChange={(e) => setSearch({ ...search, categoryId: Number(e.target.value) })}
                className="p-2 rounded border border-gray-600 bg-gray-800 focus:ring-[#b95b45] focus:border-[#b95b45] focus:outline-none"
              >
                <option value="">Select Category</option>
                {categorys.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
              <input
                type="text"
                placeholder="Search Price"
                value={search.price === 0 || isNaN(search.price) ? "" : search.price}
                onChange={(e) => setSearch({ ...search, price: Number(e.target.value) })}
                className="p-2 rounded border border-gray-600 bg-gray-800 focus:ring-[#b95b45] focus:border-[#b95b45] focus:outline-none"
              />
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Search</button>
            </form>

            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
              onClick={() => token && dispatch(fetchSweets(token))}
            >
              Show All Sweets
            </button>

            {loading && <p>Loading...</p>}

            <div className="overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-600">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Category</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Quantity</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? items.map((sweet) => (
                    <tr key={sweet.id} className="hover:bg-gray-800">
                      <td className="border p-2">{sweet.name}</td>
                      <td className="border p-2">{sweet.category.name}</td>
                      <td className="border p-2">{sweet.price}</td>
                      <td className="border p-2 flex items-center space-x-2">
                        <span>{sweet.quantity}</span>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded"
                          onClick={() => { setRestockSweetData(sweet); setRestockSweetQuantity(0); }}
                        >
                          Restock
                        </button>
                      </td>
                      <td className="border p-2 flex space-x-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded"
                          onClick={() => { setForm(sweet); setEditId(sweet.id); }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                          onClick={() => sweet.id && dispatch(deleteSweet({ id: sweet.id, token }))}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="text-center p-2">No sweets found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
