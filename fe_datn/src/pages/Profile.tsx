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
          <p>{user._id}</p>
        </>
      )}

    </div>
  );
}
