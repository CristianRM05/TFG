import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export default function LocationAutocomplete({ value, onChange, onValidityChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google) {
      setAutocompleteService(new google.maps.places.AutocompleteService());
      setPlacesService(new google.maps.places.PlacesService(document.createElement('div')));
    }
  }, []);

  useEffect(() => {
    if (!autocompleteService || !value) return;

    autocompleteService.getPlacePredictions({ input: value }, (results) => {
      setPredictions(results || []);
    });
  }, [value, autocompleteService]);

  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      const map = new google.maps.Map(mapRef.current, {
        center: selectedLocation,
        zoom: 15,
      });

      new google.maps.Marker({
        map,
        position: selectedLocation,
      });

      setMapInstance(map);
    }
  }, [selectedLocation]);

  const handleSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesService) return;

    placesService.getDetails({ placeId: prediction.place_id }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setSelectedLocation(location);
        onChange(place.formatted_address || prediction.description);
        onValidityChange?.(true); // ✅ ubicación válida
      } else {
        onValidityChange?.(false);
      }
    });

    setPredictions([]);
  };

  // Invalidar si el valor cambia manualmente
  useEffect(() => {
    onValidityChange?.(false);
  }, [value]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Introduce tu ubicación"
      />

      {predictions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(prediction)}
            >
              {prediction.description}
            </div>
          ))}
        </div>
      )}

      {selectedLocation && (
        <div ref={mapRef} className="w-full h-40 mt-2 rounded border shadow-sm" />
      )}
    </div>
  );
}
