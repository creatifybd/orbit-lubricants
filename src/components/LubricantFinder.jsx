import React, { useState } from 'react';
import { ArrowRight, Bike, Car, Factory, RefreshCcw, Sliders, Truck, Zap } from 'lucide-react';
import { useCms } from '../context/CmsContext';

const icons = { motorcycle: Bike, automotive: Car, cng: Zap, 'heavy-duty': Truck, transmission: Sliders, monograde: Factory };

export const LubricantFinder = ({ onSelectProduct }) => {
  const { data } = useCms();
  const [category, setCategory] = useState('motorcycle');
  const matches = data.products.filter((item) => item.category === category);

  return (
    <div className="finder-panel">
      <div className="section-head center">
        <span className="premium-kicker dark">Application browser</span>
        <h2>Find the relevant product range</h2>
        <p>Select an application to view matching Orbit products. Final viscosity and fluid selection must follow the vehicle or equipment manufacturer’s manual.</p>
      </div>
      <div className="finder-categories">
        {data.categories.map((item) => {
          const Icon = icons[item.id] || RefreshCcw;
          return <button key={item.id} className={category === item.id ? 'active' : ''} onClick={() => setCategory(item.id)}><Icon size={22} /><span>{item.name}</span></button>;
        })}
      </div>
      <div className="finder-results">
        {matches.map((item) => (
          <article key={item.id} className="finder-result">
            <img src={item.image} alt={item.name} />
            <div><span>{item.viscosity} · {item.packing}</span><h3>{item.name}</h3><p>{item.apiGrade}</p></div>
            <button className="btn btn-primary btn-sm" onClick={() => onSelectProduct(item)}>Enquire <ArrowRight size={15} /></button>
          </article>
        ))}
      </div>
      <p className="finder-note">This tool filters the catalog by application; it is not a technical recommendation or substitute for the OEM manual.</p>
    </div>
  );
};
