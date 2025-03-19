import axios from "axios";
import React, { useEffect, useState } from "react";

export default function CountryFlag({ country }) {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFlag = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${country}?fields=flags`
        );
        setLink(response.data[0]?.flags?.svg || "");
      } catch (error) {
        console.error("Error fetching flag:", error);
      } finally {
        setLoading(false);
      }
    };

    if (country) getFlag();
  }, [country]);

  return loading ? (
    <p>Loading flag...</p>
  ) : link ? (
    <img src={link} alt={country} width="50" />
  ) : (
    <p>Flag not found</p>
  );
}
