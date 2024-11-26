import React from 'react'

const Table = ({ data, setdata }) => {

  async function handledelete(id) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:3001/items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        setdata(data.filter(item => item.id !== id));
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  return (
    <div className="p-6 z-10">
  <table className="m-auto w-full max-w-5xl rounded-xl bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-2xl overflow-hidden">
    {/* Table Header */}
    <thead className="bg-gradient-to-r from-gray-600 to-gray-900">
      <tr>
        <th
          colSpan="5"
          className="py-4 text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400"
        >
          Inventory List
        </th>
      </tr>
      <tr className="text-gray-300 border-b border-gray-700">
        <th className="py-4 px-6 text-lg font-medium uppercase tracking-wide">
          Item
        </th>
        <th className="py-4 px-6 text-lg font-medium uppercase tracking-wide">
          Expiry Date
        </th>
        <th className="py-4 px-6 text-lg font-medium uppercase tracking-wide">
          Quantity
        </th>
        <th className="py-4 px-6 text-lg font-medium uppercase tracking-wide">
          Days Left
        </th>
        <th className="py-4 px-6 text-lg font-medium uppercase tracking-wide">
          Delete
        </th>
      </tr>
    </thead>

    {/* Table Body */}
    <tbody className="bg-gray-900 text-white">
      {data.length > 0 ? (
        data.map((i, index) => (
          <tr
            key={index}
            className={`transition duration-300 ease-in-out ${
              i.daysLeft <= 0 ? 'bg-red-700 hover:bg-gray-700 bg-opacity-40' : 'hover:bg-gray-700'
            }`}
          >
            <td className="py-4 px-6 text-center text-base">{i.item}</td>
            <td className="py-4 px-6 text-center text-base">{i.expire}</td>
            <td className="py-4 px-6 text-center text-base">{i.quantity}</td>
            <td
              className={`py-4 px-6 text-center text-base font-semibold ${
                i.daysLeft <= 5 ? 'text-red-400' : 'text-yellow-400'
              }`}
            >
              {i.daysLeft}
            </td>
            <td
              onClick={() => handledelete(i.id)}
              className="flex justify-center items-center py-3 px-4 cursor-pointer hover:bg-red-600 rounded-full transition duration-300 transform hover:scale-110"
            >
              <lord-icon
                src="https://cdn.lordicon.com/skkahier.json"
                trigger="hover"
                colors="primary:#fff"
                style={{ width: '28px', height: '28px' }}
              />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan="5"
            className="py-8 text-center text-gray-400 text-xl font-semibold"
          >
            No items found in inventory
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

  
  )
}


export default Table
