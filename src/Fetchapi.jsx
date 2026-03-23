import React, { useState ,useEffect } from 'react'
 

function Fetchapi() {
     const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  
 

      useEffect(() => {

         console.log("hello Api");

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {

        console.log(res);
        return res.json();

      })
      
      .then((data) => setUsers(data));

  }, []);
  return (
      <div>

      <h2>Counter</h2>
      <p>{count}</p>

      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>

      <h2>User List</h2>

      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}

    </div>
  )
}

export default Fetchapi