import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { Car, Truck, Factory, Bike, Sliders, Check, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

export const LubricantFinder = ({ onSelectProduct }) => {
  const { data } = useCms();
  const { products } = data;

  const [step, setStep] = useState(1);
  const [appType, setAppType] = useState('automotive');
  const [condition, setCondition] = useState('heavy');

  const appOptions = [
    { id: 'automotive', title: 'Passenger Car / SUV', desc: 'Gasoline, Hybrid & Light Diesel', icon: Car },
    { id: 'heavy-duty', title: 'Commercial Diesel Fleet', desc: 'Trucks, Buses & Excavators', icon: Truck },
    { id: 'industrial', title: 'Industrial Plant', desc: 'Manufacturing & Hydraulics', icon: Factory },
    { id: 'motorcycle', title: 'Motorcycle & Scooter', desc: '4T Engine & Clutch Protection', icon: Bike }
  ];

  const conditionOptions = [
    { id: 'heavy', title: 'Severe Operating / Heavy Load', desc: 'High temperatures, long-distance haul, tropical weather' },
    { id: 'synthetic', title: 'Maximum Efficiency & Performance', desc: 'Turbocharged engines requiring fully synthetic oil' },
    { id: 'standard', title: 'Regular Maintenance Routine', desc: 'Standard city driving & light industrial applications' }
  ];

  // Find matching product based on state
  const matchedProducts = products.filter(p => {
    if (appType === 'automotive') return p.category === 'automotive';
    if (appType === 'heavy-duty') return p.category === 'heavy-duty';
    if (appType === 'industrial') return p.category === 'industrial' || p.category === 'hydraulic';
    if (appType === 'motorcycle') return p.category === 'motorcycle';
    return true;
  });

  const recommendedProduct = matchedProducts[0] || products[0];

  return (
    <div className="glass-card" style={{
      padding: '2.5rem',
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
        <span className="eyebrow">
          <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
          SMART RECOMMENDATION ENGINE
        </span>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: '0.6rem' }}>
          Interactive Lubricant Finder
        </h2>
        <p style={{ color: 'var(--steel)' }}>
          Answer 2 quick questions to get the exact formulated Orbit oil grade for your machinery or vehicle.
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
        {[
          { num: 1, title: 'Select Application' },
          { num: 2, title: 'Operating Conditions' },
          { num: 3, title: 'Recommended Product' }
        ].map(s => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step >= s.num ? 'var(--orange)' : 'var(--line)',
              color: step >= s.num ? '#FFFFFF' : 'var(--steel)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              {s.num}
            </div>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: step === s.num ? 700 : 500,
              color: step === s.num ? 'var(--navy)' : 'var(--steel)'
            }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Application */}
      {step === 1 && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            {appOptions.map(item => {
              const IconComponent = item.icon;
              const selected = appType === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setAppType(item.id)}
                  style={{
                    background: selected ? 'var(--navy)' : '#FFFFFF',
                    color: selected ? '#FFFFFF' : 'var(--navy)',
                    border: `2px solid ${selected ? 'var(--orange)' : 'var(--line)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.22s ease'
                  }}
                >
                  <IconComponent size={32} style={{ color: selected ? 'var(--orange)' : 'var(--blue)', marginBottom: '1rem' }} />
                  <h4 style={{ color: selected ? '#FFFFFF' : 'var(--navy)', fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ color: selected ? 'rgba(255,255,255,0.7)' : 'var(--steel)', fontSize: '0.86rem' }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'right' }}>
            <button onClick={() => setStep(2)} className="btn btn-primary">
              <span>Next: Select Conditions</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Conditions */}
      {step === 2 && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {conditionOptions.map(item => {
              const selected = condition === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setCondition(item.id)}
                  style={{
                    background: selected ? 'rgba(10, 37, 64, 0.05)' : '#FFFFFF',
                    border: `2px solid ${selected ? 'var(--orange)' : 'var(--line)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem 1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <h4 style={{ color: 'var(--navy)', fontSize: '1rem', marginBottom: '0.2rem' }}>
                      {item.title}
                    </h4>
                    <p style={{ color: 'var(--steel)', fontSize: '0.88rem' }}>
                      {item.desc}
                    </p>
                  </div>
                  {selected && <Check style={{ color: 'var(--orange-deep)' }} />}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} className="btn btn-outline">
              Back
            </button>
            <button onClick={() => setStep(3)} className="btn btn-primary">
              <span>See Match</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Result */}
      {step === 3 && (
        <div style={{ textAlign: 'center', maxWidth: '540px', margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0A2540 0%, #051526 100%)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: '#F7941D',
              background: 'rgba(247,148,29,0.15)',
              padding: '0.3rem 0.8rem',
              borderRadius: '999px',
              marginBottom: '1rem',
              display: 'inline-block'
            }}>
              RECOMMENDED MATCH: 99.4% SUITABILITY
            </span>

            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
              {recommendedProduct.name}
            </h3>

            <div style={{ fontSize: '1rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
              Grade: <strong style={{ color: '#FFFFFF' }}>{recommendedProduct.viscosity}</strong> ({recommendedProduct.apiGrade})
            </div>

            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              {recommendedProduct.description}
            </p>

            <button 
              onClick={() => onSelectProduct(recommendedProduct)}
              className="btn btn-primary btn-lg" 
              style={{ width: '100%' }}
            >
              <span>View Product Specs & Request Quote</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <button 
            onClick={() => setStep(1)} 
            className="btn btn-outline" 
            style={{ gap: '6px' }}
          >
            <RotateCcw size={14} />
            <span>Start New Recommendation</span>
          </button>
        </div>
      )}
    </div>
  );
};
