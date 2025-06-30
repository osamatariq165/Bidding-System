import React, { useState } from "react";
import { createAuction } from "../api/api";
import { useNavigate } from "react-router-dom";

const CreateAuction: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    startingPrice: "",
    duration: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAuction({
      name: form.name,
      description: form.description,
      startingPrice: Number(form.startingPrice),
      duration: Number(form.duration),
    });
    navigate("/");
  };

  return (
    <div>
      <h2>Create Auction</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="Starting Price"
          type="number"
          value={form.startingPrice}
          onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
          required
        />
        <input
          placeholder="Duration (seconds)"
          type="number"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateAuction;
