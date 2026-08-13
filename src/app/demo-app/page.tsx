"use client";
import React from 'react';
import Image from 'next/image';

export default function DemoApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff', color: '#333' }}>
      {/* 1. Improper Heading Hierarchy */}
      <main>
  <h4>Flex Pilot Vulnerable Target App</h4>
</main>
      
      {/* 2. Missing alt text on image */}
      <div>
        <Image src="https://via.placeholder.com/150" alt="Placeholder" width={150} height={150} />
      </div>

      <div style={{ marginTop: '20px' }}>
        {/* 3. Missing form labels */}
        <input type="text" placeholder="Enter your email" style={{ padding: '10px', border: '1px solid #ccc' }} />
        
        {/* 4. Invalid button semantics (div as button without role/keypress) */}
        <div 
          onClick={() => alert("Clicked!")} 
          style={{ display: 'inline-block', padding: '10px', backgroundColor: 'blue', color: 'white', cursor: 'pointer', marginLeft: '10px' }}
        >
          Subscribe
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        {/* 5. Low contrast text (WCAG AAA / AA failure) */}
        <p style={{ color: '#333333', backgroundColor: '#fff' }}>This text has very low contrast and is hard to read.</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        {/* 6. Missing aria-label on icon-only button */}
        <button style={{ padding: '10px' }} aria-label="Search">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {/* 7. Duplicate IDs */}
        <p id="duplicate-id">First paragraph with duplicate ID</p>
        <p id="duplicate-id">Second paragraph with duplicate ID</p>
      </div>

      {/* 8. Keyboard trap / Missing focus indicators - typically achieved via CSS outline: none */}
      <style dangerouslySetInnerHTML={{__html: `
        *:focus { outline: none !important; }
      `}} />
    </div>
  );
}
