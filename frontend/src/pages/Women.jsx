import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Women() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/products?category=women");
  }, []);
  return null;
}

export default Women;