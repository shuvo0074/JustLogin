import React from 'react';

describe('HomeScreen', () => {
  it('should be importable', () => {
    // Just test that the component can be imported
    const { HomeScreen } = require('../HomeScreen');
    expect(HomeScreen).toBeDefined();
    expect(typeof HomeScreen).toBe('function');
  });
});
