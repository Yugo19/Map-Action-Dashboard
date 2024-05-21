jest.mock('react-leaflet', () => ({
    MapContainer: ({ children }) => <div>{children}</div>,
    TileLayer: () => <div>TileLayer</div>,
    Marker: () => <div>Marker</div>,
    Popup: () => <div>Popup</div>,
  }));
  
  jest.mock('leaflet', () => ({
    ...jest.requireActual('leaflet'),
    map: () => ({
      setView: jest.fn(),
      addLayer: jest.fn(),
      remove: jest.fn(),
    }),
  }));
  