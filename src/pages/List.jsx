import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { backendUrl, currency } from "../constant";
import { toast } from "react-toastify";

function List({ token }) {
  const [list, setList] = useState([]);

  const fetchList = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);

      if (data?.success) {
        console.log("products fetched");
        setList(data?.products);
      } else {
        console.log("could not fetch products");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error in List.jsx for fetchList : ", err);
      toast.error(err?.message);
    }
  }, [token]);

  const removeProduct = async (e, id) => {
    try {
      console.log("remove clicked");
      const { data } = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (data?.success) {
        console.log("products fetched");
        toast.success(data?.message);
        await fetchList();
        // e.target.parentNode.remove();
      } else {
        console.log("could not delete products");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error in List.jsx for removeProduct : ", err);
      toast.error(err?.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchList();
    }
  }, [fetchList, token]);

  if (!list.length) return null;

  return (
    <>
      <p className="mb-2">All products List</p>

      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}
        {list.map((item) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 border text-sm"
            key={item?._id}
          >
            <img
              src={item?.image[0]}
              className="w-12"
              alt={`${item?._id}_img`}
            />
            <p>{item?.name}</p>
            <p>{item?.category}</p>
            <p>
              {currency}
              {item?.price}
            </p>
            <p
              onClick={(e) => removeProduct(e, item?._id)}
              className="text-right md:text-center cursor-pointer text-lg hover:text-red-600"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default List;
