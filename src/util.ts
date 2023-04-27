function convertToInteger(latitude: number, longitude: number): [string, string] {
    // Get the number of decimal places for each value
    const latitudeDecimals = (latitude.toString().split('.')[1] || '').length;
    const longitudeDecimals = (longitude.toString().split('.')[1] || '').length;
  
    // Calculate the multiplier needed to convert each value to an integer
    const multiplier = Math.pow(10, Math.max(latitudeDecimals, longitudeDecimals));
  
    // Multiply the values and round them to integers
    const latInt = Math.round(latitude * multiplier).toString();
    const longInt = Math.round(longitude * multiplier).toString();
  
    return [latInt, longInt];
  }