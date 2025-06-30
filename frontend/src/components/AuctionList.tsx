import React, { useEffect, useState } from "react";
import { getAuctions } from "../api/api";
import { Link } from "react-router-dom";

interface Auction {
  id: number;
  name: string;
  description: string;
  startingPrice: number;
  duration: number;
  createdAt: string;
  bids: { amount: number }[];
}

const AuctionList: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    getAuctions().then(setAuctions);
  }, []);

  return (
    <div>
      <h2>All Auctions</h2>
      <ul>
        {auctions.map((auction) => {
          const highestBid =
            auction.bids.reduce(
              (max, bid) => (Number(bid.amount) > max ? Number(bid.amount) : max),
              Number(auction.startingPrice)
            );

          const timeLeft =
            auction.duration -
            Math.floor((Date.now() - new Date(auction.createdAt).getTime()) / 1000);

          return (
            <li key={auction.id} style={{ marginBottom: "1rem" }}>
              <h3>{auction.name}</h3>
              <p>{auction.description}</p>
              <p>
                Highest Bid: ${highestBid} | Time Left:{" "}
                {timeLeft > 0 ? `${timeLeft} sec` : "Expired"}
              </p>
              <Link to={`/auction/${auction.id}`}>View Auction</Link>
            </li>
          );
        })}
      </ul>
      <Link to="/create">Create New Auction</Link>
    </div>
  );
};

export default AuctionList;
