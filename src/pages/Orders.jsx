import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../constant";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

function Orders({ token }) {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = useCallback(async () => {
    if (!token) {
      return null;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (data?.success) {
        console.log("orders fetched");
        setOrders(data?.orders.reverse());
      } else {
        console.log("could not fetch orders");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log("Error in fetching all Orders in Orders.jsx : ", err);
      toast.error(err?.message);
    }
  }, [token]);

  const statusHandler = async (e, orderId) => {
    if (!token) {
      return null;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: e.target.value },
        { headers: { token } }
      );

      if (data?.success) {
        console.log("orders status updated");
        await fetchAllOrders();
        // toast.success(data?.message);
      } else {
        console.log("could not update status");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log(
        "Error in updating status in statusHandler in Orders.jsx : ",
        err
      );
      toast.error(err?.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  console.log("orders : ", orders);
  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={order?._id}
          >
            <img
              src={assets.parcel_icon}
              className="w-12"
              alt={`${order?._id}_parcel_icon`}
            />
            <div>
              <div>
                {order?.items.map((item, index) => {
                  if (index === order?.items?.length - 1) {
                    return (
                      <p className="py-0.5" key={`${item?._id}_${index}`}>
                        {item?.name} x {item?.quantity}{" "}
                        <span>{item?.size}</span>
                      </p>
                    );
                  } else {
                    return (
                      <p className="py-0.5" key={`${item?._id}_${index}`}>
                        {item?.name} x {item?.quantity}{" "}
                        <span>{item?.size}</span>,
                      </p>
                    );
                  }
                })}
              </div>
              <p className="mt-3 mb-2 font-medium">{`${order?.address?.firstName} ${order?.address?.lastName}`}</p>
              <div>
                <p>{`${order?.address?.street},`}</p>
                <p>{`${order?.address?.city}, ${order?.address?.state}, ${order?.address?.country}, ${order?.address?.zipcode}`}</p>
              </div>
              <p>{order?.address?.phonr}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items: {order?.items?.length}
              </p>
              <p className="mt-3">Method: {order?.paymentMethod}</p>
              <p>Payment: {order?.payment ? "Done" : "Pending"}</p>
              <p>Date : {new Date(order?.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency}
              {order?.amount}
            </p>
            <select
              className="p-2 font-semibold"
              value={order?.status}
              onChange={(e) => statusHandler(e, order?._id)}
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
