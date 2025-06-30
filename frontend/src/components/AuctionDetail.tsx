import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuction, placeBid } from "../api/api";
import { io } from "socket.io-client";

// const socket = io("http://localhost:3000");
const socket = io(import.meta.env.VITE_API_URL);

interface Auction {
  id: number;
  name: string;
  description: string;
  startingPrice: number;
  duration: number;
  createdAt: string;
  bids: { amount: number }[];
}

const AuctionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");

  const fetchAuction = () => {
    getAuction(Number(id)).then(setAuction);
  };

  useEffect(() => {
    fetchAuction();

    socket.on("bidUpdate", (data) => {
      if (data.itemId === Number(id)) {
        fetchAuction();
      }
    });

    return () => {
      socket.off("bidUpdate");
    };
  }, [id]);

  const handleBid = async () => {
    setError("");
    try {
      await placeBid({
        itemId: Number(id),
        userId: 1, // you can improve this to pick a user
        amount: Number(bidAmount),
      });
      setBidAmount("");
      fetchAuction();
    } catch (e: any) {
      setError(e.response?.data?.message || "Error placing bid");
    }
  };

  const goBack = () => {
    console.log('Going to previous page...')
    navigate("/");
  }

  if (!auction) return <div>Loading...</div>;

  const highestBid =
    auction.bids.reduce(
      (max, bid) => (Number(bid.amount) > max ? Number(bid.amount) : max),
      Number(auction.startingPrice)
    );

  const timeLeft =
    auction.duration -
    Math.floor((Date.now() - new Date(auction.createdAt).getTime()) / 1000);

  return (
    <div>
      <h2>{auction.name}</h2>
      <p>{auction.description}</p>
      <p>Highest Bid: ${highestBid}</p>
      <p>Time Left: {timeLeft > 0 ? `${timeLeft} sec` : "Expired"}</p>

      {timeLeft > 0 && (
        <div>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter bid amount"
          />
          <button onClick={handleBid}>Place Bid</button>
        </div>
      )}
      { timeLeft < 0 && (
        <div>
            <button onClick={goBack}>Go Back</button>
        </div>
      )} 
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AuctionDetail;
