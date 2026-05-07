import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Kids() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/products?category=kids");
  }, []);
  return null;
}

export default Kids;