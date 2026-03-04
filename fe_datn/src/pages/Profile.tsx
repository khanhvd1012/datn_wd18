import { useEffect, useState } from "react";
import { getMeAPI } from "../services/authService";

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getMeAPI().then((data) => {
      setUser(data.user);
    });
  }, []);

  return (
    <div>
      <h2>Profile</h2>

      {user && (
        <>
          <p>ID: {user._id}</p>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
        </>
      )}
    </div>
  );
}