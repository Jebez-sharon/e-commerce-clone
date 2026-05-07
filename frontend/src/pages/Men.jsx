import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Men() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/products?category=men");
  }, []);
  return null;
}

export default Men;